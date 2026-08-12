package com.labo.monitoring.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.labo.monitoring.model.Device;

public interface DeviceRepository extends MongoRepository<Device, String> {
  List<Device> findByZoneId(String zoneId);
}
