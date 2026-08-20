package com.labo.monitoring.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Data;

@Data
@ConfigurationProperties(prefix = "mqtt")
public class MqttProperties {

  private String host;
  private int port;
  private String username;
  private String password;
  private String clientId;
  private boolean useSsl;
  private Topics topics = new Topics();

  @Data
  public static class Topics {
    private String measurements;
    private String heartbeat;
    private String commands;
  }
}
