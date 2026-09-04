package com.example.store.product.domain;

import java.math.BigDecimal;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Represents a single product document stored in MongoDB.
 * Each record maps to the "products" collection and holds the catalog data
 * needed by the storefront and inventory management screens.
 */
@Document("products")
public record Product(@Id String id, String name, String description, BigDecimal price, int stock, @Version Long version) { }
