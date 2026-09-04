package com.example.store.order.config;

import io.micrometer.observation.ObservationRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** Provides the observation registry used to record order-service telemetry. */
@Configuration
public class ObservabilityConfig {
    @Bean ObservationRegistry observationRegistry() { return ObservationRegistry.create(); }
}
