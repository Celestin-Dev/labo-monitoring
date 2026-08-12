package com.labo.monitoring.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.labo.monitoring.model.Alert;

public interface AlertRepository extends MongoRepository<Alert, String> {

}
