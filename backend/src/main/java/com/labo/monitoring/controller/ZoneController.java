package com.labo.monitoring.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.labo.monitoring.dto.request.ZoneRequest;
import com.labo.monitoring.model.Measurment;
import com.labo.monitoring.model.Zone;
import com.labo.monitoring.service.MeasurementService;
import com.labo.monitoring.service.ZoneService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/zones")
public class ZoneController {

  @Autowired
  private ZoneService zoneService;

  @Autowired
  private MeasurementService measurementService;

  @GetMapping
  public List<Zone> getAll() {
    return zoneService.findAll();
  }

  @GetMapping("/{id}")
  public Zone getById(@PathVariable String id) {
    return zoneService.findById(id);
  }

  @GetMapping("/{id}/latest-measurement")
  public ResponseEntity<Measurment> getLatestMeasurement(@PathVariable String id) {
    Measurment latest = measurementService.latestByZone(id);
    return latest != null ? ResponseEntity.ok(latest) : ResponseEntity.noContent().build();
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Zone create(@Valid @RequestBody ZoneRequest request) {
    return zoneService.create(request);
  }

  @PutMapping("/{id}")
  public Zone update(@PathVariable String id, @Valid @RequestBody ZoneRequest request) {
    return zoneService.update(id, request);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable String id) {
    zoneService.delete(id);
  }
}
