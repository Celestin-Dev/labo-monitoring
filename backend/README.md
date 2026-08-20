# Lab Monitoring — Backend

API REST + ingestion MQTT pour la supervision de laboratoire.
**Stack** : Spring Boot 3.3, MongoDB, HiveMQ MQTT Client, WebSocket (STOMP).

> ⚠️ Ce code a été rédigé hors environnement Maven/réseau restreint — il n'a pas pu être compilé ici (pas d'accès à Maven Central dans ce sandbox). Relisez-le et lancez `mvn compile` en premier avant toute autre chose ; corrigez les éventuelles erreurs de signature d'API du client HiveMQ (`hivemq-mqtt-client`) si la version installée diffère légèrement.

## Prérequis

- Java 17+
- Maven 3.9+
- MongoDB (local ou distant) — `mongodb://localhost:27017` par défaut
- Un broker MQTT compatible HiveMQ (HiveMQ Community Edition, HiveMQ Cloud, ou Mosquitto en dépannage)

## Installation

```bash
cd lab-monitoring-backend

# Configurer les variables d'environnement du broker MQTT si besoin
export MQTT_HOST=localhost
export MQTT_PORT=1883
export MQTT_USERNAME=
export MQTT_PASSWORD=

mvn clean install
mvn spring-boot:run
```

L'API démarre sur `http://localhost:8080`.

## Configuration (`application.yml`)

| Clé | Rôle | Défaut |
|---|---|---|
| `spring.data.mongodb.uri` | Connexion MongoDB | `mongodb://localhost:27017/lab_monitoring` |
| `mqtt.host` / `mqtt.port` | Broker HiveMQ | `localhost:1883` |
| `mqtt.topics.measurements` | Topic écouté pour les mesures | `lab/+/+/measurements` |
| `mqtt.topics.heartbeat` | Topic écouté pour les heartbeats | `lab/+/+/heartbeat` |
| `mqtt.topics.commands` | Topic de publication vers l'ESP32 | `lab/%s/%s/commands` |
| `device.heartbeat-timeout-seconds` | Délai avant de marquer un appareil hors ligne | `120` |
| `app.cors.allowed-origins` | Origines autorisées (frontend React) | `http://localhost:5173` |

## Format des messages MQTT attendus de l'ESP32

**Mesure** — topic `lab/{zoneId}/{deviceId}/measurements` :
```json
{
  "temperature": 24,
  "humidity": 54,
  "coRaw": 7,
  "luminosity": 120,
  "motionDetected": false,
  "fireDetected": false,
  "timestamp": 1755680000000
}
```
`timestamp` est optionnel (l'heure de réception est utilisée si absente).

**Heartbeat** — topic `lab/{zoneId}/{deviceId}/heartbeat` : n'importe quel payload (ex: `"ping"`), sert uniquement à signaler que l'appareil est vivant.

À réception d'un message sur l'un de ces deux topics, le backend :
1. crée l'appareil automatiquement s'il n'existe pas encore (auto-enregistrement),
2. le passe/maintient à `ONLINE`,
3. pour les mesures : les persiste, les diffuse en temps réel via WebSocket, puis évalue les seuils et génère des alertes si besoin.

Un scheduler interne repasse les appareils à `OFFLINE` (et lève une alerte) s'ils n'ont plus émis depuis `device.heartbeat-timeout-seconds`.

## API REST

Toutes les routes sont préfixées par `/api`.

| Ressource | Endpoints |
|---|---|
| **Zones** | `GET /zones`, `GET /zones/{id}`, `GET /zones/{id}/latest-measurement`, `POST /zones`, `PUT /zones/{id}`, `DELETE /zones/{id}` |
| **Appareils** | `GET /devices[?zoneId=]`, `GET /devices/{id}`, `POST /devices`, `PUT /devices/{id}`, `DELETE /devices/{id}` |
| **Mesures** | `GET /measurements?zoneId=\|deviceId=&limit=`, `GET /measurements/latest?zoneId=\|deviceId=`, `GET /measurements/series?zoneId=&period=1h\|24h\|7d\|30d` |
| **Produits** | `GET /products[?zoneId=]`, `GET /products/{id}`, `POST /products`, `PUT /products/{id}`, `DELETE /products/{id}` |
| **Règles de seuils** | `GET /thresholds`, `GET /thresholds/{id}`, `GET /thresholds/zone/{zoneId}`, `POST /thresholds`, `PUT /thresholds/{id}`, `DELETE /thresholds/{id}` |
| **Alertes** | `GET /alerts?type=&severity=&zoneId=&acknowledged=&resolved=&from=&to=`, `GET /alerts/{id}`, `GET /alerts/recent?limit=`, `GET /alerts/unresolved`, `PATCH /alerts/{id}/acknowledge`, `PATCH /alerts/{id}/resolve` |
| **Dashboard** | `GET /dashboard/overview` (stats globales, zones, alertes récentes) |

## Temps réel (WebSocket / STOMP)

Endpoint : `ws://localhost:8080/ws` (SockJS + STOMP)

Topics diffusés :
- `/topic/measurements` — nouvelle mesure reçue
- `/topic/alerts` — nouvelle alerte / acquittement / résolution
- `/topic/zones` — changement de statut d'une zone
- `/topic/devices` — changement de statut d'un appareil

Côté frontend React, s'abonner avec `@stomp/stompjs` + `sockjs-client` pour remplacer le polling par du push temps réel sur le Dashboard et la page Alertes.

## Le moteur d'alertes (`AlertEvaluationService`)

À chaque mesure reçue :
1. Récupère la règle de seuil (`Threshold`) de la zone concernée (si activée).
2. Compare température / humidité (min & max) et CO / luminosité (max) à ces seuils.
   - Dépassement ≤ 20% → **WARNING**
   - Dépassement > 20% → **CRITICAL**
3. Vérifie aussi `fireDetected` (→ CRITICAL) et `motionDetected` (→ WARNING).
4. Compare la mesure aux plages de conservation de chaque `Product` stocké dans la zone.
5. Crée une `Alert` pour chaque dépassement détecté et met à jour le statut global de la `Zone` (le pire niveau observé l'emporte).

## Prochaines étapes suggérées

- Authentification (Spring Security + JWT) pour protéger l'API et gérer les rôles (Admin/Technicien/Observateur de la page Utilisateurs)
- Pagination réelle sur `/measurements` et `/alerts` pour les gros volumes
- Export CSV/PDF pour la page Historique
- Tests unitaires sur `AlertEvaluationService` (la logique la plus critique)
