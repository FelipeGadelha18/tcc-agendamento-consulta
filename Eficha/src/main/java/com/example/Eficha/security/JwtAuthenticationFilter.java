package com.example.Eficha.security;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.Eficha.util.JwtUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Lê o JWT do header Authorization e popula o SecurityContext com a role
 * (ROLE_ADM, ROLE_RECEPCIONISTA ou ROLE_PACIENTE) extraída do claim "tipo".
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String token = jwtUtil.extractTokenFromHeader(request.getHeader("Authorization"));

        if (token != null && jwtUtil.validateToken(token)
                && SecurityContextHolder.getContext().getAuthentication() == null) {
            String tipo = jwtUtil.extractTipo(token);
            Long userId = jwtUtil.extractUserId(token);
            Long idPosto = jwtUtil.extractIdPosto(token);

            if (tipo != null && userId != null) {
                AuthenticatedUser usuario = new AuthenticatedUser(userId, tipo, idPosto);
                List<SimpleGrantedAuthority> authorities = List
                        .of(new SimpleGrantedAuthority("ROLE_" + tipo));
                Authentication authentication = new UsernamePasswordAuthenticationToken(usuario, null, authorities);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }
}
