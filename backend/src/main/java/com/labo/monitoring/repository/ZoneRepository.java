package com.labo.monitoring.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.labo.monitoring.model.Zone;

public interface ZoneRepository extends MongoRepository<Zone, String> {

}
