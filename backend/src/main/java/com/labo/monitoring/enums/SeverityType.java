package com.labo.monitoring.enums;

/**
 * Niveau de sévérité utilisé pour les zones, alertes et appareils.
 * Correspond aux statuts affichés côté frontend (vert/orange/rouge/gris).
 */
public enum SeverityType {
  NORMAL,
  WARNING,
  CRITICAL,
  OFFLINE
}
