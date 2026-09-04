package com.example.store.account.domain;

import java.time.Instant;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/** MongoDB document representing a registered customer and the data needed for authentication. */
@Document("users")
public record User(@Id String id, String name, String email, String passwordHash, Instant createdAt) { }
