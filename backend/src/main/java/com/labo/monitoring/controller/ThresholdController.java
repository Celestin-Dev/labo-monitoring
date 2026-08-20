package com.labo.monitoring.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.labo.monitoring.dto.request.ThresholdRequest;
import com.labo.monitoring.model.Threshold;
import com.labo.monitoring.service.ThresholdService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/thresholds")
public class ThresholdController {

  @Autowired
  private ThresholdService thresholdService;

  @GetMapping
  public List<Threshold> getAll() {
    return thresholdService.findAll();
  }

  @GetMapping("/{id}")
  public Threshold getById(@PathVariable String id) {
    return thresholdService.findById(id);
  }

  @GetMapping("/zone/{zoneId}")
  public ResponseEntity<Threshold> getByZone(@PathVariable String zoneId) {
    return thresholdService.findByZone(zoneId)
        .map(ResponseEntity::ok)
        .orElseGet(() -> ResponseEntity.noContent().build());
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Threshold create(@Valid @RequestBody ThresholdRequest request) {
    return thresholdService.create(request);
  }

  @PutMapping("/{id}")
  public Threshold update(@PathVariable String id, @Valid @RequestBody ThresholdRequest request) {
    return thresholdService.update(id, request);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable String id) {
    thresholdService.delete(id);
  }
}
