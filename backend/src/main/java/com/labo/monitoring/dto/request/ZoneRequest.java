package com.labo.monitoring.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ZoneRequest {

  @NotBlank(message = "Le nom de la zone est requis")
  private String name;

  private String description;
}
