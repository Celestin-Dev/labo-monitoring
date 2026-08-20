package com.labo.monitoring.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.labo.monitoring.model.Product;

public interface ProductRepository extends MongoRepository<Product, String> {

  List<Product> findByZoneId(String zoneId);
}
