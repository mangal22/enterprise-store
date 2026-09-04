package com.example.store.product.controller;

import com.example.store.product.dto.ProductDtos.CreateProductRequest;
import com.example.store.product.dto.ProductDtos.ProductResponse;
import com.example.store.product.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * REST controller that exposes product catalog endpoints to the frontend.
 * This layer handles HTTP requests and delegates the actual domain work to the service layer.
 */
@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService service;

    /**
     * Injects the catalog service used by all endpoints in this controller.
     */
    public ProductController(ProductService service) { this.service = service; }

    /**
     * Returns the full catalog for the storefront page.
     */
    @GetMapping public Flux<ProductResponse> findAll() { return service.findAll(); }

    /**
     * Returns one product by id for detail or edit operations.
     */
    @GetMapping("/{id}") public Mono<ProductResponse> findById(@PathVariable String id) { return service.findById(id); }

    /**
     * Creates a new product from the supplied payload and returns the created record.
     */
    @PostMapping @ResponseStatus(HttpStatus.CREATED) public Mono<ProductResponse> create(@RequestBody CreateProductRequest request) { return service.create(request); }

    /**
     * Updates an existing product and returns the new stored version.
     */
    @PutMapping("/{id}") public Mono<ProductResponse> update(@PathVariable String id, @RequestBody CreateProductRequest request) { return service.update(id, request); }

    /**
     * Removes a product from the catalog with a 204 response status.
     */
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public Mono<Void> delete(@PathVariable String id) { return service.delete(id); }
}
