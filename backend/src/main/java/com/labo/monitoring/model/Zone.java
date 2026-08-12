package com.labo.monitoring.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import com.labo.monitoring.enums.ZoneStatus;

import lombok.Data;

@Data
@Document(collection = "zones")
public class Zone {

  @Id
  private String id;

  @Field("name")
  private String name;

  @Field("description")
  private String description;

  @Field("status")
  private ZoneStatus status;
}
