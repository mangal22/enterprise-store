package com.example.store.order.service.impl;

import com.example.store.order.domain.Order;
import com.example.store.order.dto.OrderDtos.CheckoutRequest;
import com.example.store.order.dto.OrderDtos.OrderResponse;
import com.example.store.order.repository.OrderRepository;
import com.example.store.order.service.MessageProducer;
import com.example.store.order.service.OrderService;
import java.time.Instant;
import org.bson.Document;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Flux;

/** Implements checkout persistence and history retrieval for the order microservice. */
@Service
public class OrderServiceImpl implements OrderService {
    private static final String ORDER_SEQUENCE_ID = "order-id";
    private static final String ORDER_SEQUENCE_COLLECTION = "sequences";
    private static final long FIRST_ORDER_ID = 10_000L;
    private static final long LAST_ORDER_ID = 99_999L;

    private final OrderRepository repository;
    private final MessageProducer producer;
    private final ReactiveMongoTemplate mongoTemplate;

    public OrderServiceImpl(OrderRepository repository, MessageProducer producer, ReactiveMongoTemplate mongoTemplate) {
        this.repository = repository;
        this.producer = producer;
        this.mongoTemplate = mongoTemplate;
    }

    public Mono<OrderResponse> checkout(CheckoutRequest request) {
        String customerId = request.customerId() == null || request.customerId().isBlank() ? "guest-" + java.util.UUID.randomUUID() : request.customerId();
        return nextOrderId()
                .map(String::valueOf)
                .flatMap(orderId -> repository.save(new Order(orderId, customerId, request.total(), "CONFIRMED", Instant.now())))
                .doOnNext(producer::publishOrderCreated)
                .map(saved -> new OrderResponse(saved.id(), saved.customerId(), saved.total(), saved.status(), saved.createdAt()));
    }

    public Flux<OrderResponse> history(String customerId) { return repository.findByCustomerIdOrderByCreatedAtDesc(customerId).map(saved -> new OrderResponse(saved.id(), saved.customerId(), saved.total(), saved.status(), saved.createdAt())); }

    private Mono<Long> nextOrderId() {
        Query query = Query.query(Criteria.where("_id").is(ORDER_SEQUENCE_ID));
        Update update = new Update().inc("value", 1);
        FindAndModifyOptions options = FindAndModifyOptions.options().upsert(true).returnNew(true);

        return mongoTemplate.findAndModify(query, update, options, Document.class, ORDER_SEQUENCE_COLLECTION)
                .switchIfEmpty(Mono.error(new IllegalStateException("Could not allocate an order ID.")))
                .map(sequence -> {
                    Object value = sequence.get("value");
                    if (!(value instanceof Number number)) {
                        throw new IllegalStateException("Order ID sequence contains an invalid value.");
                    }

                    long orderId = number.longValue() + FIRST_ORDER_ID - 1;
                    if (orderId < FIRST_ORDER_ID || orderId > LAST_ORDER_ID) {
                        throw new IllegalStateException("Order ID range is exhausted.");
                    }
                    return orderId;
                });
    }
}
