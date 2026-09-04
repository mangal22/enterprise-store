package com.example.store.account.service.impl;

import com.example.store.account.domain.User;
import com.example.store.account.dto.AccountDtos.AuthResponse;
import com.example.store.account.dto.AccountDtos.LoginRequest;
import com.example.store.account.dto.AccountDtos.RegisterRequest;
import com.example.store.account.repository.UserRepository;
import com.example.store.account.service.AccountService;
import java.time.Instant;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class AccountServiceImpl implements AccountService {
    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenService tokens;

    /**
     * Creates the account service with the repository, password encoder, and JWT utility.
     */
    public AccountServiceImpl(UserRepository users, PasswordEncoder passwordEncoder, JwtTokenService tokens) { this.users = users; this.passwordEncoder = passwordEncoder; this.tokens = tokens; }

    /**
     * Validates user input, ensures the email is unique, saves the user, and issues a JWT.
     */
    public Mono<AuthResponse> register(RegisterRequest request) {
        if (request.name() == null || request.name().isBlank() || request.email() == null || request.email().isBlank() || request.password() == null || request.password().length() < 8) return Mono.error(new IllegalArgumentException("Name, email, and a password of at least 8 characters are required"));
        return users.findByEmailIgnoreCase(request.email()).flatMap(existing -> Mono.<AuthResponse>error(new IllegalArgumentException("An account with this email already exists"))).switchIfEmpty(Mono.defer(() -> users.save(new User(null, request.name().trim(), request.email().trim().toLowerCase(), passwordEncoder.encode(request.password()), Instant.now())).map(this::toResponse)));
    }

    /**
     * Validates the login attempt, checks the stored password hash, and returns a signed token.
     */
    public Mono<AuthResponse> login(LoginRequest request) { return users.findByEmailIgnoreCase(request.email()).filter(user -> passwordEncoder.matches(request.password(), user.passwordHash())).switchIfEmpty(Mono.error(new IllegalArgumentException("Invalid email or password"))).map(this::toResponse); }

    /**
     * Converts a domain user into the public auth response payload for the frontend.
     */
    private AuthResponse toResponse(User user) { return new AuthResponse(tokens.create(user.id(), user.name(), user.email()), user.id(), user.name(), user.email()); }
}
