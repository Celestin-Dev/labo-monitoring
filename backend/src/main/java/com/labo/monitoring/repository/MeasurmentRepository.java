package com.labo.monitoring.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.labo.monitoring.model.Measurment;

public interface MeasurmentRepository extends MongoRepository<Measurment, String> {

  List<Measurment> findByZoneIdOrderByTimestampDesc(String zoneId, Pageable pageable);

  List<Measurment> findByDeviceIdOrderByTimestampDesc(String deviceId, Pageable pageable);

  Measurment findFirstByZoneIdOrderByTimestampDesc(String zoneId);

  Measurment findFirstByDeviceIdOrderByTimestampDesc(String deviceId);

  List<Measurment> findByZoneIdAndTimestampBetweenOrderByTimestampAsc(
      String zoneId, long from, long to);

  List<Measurment> findByTimestampBetweenOrderByTimestampAsc(long from, long to);
}
