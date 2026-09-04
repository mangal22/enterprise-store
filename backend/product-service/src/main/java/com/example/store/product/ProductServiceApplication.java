package com.example.store.product;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/** Starts the product microservice that serves catalog and inventory operations. */
@SpringBootApplication
public class ProductServiceApplication {
    public static void main(String[] args) { SpringApplication.run(ProductServiceApplication.class, args); }
}
