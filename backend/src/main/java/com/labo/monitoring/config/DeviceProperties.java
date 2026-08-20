package com.labo.monitoring.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Data;

@Data
@ConfigurationProperties(prefix = "device")
public class DeviceProperties {

  /**
   * Délai (en secondes) sans heartbeat au-delà duquel un appareil est marqué
   * OFFLINE.
   */
  private int heartbeatTimeoutSeconds = 120;
}
