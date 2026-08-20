package com.labo.monitoring.exception;

public class ResourceNotFoundException extends RuntimeException {

  public ResourceNotFoundException(String message) {
    super(message);
  }

  public static ResourceNotFoundException of(String resource, String id) {
    return new ResourceNotFoundException(resource + " introuvable avec l'id : " + id);
  }
}
