package com.example.store.order.service;

import com.example.store.order.dto.OrderDtos.CheckoutRequest;
import com.example.store.order.dto.OrderDtos.OrderResponse;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Flux;

/**
 * Business contract for order creation and retrieval operations.
 * The implementation stores a checkout and later exposes order history for a customer.
 */
public interface OrderService {
    /**
     * Creates a new confirmed order from a checkout request.
     */
    Mono<OrderResponse> checkout(CheckoutRequest request);

    /**
     * Returns all orders for a customer, newest first.
     */
    Flux<OrderResponse> history(String customerId);
}
