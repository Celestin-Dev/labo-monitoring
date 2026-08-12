package com.labo.monitoring.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import com.labo.monitoring.enums.AlertType;
import com.labo.monitoring.enums.SeverityType;

import lombok.Data;

@Data
@Document(collection = "alerts")
public class Alert {

  @Id
  private String id;

  @Field("device_id")
  private String deviceId;

  @Field("zone_id")
  private String zoneId;

  @Field("type")
  private AlertType type;

  @Field("severity")
  private SeverityType severity;

  @Field("message")
  private String message;

  @Field("value")
  private String value;

  @Field("timestamp")
  private String timestamp;

  @Field("threshold")
  private Threshold threshold;

  @Field("acknowledged")
  private boolean acknowledged;

  @Field("acknowledged_at")
  private String acknowledgedAt;

}
