package com.labo.monitoring.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.Data;

@Data
@Document(collection = "products")
public class Product {

  @Id
  private String id;

  @Field("zone_id")
  private String zoneId;

  @Field("name")
  private String name;

  @Field("reference")
  private String reference;

  @Field("min_temperature")
  private double minTemperature;

  @Field("max_temperature")
  private double maxTemperature;

  @Field("min_humidity")
  private double minHumidity;

  @Field("max_humidity")
  private double maxHumidity;

  @Field("danger_level")
  private double dangerLevel;
}
