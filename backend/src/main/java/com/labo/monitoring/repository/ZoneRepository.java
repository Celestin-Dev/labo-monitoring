package com.labo.monitoring.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.labo.monitoring.model.Zone;

public interface ZoneRepository extends MongoRepository<Zone, String> {

  Optional<Zone> findByNameIgnoreCase(String name);
}
