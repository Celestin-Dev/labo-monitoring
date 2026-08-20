package com.labo.monitoring.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProductRequest {

  @NotBlank(message = "Le nom du produit est requis")
  private String name;

  @NotBlank(message = "La référence est requise")
  private String reference;

  @NotBlank(message = "La zone est requise")
  private String zoneId;

  private double minTemperature;
  private double maxTemperature;
  private double minHumidity;
  private double maxHumidity;

  /** Niveau de danger de 0 (faible) à 3 (critique). */
  private double dangerLevel;
}
