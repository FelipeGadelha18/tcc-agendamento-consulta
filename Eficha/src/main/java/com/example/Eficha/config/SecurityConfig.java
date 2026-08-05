package com.example.Eficha.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.example.Eficha.security.JwtAuthenticationFilter;

import java.util.Arrays;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // desativa proteção CSRF
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // configura CORS
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/administradores/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/recepcionistas/login").permitAll()

                        // Gerenciar Recepcionistas - somente ADM (tabela própria, independente do
                        // administrador)
                        .requestMatchers("/administradores/**").hasRole("ADM")
                        .requestMatchers("/recepcionistas/**").hasRole("ADM")

                        // Gerenciar Postos - somente ADM
                        .requestMatchers(HttpMethod.POST, "/postos/cadastrar").hasRole("ADM")
                        .requestMatchers(HttpMethod.PUT, "/postos/{id}").hasRole("ADM")
                        .requestMatchers(HttpMethod.DELETE, "/postos/{id}").hasRole("ADM")
                        .requestMatchers(HttpMethod.PUT, "/postos/{id}/policies").hasRole("ADM")
                        .requestMatchers(HttpMethod.POST, "/postos/{id}/bloquear-data").hasRole("ADM")
                        .requestMatchers(HttpMethod.DELETE, "/postos/{id}/bloquear-data/{data}").hasRole("ADM")
                        .requestMatchers(HttpMethod.GET, "/postos/{id}/datas-bloqueadas").hasRole("ADM")

                        // Fichas do dia / Leitura QR / Informações do posto - somente RECEPCIONISTA
                        .requestMatchers(HttpMethod.POST, "/postos/{id}/datas").hasRole("RECEPCIONISTA")
                        .requestMatchers(HttpMethod.DELETE, "/postos/{id}/datas/{data}").hasRole("RECEPCIONISTA")
                        .requestMatchers(HttpMethod.PUT, "/postos/{id}/resetar-fichas").hasRole("RECEPCIONISTA")
                        .requestMatchers(HttpMethod.POST, "/reservas/manual").hasRole("RECEPCIONISTA")
                        .requestMatchers(HttpMethod.GET, "/reservas/por-posto/**").hasRole("RECEPCIONISTA")
                        .requestMatchers(HttpMethod.GET, "/reservas/qr/**").hasRole("RECEPCIONISTA")
                        .requestMatchers(HttpMethod.PUT, "/reservas/posto/{postoId}/chamar-proximo")
                        .hasRole("RECEPCIONISTA")
                        .requestMatchers(HttpMethod.PUT, "/reservas/{id}/checkin").hasRole("RECEPCIONISTA")
                        .requestMatchers(HttpMethod.PUT, "/reservas/{id}/finalizar").hasRole("RECEPCIONISTA")
                        .requestMatchers(HttpMethod.PUT, "/reservas/{id}/no-show").hasRole("RECEPCIONISTA")
                        .requestMatchers(HttpMethod.PUT, "/reservas/{id}/confirmar").hasRole("RECEPCIONISTA")
                        .requestMatchers(HttpMethod.PUT, "/reservas/{id}/cancelar").hasRole("RECEPCIONISTA")

                        // Demais rotas (login, cadastro, área do paciente) seguem liberadas
                        .anyRequest().permitAll())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .formLogin(form -> form.disable()) // desativa formulário de login padrão
                .httpBasic(basic -> basic.disable()); // desativa autenticação básica

        return http.build();
    }

    // Bean para configuração de CORS
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:4200"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // Bean para criptografia de senha (BCrypt)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
