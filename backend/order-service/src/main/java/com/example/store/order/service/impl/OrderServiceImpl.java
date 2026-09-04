package com.example.store.order.service.impl;

import com.example.store.order.domain.Order;
import com.example.store.order.dto.OrderDtos.CheckoutRequest;
import com.example.store.order.dto.OrderDtos.OrderResponse;
import com.example.store.order.repository.OrderRepository;
import com.example.store.order.service.MessageProducer;
import com.example.store.order.service.OrderService;
import java.time.Instant;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Flux;

/** Implements checkout persistence and history retrieval for the order microservice. */
@Service
public class OrderServiceImpl implements OrderService {
    private final OrderRepository repository;
    private final MessageProducer producer;
    public OrderServiceImpl(OrderRepository repository, MessageProducer producer) { this.repository = repository; this.producer = producer; }
    public Mono<OrderResponse> checkout(CheckoutRequest request) {
        String customerId = request.customerId() == null || request.customerId().isBlank() ? "guest-" + java.util.UUID.randomUUID() : request.customerId();
        Order order = new Order(null, customerId, request.total(), "CONFIRMED", Instant.now());
        return repository.save(order).doOnNext(producer::publishOrderCreated).map(saved -> new OrderResponse(saved.id(), saved.customerId(), saved.total(), saved.status(), saved.createdAt()));
    }
    public Flux<OrderResponse> history(String customerId) { return repository.findByCustomerIdOrderByCreatedAtDesc(customerId).map(saved -> new OrderResponse(saved.id(), saved.customerId(), saved.total(), saved.status(), saved.createdAt())); }
}
