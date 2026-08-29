package com.labo.monitoring.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import com.labo.monitoring.enums.DeviceStatus;

import lombok.Data;

@Data
@Document(collection = "devices")
@CompoundIndex(name = "zone_name_unique_idx", def = "{'zoneId': 1, 'name': 1}", unique = true)
public class Device {

  @Id
  private String id;

  @Field("zone_id")
  private String zoneId;

  @Field("name")
  private String name;

  @Field("ip_address")
  private String ipAddress;

  @Field("type")
  private String type;

  @Field("status")
  private DeviceStatus status = DeviceStatus.OFFLINE;

  @Field("last_heartbeat")
  private Long lastHeartbeat;
}
