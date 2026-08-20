package com.labo.monitoring.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.labo.monitoring.model.Alert;

public interface AlertRepository extends MongoRepository<Alert, String>, AlertRepositoryCustom {

  List<Alert> findByZoneIdOrderByTimestampDesc(String zoneId, Pageable pageable);

  List<Alert> findByAcknowledgedFalseOrderByTimestampDesc();

  @Query(value = "{ 'resolved': false }", sort = "{ 'timestamp': -1 }")
  List<Alert> findAllUnresolvedOrderByTimestampDesc();

  List<Alert> findTop10ByOrderByTimestampDesc();
}
