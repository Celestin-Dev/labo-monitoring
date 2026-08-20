package com.labo.monitoring.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.labo.monitoring.dto.request.ProductRequest;
import com.labo.monitoring.exception.ResourceNotFoundException;
import com.labo.monitoring.model.Product;
import com.labo.monitoring.repository.ProductRepository;

@Service
public class ProductService {

  @Autowired
  private ProductRepository productRepository;

  public List<Product> findAll() {
    return productRepository.findAll();
  }

  public List<Product> findByZone(String zoneId) {
    return productRepository.findByZoneId(zoneId);
  }

  public Product findById(String id) {
    return productRepository.findById(id)
        .orElseThrow(() -> ResourceNotFoundException.of("Produit", id));
  }

  public Product create(ProductRequest request) {
    Product product = mapToEntity(new Product(), request);
    return productRepository.save(product);
  }

  public Product update(String id, ProductRequest request) {
    Product product = findById(id);
    return productRepository.save(mapToEntity(product, request));
  }

  public void delete(String id) {
    if (!productRepository.existsById(id)) {
      throw ResourceNotFoundException.of("Produit", id);
    }
    productRepository.deleteById(id);
  }

  private Product mapToEntity(Product product, ProductRequest request) {
    product.setName(request.getName());
    product.setReference(request.getReference());
    product.setZoneId(request.getZoneId());
    product.setMinTemperature(request.getMinTemperature());
    product.setMaxTemperature(request.getMaxTemperature());
    product.setMinHumidity(request.getMinHumidity());
    product.setMaxHumidity(request.getMaxHumidity());
    product.setDangerLevel(request.getDangerLevel());
    return product;
  }
}
