package com.example.store.account.service;

import com.example.store.account.dto.AccountDtos.AuthResponse;
import com.example.store.account.dto.AccountDtos.LoginRequest;
import com.example.store.account.dto.AccountDtos.RegisterRequest;
import reactor.core.publisher.Mono;

/** Business boundary for creating accounts and authenticating existing customers. */
public interface AccountService {
    Mono<AuthResponse> register(RegisterRequest request);
    Mono<AuthResponse> login(LoginRequest request);
}
