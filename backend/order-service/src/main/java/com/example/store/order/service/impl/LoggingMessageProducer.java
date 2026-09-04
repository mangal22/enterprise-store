package com.example.store.order.service.impl;

import com.example.store.order.domain.Order;
import com.example.store.order.service.MessageProducer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Simple local message producer used as a placeholder for a real broker.
 * It logs order-created events so the application can demonstrate event publication
 * without requiring Kafka or RabbitMQ during local development.
 */
@Component
public class LoggingMessageProducer implements MessageProducer {
    private static final Logger log = LoggerFactory.getLogger(LoggingMessageProducer.class);

    /**
     * Publishes an order-created event by writing a log message.
     */
    public void publishOrderCreated(Order order) { log.info("Published order.created event for {}", order.id()); }
}
