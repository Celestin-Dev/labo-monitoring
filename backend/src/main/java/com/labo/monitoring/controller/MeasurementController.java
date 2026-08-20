package com.labo.monitoring.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.labo.monitoring.model.Measurment;
import com.labo.monitoring.service.MeasurementService;

@RestController
@RequestMapping("/api/measurements")
public class MeasurementController {

  @Autowired
  private MeasurementService measurementService;

  @GetMapping
  public List<Measurment> getRecent(
      @RequestParam(required = false) String zoneId,
      @RequestParam(required = false) String deviceId,
      @RequestParam(defaultValue = "100") int limit) {
    if (deviceId != null) {
      return measurementService.findByDevice(deviceId, limit);
    }
    if (zoneId != null) {
      return measurementService.findByZone(zoneId, limit);
    }
    throw new IllegalArgumentException("Le paramètre zoneId ou deviceId est requis");
  }

  @GetMapping("/latest")
  public ResponseEntity<Measurment> getLatest(
      @RequestParam(required = false) String zoneId,
      @RequestParam(required = false) String deviceId) {
    Measurment latest = deviceId != null
        ? measurementService.latestByDevice(deviceId)
        : measurementService.latestByZone(zoneId);
    return latest != null ? ResponseEntity.ok(latest) : ResponseEntity.noContent().build();
  }

  /**
   * Série temporelle pour les graphiques Monitoring / Historique.
   * period accepte : 1h, 24h, 7d, 30d (défaut 24h). zoneId optionnel
   * (absent = toutes zones confondues).
   */
  @GetMapping("/series")
  public List<Measurment> getSeries(
      @RequestParam(required = false) String zoneId,
      @RequestParam(defaultValue = "24h") String period) {
    long now = System.currentTimeMillis();
    long from = now - periodToMillis(period);
    return measurementService.series(zoneId, from, now);
  }

  private long periodToMillis(String period) {
    return switch (period) {
      case "1h" -> 60L * 60 * 1000;
      case "7d" -> 7L * 24 * 60 * 60 * 1000;
      case "30d" -> 30L * 24 * 60 * 60 * 1000;
      default -> 24L * 60 * 60 * 1000; // "24h"
    };
  }
}
