package com.example.store.account.dto;

/**
 * DTOs for authentication and account-related API endpoints.
 * These records define the request and response schema used by the account service.
 */
public final class AccountDtos {
    private AccountDtos() { }

    /**
     * Payload sent by the frontend when creating a new user account.
     */
    public record RegisterRequest(String name, String email, String password) { }

    /**
     * Payload sent when a user signs in with an existing account.
     */
    public record LoginRequest(String email, String password) { }

    /**
     * Auth response returned after successful registration or login.
     */
    public record AuthResponse(String token, String userId, String name, String email) { }

    /**
     * Basic user profile payload used for UI display and account data access.
     */
    public record UserResponse(String id, String name, String email) { }
}
