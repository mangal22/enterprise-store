package com.example.store.order.domain;

import java.math.BigDecimal;
import java.time.Instant;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Represents a purchase order stored in MongoDB.
 * This record captures the customer, total amount, status, and creation time.
 */
@Document("orders")
public record Order(@Id String id, String customerId, BigDecimal total, String status, Instant createdAt) { }
