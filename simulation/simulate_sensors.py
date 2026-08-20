#!/usr/bin/env python3
"""
Simulateur de capteurs ESP32 pour Lab Monitoring.

Publie périodiquement des mesures aléatoires (température, humidité, CO,
luminosité, mouvement, feu) sur le broker MQTT, exactement au format
attendu par le backend Spring Boot (topics lab/{zoneId}/{deviceId}/...).

Usage :
    pip install paho-mqtt
    python simulate_sensors.py
    python simulate_sensors.py --host localhost --port 1883 --interval 5
    python simulate_sensors.py --chaos   # augmente la fréquence des valeurs
                                          # extrêmes pour déclencher des
                                          # alertes WARNING/CRITICAL

Arrêt : Ctrl+C
"""

import argparse
import json
import random
import time
from datetime import datetime, timezone

import paho.mqtt.client as mqtt

# Zones et appareils simulés — alignés sur les zones de démo du frontend React
ZONES = [
    {"zoneId": "zoneA", "deviceId": "esp32-a1", "baseTemp": 21, "baseHum": 54, "baseCo": 5, "baseLux": 110},
    {"zoneId": "zoneB", "deviceId": "esp32-b1", "baseTemp": 27, "baseHum": 60, "baseCo": 10, "baseLux": 95},
    {"zoneId": "zoneC", "deviceId": "esp32-c1", "baseTemp": 24, "baseHum": 58, "baseCo": 8, "baseLux": 140},
    {"zoneId": "zoneD", "deviceId": "esp32-d1", "baseTemp": 4, "baseHum": 38, "baseCo": 2, "baseLux": 60},
]


def build_payload(zone: dict, chaos: bool) -> dict:
    """Génère une mesure aléatoire autour des valeurs de base de la zone.
    En mode --chaos, une mesure sur ~6 sort largement de la plage normale
    pour déclencher une alerte WARNING ou CRITICAL côté backend."""

    spike = chaos and random.random() < 0.15

    temp = zone["baseTemp"] + random.uniform(-1.5, 1.5)
    hum = zone["baseHum"] + random.uniform(-4, 4)
    co = zone["baseCo"] + random.uniform(-2, 2)
    lux = zone["baseLux"] + random.uniform(-15, 15)
    motion = random.random() < 0.05
    fire = False

    if spike:
        kind = random.choice(["temp_high", "temp_low", "co_high", "fire"])
        if kind == "temp_high":
            temp += random.uniform(8, 14)
        elif kind == "temp_low":
            temp -= random.uniform(8, 14)
        elif kind == "co_high":
            co += random.uniform(15, 30)
        elif kind == "fire":
            fire = True
            temp += random.uniform(15, 25)

    return {
        "temperature": round(temp),
        "humidity": round(max(0, min(100, hum))),
        "coRaw": round(max(0, co)),
        "luminosity": round(max(0, lux)),
        "motionDetected": motion,
        "fireDetected": fire,
        "timestamp": int(datetime.now(timezone.utc).timestamp() * 1000),
    }


def main():
    parser = argparse.ArgumentParser(description="Simulateur de capteurs ESP32 (démo Lab Monitoring)")
    parser.add_argument("--host", default="localhost", help="Adresse du broker MQTT")
    parser.add_argument("--port", type=int, default=1883, help="Port du broker MQTT")
    parser.add_argument("--interval", type=float, default=5.0, help="Secondes entre deux salves de mesures")
    parser.add_argument("--heartbeat-every", type=int, default=3,
                         help="Envoyer un heartbeat toutes les N salves de mesures")
    parser.add_argument("--chaos", action="store_true",
                         help="Génère occasionnellement des valeurs extrêmes pour déclencher des alertes")
    parser.add_argument("--username", default=None)
    parser.add_argument("--password", default=None)
    args = parser.parse_args()

    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, client_id="lab-sensor-simulator")
    if args.username:
        client.username_pw_set(args.username, args.password or "")

    client.connect(args.host, args.port, keepalive=30)
    client.loop_start()

    print(f"Simulateur démarré -> {args.host}:{args.port} "
          f"(intervalle={args.interval}s, chaos={'ON' if args.chaos else 'off'})")
    print("Zones simulées :", ", ".join(f'{z["zoneId"]}/{z["deviceId"]}' for z in ZONES))
    print("Ctrl+C pour arrêter.\n")

    tick = 0
    try:
        while True:
            tick += 1
            for zone in ZONES:
                topic = f"lab/{zone['zoneId']}/{zone['deviceId']}/measurements"
                payload = build_payload(zone, args.chaos)
                client.publish(topic, json.dumps(payload), qos=1)
                flag = " 🔥" if payload["fireDetected"] else (" ⚠️" if payload["temperature"] > zone["baseTemp"] + 6 or payload["temperature"] < zone["baseTemp"] - 6 else "")
                print(f"[{datetime.now().strftime('%H:%M:%S')}] {topic} -> {payload}{flag}")

                if tick % args.heartbeat_every == 0:
                    hb_topic = f"lab/{zone['zoneId']}/{zone['deviceId']}/heartbeat"
                    client.publish(hb_topic, "ping", qos=1)

            time.sleep(args.interval)
    except KeyboardInterrupt:
        print("\nArrêt du simulateur.")
    finally:
        client.loop_stop()
        client.disconnect()


if __name__ == "__main__":
    main()