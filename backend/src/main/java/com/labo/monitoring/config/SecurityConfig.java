package com.labo.monitoring.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

/**
 * 
 * ⚠️ À REMPLACER avant toute mise en production : remplacer permitAll() par
 * de vraies règles d'autorisation (JWT, sessions, etc.) une fois le système
 * de login construit (voir page Configuration > Utilisateurs côté frontend).
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    return http
        .csrf(csrf -> csrf.disable())
        // Ne pas appeler .cors(...) ici : le CORS reste géré par CorsConfig.java
        // (WebMvcConfigurer) — appeler .cors(Customizer.withDefaults()) sans
        // CorsConfigurationSource bean dédié entrerait en conflit avec cette config.
        .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
        .httpBasic(basic -> basic.disable())
        .formLogin(form -> form.disable())
        .build();
  }
}