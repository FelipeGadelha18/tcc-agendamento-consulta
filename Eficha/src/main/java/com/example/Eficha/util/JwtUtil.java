package com.example.Eficha.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    @Value("${jwt.secret:minhaSenhaSecretaMuitoForteEComMuitos32Characters!@#$}")
    private String secret;

    @Value("${jwt.expiration:86400000}")
    private long expiration;

    private SecretKey getSigningKey() {
        byte[] keyBytes = secret.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(Long userId, String cpf, String tipo) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("cpf", cpf);
        claims.put("tipo", tipo);

        return createToken(claims, String.valueOf(userId));
    }

    private String createToken(Map<String, Object> claims, String subject) {
        Date now = new Date();
        Date expirationTime = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(now)
                .expiration(expirationTime)
                .signWith(getSigningKey())
                .compact();
    }

    public Long extractUserId(String token) {
        try {
            Claims claims = getAllClaims(token);
            return Long.parseLong(claims.getSubject());
        } catch (Exception e) {
            return null;
        }
    }

    public String extractCpf(String token) {
        try {
            Claims claims = getAllClaims(token);
            return (String) claims.get("cpf");
        } catch (Exception e) {
            return null;
        }
    }

    public String extractTipo(String token) {
        try {
            Claims claims = getAllClaims(token);
            return (String) claims.get("tipo");
        } catch (Exception e) {
            return null;
        }
    }

    public boolean validateToken(String token) {
        try {
            getAllClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private Claims getAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extractTokenFromHeader(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }
}
