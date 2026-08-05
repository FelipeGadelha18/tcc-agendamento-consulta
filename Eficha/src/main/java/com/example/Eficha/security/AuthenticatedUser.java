package com.example.Eficha.security;

/**
 * Representa o usuário autenticado extraído do JWT (tipo e posto vinculado,
 * quando houver).
 */
public record AuthenticatedUser(Long id, String tipo, Long idPosto) {
}
