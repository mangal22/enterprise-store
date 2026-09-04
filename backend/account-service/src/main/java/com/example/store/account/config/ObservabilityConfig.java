package com.example.store.account.config;

import io.micrometer.observation.ObservationRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** Supplies the observation registry used by Spring and Micrometer instrumentation. */
@Configuration
public class ObservabilityConfig {
    @Bean ObservationRegistry observationRegistry() { return ObservationRegistry.create(); }
}
