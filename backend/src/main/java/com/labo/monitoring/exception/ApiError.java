package com.labo.monitoring.exception;

import java.time.Instant;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ApiError {
  private Instant timestamp;
  private int status;
  private String error;
  private String message;
  private Map<String, String> fieldErrors;
}
