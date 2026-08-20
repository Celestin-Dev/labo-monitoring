package com.labo.monitoring.dto.response;

import java.util.List;

import com.labo.monitoring.model.Alert;
import com.labo.monitoring.model.Zone;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardOverviewResponse {

  private GlobalStats globalStats;
  private List<Zone> zones;
  private List<Alert> recentAlerts;
  private String systemStatus; // ONLINE / DEGRADED / OFFLINE

  @Data
  @AllArgsConstructor
  @NoArgsConstructor
  public static class GlobalStats {
    private Double avgTemperature;
    private Double avgHumidity;
    private Double avgCo;
    private Double avgLuminosity;
  }
}
