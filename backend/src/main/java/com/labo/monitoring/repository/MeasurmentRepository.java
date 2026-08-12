package com.labo.monitoring.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.labo.monitoring.model.Measurment;

public interface MeasurmentRepository extends MongoRepository<Measurment, String> {
  List<Measurment> findByDeviceId(String deviceId);

  List<Measurment> findByZoneId(String zoneId);
}
