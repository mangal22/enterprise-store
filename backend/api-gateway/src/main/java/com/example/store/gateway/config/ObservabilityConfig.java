package com.example.store.gateway.config;

import io.micrometer.observation.ObservationRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** Registers the shared observation component used to instrument gateway requests. */
@Configuration
public class ObservabilityConfig {
    @Bean
    ObservationRegistry observationRegistry() {
        return ObservationRegistry.create();
    }
}
