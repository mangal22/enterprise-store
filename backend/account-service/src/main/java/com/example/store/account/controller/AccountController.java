package com.example.store.account.controller;

import com.example.store.account.dto.AccountDtos.AuthResponse;
import com.example.store.account.dto.AccountDtos.LoginRequest;
import com.example.store.account.dto.AccountDtos.RegisterRequest;
import com.example.store.account.service.AccountService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

/**
 * REST endpoints for user registration and login.
 * The frontend uses these endpoints to create sessions and keep JWT-based access tokens.
 */
@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/auth")
public class AccountController {
    private final AccountService service;

    /**
     * Injects the auth service used by the API layer.
     */
    public AccountController(AccountService service) { this.service = service; }

    /**
     * Creates a new user account and returns a signed auth response.
     */
    @PostMapping("/register") @ResponseStatus(HttpStatus.CREATED) public Mono<AuthResponse> register(@RequestBody RegisterRequest request) { return service.register(request); }

    /**
     * Authenticates an existing user and returns the generated JWT and profile details.
     */
    @PostMapping("/login") public Mono<AuthResponse> login(@RequestBody LoginRequest request) { return service.login(request); }
}
