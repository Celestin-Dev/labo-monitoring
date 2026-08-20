package com.labo.monitoring.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DeviceRequest {

  @NotBlank(message = "Le nom de l'appareil est requis")
  private String name;

  @NotBlank(message = "La zone est requise")
  private String zoneId;

  private String ipAddress;

  private String type;
}
