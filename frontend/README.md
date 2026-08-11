# Lab Monitor

Application web de supervision des événements et paramètres environnementaux d'un laboratoire, construite avec **React**, **React Router**, **Tailwind CSS** et **Recharts**.

## Stack

- React 18 + Vite
- React Router (navigation multi-pages)
- Tailwind CSS (design system personnalisé)
- Recharts (graphiques capteurs)
- lucide-react (icônes)

## Démarrer le projet

```bash
npm install
npm run dev
```

L'application est disponible sur `http://localhost:5173`.

Pour construire la version de production :

```bash
npm run build
npm run preview
```

## Structure

```
src/
  components/     # Sidebar, Topbar, Layout, cartes, badges, graphiques
  data/           # Données simulées (à remplacer par vos appels API/WebSocket)
  pages/          # Dashboard, Monitoring, Zones, Produits, Alertes,
                  # Événements, Historique, Appareils, Configuration
```

## Pages incluses

- **Dashboard** — vue globale (indicateurs, graphique température/humidité, état des zones, alertes récentes)
- **Monitoring** — graphiques détaillés (température, humidité, CO, luminosité) filtrables par zone/période
- **Zones** — cartes d'état par zone
- **Produits** — fiches de conservation des produits chimiques
- **Alertes** — liste filtrable avec actions Acquitter / Résoudre
- **Événements** — journal chronologique
- **Historique** — export et consultation des mesures passées
- **Appareils** — inventaire des capteurs/passerelles
- **Configuration** — Règles de seuils, Zones, Utilisateurs

## Palette

| Rôle | Couleur |
|---|---|
| Primaire | `#1565C0` |
| Secondaire | `#00897B` |
| Fond | `#F5F7FA` |
| Normal | `#2E7D32` |
| Warning | `#F57C00` |
| Critical | `#D32F2F` |
| Offline | `#616161` |

## Prochaines étapes suggérées

- Connecter les données réelles via une API REST ou WebSocket (remplacer `src/data/mockData.js`)
- Authentification réelle (le bouton "Admin" est un placeholder)
- Notifications temps réel (websocket / SSE) pour les alertes critiques
- Pagination et export CSV/PDF réels pour Historique et Événements
