package com.labo.monitoring.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.labo.monitoring.dto.response.DashboardOverviewResponse;
import com.labo.monitoring.service.DashboardService;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

  @Autowired
  private DashboardService dashboardService;

  @GetMapping("/overview")
  public DashboardOverviewResponse getOverview() {
    return dashboardService.getOverview();
  }
}
