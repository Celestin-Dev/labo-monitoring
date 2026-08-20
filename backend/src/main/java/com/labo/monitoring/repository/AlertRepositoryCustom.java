package com.labo.monitoring.repository;

import java.util.List;

import com.labo.monitoring.enums.AlertType;
import com.labo.monitoring.enums.SeverityType;
import com.labo.monitoring.model.Alert;

public interface AlertRepositoryCustom {

  /**
   * Recherche d'alertes avec filtres combinables (tous optionnels/nullable),
   * utilisée par la page "Alertes" du frontend (Type / Severity / Zone / Date).
   */
  List<Alert> search(
      AlertType type,
      SeverityType severity,
      String zoneId,
      Boolean acknowledged,
      Boolean resolved,
      String fromIso,
      String toIso);
}
