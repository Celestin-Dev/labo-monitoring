package com.labo.monitoring.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * Canal temps réel utilisé pour pousser vers le frontend :
 * - /topic/alerts -> nouvelles alertes (Alert)
 * - /topic/measurements -> nouvelles mesures (Measurment)
 * - /topic/zones -> changement de statut d'une zone (Zone)
 * - /topic/devices -> changement de statut d'un appareil (Device)
 *
 * Le frontend React se connecte via SockJS + STOMP sur /ws.
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

  @Value("${app.cors.allowed-origins}")
  private String allowedOrigins;

  @Override
  public void configureMessageBroker(MessageBrokerRegistry registry) {
    registry.enableSimpleBroker("/topic");
    registry.setApplicationDestinationPrefixes("/app");
  }

  @Override
  public void registerStompEndpoints(StompEndpointRegistry registry) {
    registry.addEndpoint("/ws")
        .setAllowedOrigins(allowedOrigins.split(","));
  }
}
