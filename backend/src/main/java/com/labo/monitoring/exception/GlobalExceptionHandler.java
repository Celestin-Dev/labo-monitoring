package com.labo.monitoring.exception;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<ApiError> handleNotFound(ResourceNotFoundException ex) {
    ApiError body = new ApiError(
        Instant.now(), HttpStatus.NOT_FOUND.value(), "Not Found", ex.getMessage(), null);
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex) {
    Map<String, String> fieldErrors = new HashMap<>();
    ex.getBindingResult().getFieldErrors()
        .forEach(err -> fieldErrors.put(err.getField(), err.getDefaultMessage()));
    ApiError body = new ApiError(
        Instant.now(), HttpStatus.BAD_REQUEST.value(), "Bad Request",
        "Données invalides", fieldErrors);
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ApiError> handleIllegalArgument(IllegalArgumentException ex) {
    ApiError body = new ApiError(
        Instant.now(), HttpStatus.BAD_REQUEST.value(), "Bad Request", ex.getMessage(), null);
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ApiError> handleGeneric(Exception ex) {
    ApiError body = new ApiError(
        Instant.now(), HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal Server Error",
        ex.getMessage(), null);
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
  }
}
