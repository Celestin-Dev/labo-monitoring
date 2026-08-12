package com.labo.monitoring.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import com.labo.monitoring.enums.DeviceStatus;

import lombok.Data;

@Data
@Document(collection = "devices")
public class Device {

  @Id
  private String id;

  @Field("zone_id")
  private String zoneId;

  @Field("name")
  private String name;

  @Field("ip_address")
  private String ipAddress;

  @Field("status")
  private DeviceStatus status;

  @Field("last_heartbeat")
  private Long lastHeartbeat;

}
