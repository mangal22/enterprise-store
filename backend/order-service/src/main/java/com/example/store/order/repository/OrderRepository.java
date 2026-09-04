package com.example.store.order.repository;

import com.example.store.order.domain.Order;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;

/**
 * Reactive MongoDB repository for order persistence.
 * It supports the normal CRUD methods plus a customer-specific historical query.
 */
public interface OrderRepository extends ReactiveMongoRepository<Order, String> {
    /**
     * Finds all orders for one customer, ordered newest-first for the history page.
     */
    Flux<Order> findByCustomerIdOrderByCreatedAtDesc(String customerId);
}
