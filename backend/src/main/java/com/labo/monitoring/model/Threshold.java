package com.labo.monitoring.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.Data;

@Data
@Document(collection = "thresholds")
public class Threshold {

  @Id
  private String id;

  @Indexed(unique = true)
  @Field("zone_id")
  private String zoneId;

  @Field("min_temperature")
  private double minTemperature;

  @Field("max_temperature")
  private double maxTemperature;

  @Field("min_humidity")
  private double minHumidity;

  @Field("max_humidity")
  private double maxHumidity;

  @Field("co_max")
  private double coMax;

  @Field("luminosity_max")
  private double luminosityMax;

  @Field("enabled")
  private boolean enabled = true;
}
