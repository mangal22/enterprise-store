package com.example.store.product.dto;

import java.math.BigDecimal;

/**
 * DTOs used by the product microservice for request and response payloads.
 * These records keep the API contract small and explicit for the frontend.
 */
public final class ProductDtos {
    private ProductDtos() { }

    /**
     * Payload used when creating or editing a product.
     */
    public record CreateProductRequest(String name, String description, BigDecimal price, int stock) { }

    /**
     * Product data returned to the client after persistence.
     */
    public record ProductResponse(String id, String name, String description, BigDecimal price, int stock, Long version) { }
}
