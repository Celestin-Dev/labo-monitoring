package com.labo.monitoring.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ThresholdRequest {

  @NotBlank(message = "La zone est requise")
  private String zoneId;

  private double minTemperature;
  private double maxTemperature;
  private double minHumidity;
  private double maxHumidity;
  private double coMax;
  private double luminosityMax;
  private boolean enabled = true;
}
