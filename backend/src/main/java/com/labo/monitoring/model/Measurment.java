package com.labo.monitoring.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.Data;

@Data
@Document(collection = "measurments")
public class Measurment {

  @Id
  private String id;

  private String deviceId;
  private String zoneId;

  @Field("temperature")
  private int temperature;

  @Field("humidity")
  private int humidity;

  @Field("timestamp")
  private long timestamp;

  @Field("co_raw")
  private int coRaw;

  @Field("luminosity")
  private int luminosity;

  @Field("motion_detected")
  private boolean motionDetected;

  @Field("fire_detected")
  private boolean fireDetected;
}
