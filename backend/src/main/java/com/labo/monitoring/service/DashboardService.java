package com.labo.monitoring.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.labo.monitoring.dto.response.DashboardOverviewResponse;
import com.labo.monitoring.enums.ZoneStatus;
import com.labo.monitoring.model.Measurment;
import com.labo.monitoring.model.Zone;
import com.labo.monitoring.repository.MeasurmentRepository;
import com.labo.monitoring.repository.ZoneRepository;

@Service
public class DashboardService {

  @Autowired
  private ZoneRepository zoneRepository;

  @Autowired
  private MeasurmentRepository measurmentRepository;

  @Autowired
  private AlertService alertService;

  public DashboardOverviewResponse getOverview() {
    List<Zone> zones = zoneRepository.findAll();

    List<Measurment> latestPerZone = zones.stream()
        .map(z -> measurmentRepository.findFirstByZoneIdOrderByTimestampDesc(z.getId()))
        .filter(java.util.Objects::nonNull)
        .toList();

    Double avgTemp = average(latestPerZone.stream().mapToDouble(Measurment::getTemperature));
    Double avgHum = average(latestPerZone.stream().mapToDouble(Measurment::getHumidity));
    Double avgCo = average(latestPerZone.stream().mapToDouble(Measurment::getCoRaw));
    Double avgLux = average(latestPerZone.stream().mapToDouble(Measurment::getLuminosity));

    var globalStats = new DashboardOverviewResponse.GlobalStats(avgTemp, avgHum, avgCo, avgLux);

    boolean anyCritical = zones.stream().anyMatch(z -> z.getStatus() == ZoneStatus.CRITICAL);
    boolean anyOffline = zones.stream().anyMatch(z -> z.getStatus() == ZoneStatus.OFFLINE);
    String systemStatus = anyCritical ? "DEGRADED" : (anyOffline ? "PARTIAL" : "ONLINE");

    return new DashboardOverviewResponse(
        globalStats,
        zones,
        alertService.recent(4),
        systemStatus
    );
  }

  private Double average(java.util.stream.DoubleStream stream) {
    var stats = stream.summaryStatistics();
    return stats.getCount() == 0 ? null : Math.round(stats.getAverage() * 10.0) / 10.0;
  }
}
