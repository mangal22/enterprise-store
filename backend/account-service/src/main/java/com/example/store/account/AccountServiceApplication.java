package com.example.store.account;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/** Starts the account microservice, which owns registration, login, and JWT creation. */
@SpringBootApplication
public class AccountServiceApplication {
    public static void main(String[] args) { SpringApplication.run(AccountServiceApplication.class, args); }
}
