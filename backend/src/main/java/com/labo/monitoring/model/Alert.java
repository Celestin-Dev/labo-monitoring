package com.labo.monitoring.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import com.labo.monitoring.enums.AlertType;
import com.labo.monitoring.enums.SeverityType;

import lombok.Data;

@Data
@Document(collection = "alerts")
@CompoundIndexes({
    @CompoundIndex(name = "zone_timestamp_idx", def = "{'zoneId': 1, 'timestamp': -1}")
})
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

  // Ajoutés pour couvrir le workflow complet côté frontend (Acquitter / Résoudre)
  @Field("resolved")
  private boolean resolved;

  @Field("resolved_at")
  private String resolvedAt;
}
