package com.example.store.product.service;

import com.example.store.product.dto.ProductDtos.CreateProductRequest;
import com.example.store.product.dto.ProductDtos.ProductResponse;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Defines the catalog operations exposed by the product microservice.
 * These methods allow the storefront to list, create, edit, and remove products.
 */
public interface ProductService {
    /**
     * Returns the full product catalog as a reactive stream.
     */
    Flux<ProductResponse> findAll();

    /**
     * Finds a single product by its unique identifier.
     */
    Mono<ProductResponse> findById(String id);

    /**
     * Creates a new product from the incoming request values.
     */
    Mono<ProductResponse> create(CreateProductRequest request);

    /**
     * Updates an existing product using the supplied fields.
     */
    Mono<ProductResponse> update(String id, CreateProductRequest request);

    /**
     * Deletes a product by its identifier.
     */
    Mono<Void> delete(String id);
}
