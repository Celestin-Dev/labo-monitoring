package com.labo.monitoring.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.labo.monitoring.model.Threshold;

public interface ThresholdRepository extends MongoRepository<Threshold, String> {
  List<Threshold> findByZoneId(String zoneId);
}
