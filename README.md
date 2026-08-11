# Laboratory Environmental Monitoring System

## Description

**Laboratory Environmental Monitoring System** est un système IoT destiné à la **surveillance de l'environnement et de la sécurité d'un laboratoire chimique**.

Il collecte les données des capteurs via des **ESP32**, les analyse et les stocke dans **MongoDB**. Une interface **ReactJS** permet de visualiser les données en temps réel et de recevoir des alertes en cas de situation critique.

## Objectifs

* Surveiller la **température** et l'**humidité**.
* Surveiller le **CO** et la **luminosité**.
* Détecter les **mouvements pendant la nuit**.
* Détecter les **incendies**.
* Générer des **alertes** en cas de dépassement de seuil.
* Consulter l'historique et l'état des différentes zones du laboratoire.

## Architecture

```text
Capteurs
   ↓
ESP32
   ↓ Wi-Fi / HTTP
Spring Boot
   ↓
MongoDB
   ↓
ReactJS
```

## Technologies

* **ESP32 / C++** — Acquisition des données
* **Spring Boot / Java** — Backend et API REST
* **MongoDB** — Base de données
* **ReactJS** — Interface de supervision
* **WebSocket** — Données et alertes en temps réel

## Fonctionnement

```text
Capteurs → ESP32 → Spring Boot → MongoDB
                         ↓
                    Rule Engine
                         ↓
                      Alertes
                         ↓
                      ReactJS
```

## Principales fonctionnalités

* Dashboard de supervision
* Surveillance par zone
* Visualisation en temps réel
* Gestion des seuils
* Gestion des alertes
* Historique des mesures
* Surveillance de l'état des ESP32
* Gestion des produits et conditions de stockage

> **Note :** les seuils de sécurité doivent être définis à partir des fiches de données de sécurité (FDS/SDS) des produits et des exigences applicables au laboratoire. Le système est une solution de supervision et ne remplace pas les dispositifs de sécurité réglementaires.

## Collaborateurs

* **IAVOTRINIRAINY Nomenjanahary Célestin**
* **RABEARIMANANAHARIMINO Fenonirina**
* **RANDRIATAHINA Jean Luca** 


