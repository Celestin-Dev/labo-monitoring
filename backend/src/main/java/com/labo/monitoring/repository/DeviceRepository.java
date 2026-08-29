package com.labo.monitoring.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.labo.monitoring.enums.DeviceStatus;
import com.labo.monitoring.model.Device;

public interface DeviceRepository extends MongoRepository<Device, String> {

  List<Device> findByZoneId(String zoneId);

  Optional<Device> findByNameAndZoneId(String name, String zoneId);

  Optional<Device> findByNameIgnoreCaseAndZoneId(String name, String zoneId);

  List<Device> findByStatusNot(DeviceStatus status);

  List<Device> findByLastHeartbeatLessThan(long thresholdEpochMillis);
}
