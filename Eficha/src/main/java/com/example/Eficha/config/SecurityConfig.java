package com.example.Eficha.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityConfig {

    // Desativa autenticação e CSRF (para testes)
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // desativa proteção CSRF
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll() // permite todas as requisições
            )
            .formLogin(form -> form.disable()) // desativa formulário de login padrão
            .httpBasic(basic -> basic.disable()); // desativa autenticação básica

        return http.build();
    }

    // Bean para criptografia de senha (BCrypt)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
