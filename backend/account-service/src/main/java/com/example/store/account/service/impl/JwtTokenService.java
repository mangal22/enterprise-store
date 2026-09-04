package com.example.store.account.service.impl;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtTokenService {
    private final String secret;
    private final long ttlSeconds;

    /**
     * Creates the token service using the configured signing secret and TTL value.
     */
    public JwtTokenService(@Value("${account.jwt.secret}") String secret, @Value("${account.jwt.ttl-seconds}") long ttlSeconds) { this.secret = secret; this.ttlSeconds = ttlSeconds; }

    /**
     * Builds a compact JWT containing the user id, name, email, and expiration timestamp.
     */
    public String create(String userId, String name, String email) {
        String header = encode("{\"alg\":\"HS256\",\"typ\":\"JWT\"}");
        String payload = encode("{\"sub\":\"" + escape(userId) + "\",\"name\":\"" + escape(name) + "\",\"email\":\"" + escape(email) + "\",\"exp\":" + (Instant.now().getEpochSecond() + ttlSeconds) + "}");
        String content = header + "." + payload;
        return content + "." + sign(content);
    }

    /**
     * Base64-url encodes a JSON string as required for JWT parts.
     */
    private String encode(String value) { return Base64.getUrlEncoder().withoutPadding().encodeToString(value.getBytes(StandardCharsets.UTF_8)); }

    /**
     * Signs the JWT header.payload content using HMAC-SHA256.
     */
    private String sign(String value) { try { Mac mac = Mac.getInstance("HmacSHA256"); mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256")); return Base64.getUrlEncoder().withoutPadding().encodeToString(mac.doFinal(value.getBytes(StandardCharsets.UTF_8))); } catch (Exception ex) { throw new IllegalStateException("JWT signing failed", ex); } }

    /**
     * Escapes embedded quotes and backslashes so the JWT payload stays valid JSON.
     */
    private String escape(String value) { return value.replace("\\", "\\\\").replace("\"", "\\\""); }
}
