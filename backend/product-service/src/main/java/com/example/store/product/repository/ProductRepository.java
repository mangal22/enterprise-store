package com.example.store.product.repository;

import com.example.store.product.domain.Product;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;

/**
 * Reactive MongoDB repository for product persistence.
 * Spring Data generates the CRUD operations automatically for the product collection.
 */
public interface ProductRepository extends ReactiveMongoRepository<Product, String> { }
