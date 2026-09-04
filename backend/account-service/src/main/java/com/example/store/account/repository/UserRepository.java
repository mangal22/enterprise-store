package com.example.store.account.repository;

import com.example.store.account.domain.User;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Mono;

/** Reactive persistence gateway for users, including case-insensitive email lookup during login. */
public interface UserRepository extends ReactiveMongoRepository<User, String> {
    Mono<User> findByEmailIgnoreCase(String email);
}
