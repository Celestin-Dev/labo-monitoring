package com.labo.monitoring.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.labo.monitoring.enums.AlertType;
import com.labo.monitoring.enums.SeverityType;
import com.labo.monitoring.model.Alert;
import com.labo.monitoring.service.AlertService;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {

  @Autowired
  private AlertService alertService;

  /**
   * GET /api/alerts?type=TEMPERATURE&severity=CRITICAL&zoneId=xxx&acknowledged=false&resolved=false&from=...&to=...
   * Tous les paramètres sont optionnels et combinables (page Alertes du frontend).
   * from/to attendus au format ISO-8601 (ex: 2026-08-11T00:00:00Z).
   */
  @GetMapping
  public List<Alert> search(
      @RequestParam(required = false) AlertType type,
      @RequestParam(required = false) SeverityType severity,
      @RequestParam(required = false) String zoneId,
      @RequestParam(required = false) Boolean acknowledged,
      @RequestParam(required = false) Boolean resolved,
      @RequestParam(required = false) String from,
      @RequestParam(required = false) String to) {
    return alertService.search(type, severity, zoneId, acknowledged, resolved, from, to);
  }

  @GetMapping("/{id}")
  public Alert getById(@PathVariable String id) {
    return alertService.findById(id);
  }

  @GetMapping("/recent")
  public List<Alert> recent(@RequestParam(defaultValue = "10") int limit) {
    return alertService.recent(limit);
  }

  @GetMapping("/unresolved")
  public List<Alert> unresolved() {
    return alertService.unresolved();
  }

  @PatchMapping("/{id}/acknowledge")
  public Alert acknowledge(@PathVariable String id) {
    return alertService.acknowledge(id);
  }

  @PatchMapping("/{id}/resolve")
  public Alert resolve(@PathVariable String id) {
    return alertService.resolve(id);
  }
}
