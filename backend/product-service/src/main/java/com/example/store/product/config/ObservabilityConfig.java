package com.example.store.product.config;

import io.micrometer.observation.ObservationRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** Supplies the observation registry used to instrument product-service activity. */
@Configuration
public class ObservabilityConfig {
    @Bean ObservationRegistry observationRegistry() { return ObservationRegistry.create(); }
}
