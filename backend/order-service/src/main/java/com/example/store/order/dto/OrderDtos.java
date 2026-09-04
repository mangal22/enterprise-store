package com.example.store.order.dto;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * DTOs used by the order-service API.
 * The request carries checkout information while the response exposes stored order details.
 */
public final class OrderDtos {
    private OrderDtos() { }

    /**
     * Payload sent when a customer completes a checkout.
     */
    public record CheckoutRequest(String customerId, BigDecimal total) { }

    /**
     * Order data returned to the frontend after checkout or history lookup.
     */
    public record OrderResponse(String id, String customerId, BigDecimal total, String status, Instant createdAt) { }
}
