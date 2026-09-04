package com.example.store.order.service;

import com.example.store.order.domain.Order;

/** Abstraction for publishing order-created events without coupling business logic to a broker. */
public interface MessageProducer { void publishOrderCreated(Order order); }
