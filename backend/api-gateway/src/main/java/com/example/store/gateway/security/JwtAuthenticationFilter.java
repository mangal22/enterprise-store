package com.example.store.gateway.security;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.security.MessageDigest;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;
import tools.jackson.databind.ObjectMapper;

/** Verifies bearer JWTs and places their identity and role into the reactive security context. */
@Component
public class JwtAuthenticationFilter implements WebFilter {
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String secret;

    public JwtAuthenticationFilter(@Value("${account.jwt.secret}") String secret) {
        this.secret = secret;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String header = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (header == null || !header.startsWith("Bearer ")) {
            return chain.filter(exchange);
        }
        try {
            String token = header.substring(7);
            String[] sections = token.split("\\.");
            if (sections.length != 3 || !MessageDigest.isEqual(sign(sections[0] + "." + sections[1]), sections[2].getBytes(StandardCharsets.UTF_8))) {
                return unauthorized(exchange);
            }
            Map<String, Object> claims = objectMapper.readValue(
                    new String(Base64.getUrlDecoder().decode(sections[1]), StandardCharsets.UTF_8), Map.class);
            Object expiry = claims.get("exp");
            if (!(expiry instanceof Number) || ((Number) expiry).longValue() <= java.time.Instant.now().getEpochSecond()) {
                return unauthorized(exchange);
            }
            String subject = String.valueOf(claims.getOrDefault("sub", "anonymous"));
            String role = String.valueOf(claims.getOrDefault("role", "USER"));
            var authentication = new UsernamePasswordAuthenticationToken(subject, null,
                    List.of(new SimpleGrantedAuthority("ROLE_" + role)));
            return chain.filter(exchange).contextWrite(ReactiveSecurityContextHolder.withAuthentication(authentication));
        } catch (RuntimeException ex) {
            return unauthorized(exchange);
        }
    }

    private Mono<Void> unauthorized(ServerWebExchange exchange) {
        exchange.getResponse().setStatusCode(org.springframework.http.HttpStatus.UNAUTHORIZED);
        return exchange.getResponse().setComplete();
    }

    private byte[] sign(String value) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            return Base64.getUrlEncoder().withoutPadding().encode(mac.doFinal(value.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception ex) {
            throw new IllegalStateException("JWT verification failed", ex);
        }
    }
}
