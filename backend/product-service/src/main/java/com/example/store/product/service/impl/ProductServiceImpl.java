package com.example.store.product.service.impl;

import com.example.store.product.domain.Product;
import com.example.store.product.dto.ProductDtos.CreateProductRequest;
import com.example.store.product.dto.ProductDtos.ProductResponse;
import com.example.store.product.repository.ProductRepository;
import com.example.store.product.service.ProductService;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/** Implements reactive catalog CRUD operations and maps stored products to API responses. */
@Service
public class ProductServiceImpl implements ProductService {
    private final ProductRepository repository;

    /**
     * Creates the service with the reactive MongoDB repository dependency.
     */
    public ProductServiceImpl(ProductRepository repository) { this.repository = repository; }

    /**
     * Retrieves all products in the catalog and converts each Mongo document into a response DTO.
     */
    public Flux<ProductResponse> findAll() { return repository.findAll().map(this::toResponse); }

    /**
     * Looks up one product by id and turns a missing record into a domain-specific error.
     */
    public Mono<ProductResponse> findById(String id) { return repository.findById(id).switchIfEmpty(Mono.error(new NoSuchElementException("Product not found"))).map(this::toResponse); }

    /**
     * Persists a new product using the incoming request payload.
     */
    public Mono<ProductResponse> create(CreateProductRequest request) { return repository.save(new Product(null, request.name(), request.description(), request.price(), request.stock(), null)).map(this::toResponse); }

    /**
     * Updates an existing product while preserving the current optimistic locking version.
     */
    public Mono<ProductResponse> update(String id, CreateProductRequest request) {
        return repository.findById(id)
                .switchIfEmpty(Mono.error(new NoSuchElementException("Product not found")))
                .flatMap(existing -> repository.save(new Product(existing.id(), request.name(), request.description(), request.price(), request.stock(), existing.version())))
                .map(this::toResponse);
    }

    /**
     * Deletes a product from MongoDB using its identifier.
     */
    public Mono<Void> delete(String id) { return repository.deleteById(id); }

    /**
     * Maps the Mongo-backed product entity to the public API response model.
     */
    private ProductResponse toResponse(Product product) { return new ProductResponse(product.id(), product.name(), product.description(), product.price(), product.stock(), product.version()); }
}
