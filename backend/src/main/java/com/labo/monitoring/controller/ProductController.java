package com.labo.monitoring.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.labo.monitoring.dto.request.ProductRequest;
import com.labo.monitoring.model.Product;
import com.labo.monitoring.service.ProductService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/products")
public class ProductController {

  @Autowired
  private ProductService productService;

  @GetMapping
  public List<Product> getAll(@RequestParam(required = false) String zoneId) {
    return zoneId != null ? productService.findByZone(zoneId) : productService.findAll();
  }

  @GetMapping("/{id}")
  public Product getById(@PathVariable String id) {
    return productService.findById(id);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Product create(@Valid @RequestBody ProductRequest request) {
    return productService.create(request);
  }

  @PutMapping("/{id}")
  public Product update(@PathVariable String id, @Valid @RequestBody ProductRequest request) {
    return productService.update(id, request);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable String id) {
    productService.delete(id);
  }
}
