package com.labo.monitoring.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.labo.monitoring.model.Threshold;

public interface ThresholdRepository extends MongoRepository<Threshold, String> {

  Optional<Threshold> findByZoneId(String zoneId);
}
