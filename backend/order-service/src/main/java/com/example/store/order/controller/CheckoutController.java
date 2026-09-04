package com.example.store.order.controller;

import com.example.store.order.dto.OrderDtos.CheckoutRequest;
import com.example.store.order.dto.OrderDtos.OrderResponse;
import com.example.store.order.service.OrderService;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Flux;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/orders")
public class CheckoutController {
    private final OrderService service;
    public CheckoutController(OrderService service) { this.service = service; }
    @PostMapping("/checkout")
    @ResponseStatus(HttpStatus.CREATED)
    @CircuitBreaker(name = "productService", fallbackMethod = "checkoutFallback")
    public Mono<OrderResponse> checkout(@RequestBody CheckoutRequest request) { return service.checkout(request); }
    @GetMapping("/history/{customerId}") public Flux<OrderResponse> history(@PathVariable String customerId) { return service.history(customerId); }
    private Mono<OrderResponse> checkoutFallback(CheckoutRequest request, Throwable error) { return Mono.error(new IllegalStateException("Checkout temporarily unavailable", error)); }
}
