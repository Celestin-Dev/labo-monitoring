package com.labo.monitoring.repository;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import com.labo.monitoring.enums.AlertType;
import com.labo.monitoring.enums.SeverityType;
import com.labo.monitoring.model.Alert;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class AlertRepositoryImpl implements AlertRepositoryCustom {

  private final MongoTemplate mongoTemplate;

  @Override
  public List<Alert> search(
      AlertType type,
      SeverityType severity,
      String zoneId,
      Boolean acknowledged,
      Boolean resolved,
      String fromIso,
      String toIso) {

    Criteria criteria = new Criteria();
    List<Criteria> filters = new java.util.ArrayList<>();

    if (type != null) {
      filters.add(Criteria.where("type").is(type));
    }
    if (severity != null) {
      filters.add(Criteria.where("severity").is(severity));
    }
    if (zoneId != null && !zoneId.isBlank()) {
      filters.add(Criteria.where("zoneId").is(zoneId));
    }
    if (acknowledged != null) {
      filters.add(Criteria.where("acknowledged").is(acknowledged));
    }
    if (resolved != null) {
      filters.add(Criteria.where("resolved").is(resolved));
    }
    if (fromIso != null && !fromIso.isBlank()) {
      filters.add(Criteria.where("timestamp").gte(fromIso));
    }
    if (toIso != null && !toIso.isBlank()) {
      filters.add(Criteria.where("timestamp").lte(toIso));
    }

    if (!filters.isEmpty()) {
      criteria.andOperator(filters.toArray(new Criteria[0]));
    }

    Query query = new Query(criteria).with(Sort.by(Sort.Direction.DESC, "timestamp"));
    return mongoTemplate.find(query, Alert.class);
  }
}
