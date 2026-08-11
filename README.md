# Lab Monitor — Installation Frontend

Application de supervision de laboratoire (React + Tailwind CSS).

## Prérequis

- [Node.js](https://nodejs.org/) v18 ou supérieur
- npm (inclus avec Node.js)

## Installation

```bash
# 1. Se placer dans le dossier du projet
cd lab-monitor

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npm run dev
```

L'application est ensuite accessible sur :

```
http://localhost:5173
```

## Build de production

```bash
npm run build      # génère le dossier dist/
npm run preview    # prévisualise le build de production
```

## Structure rapide

```
src/
  components/   # Sidebar, Topbar, cartes, graphiques...
  data/         # Données simulées (à connecter à une vraie API)
  pages/        # Dashboard, Monitoring, Zones, Alertes, Configuration...
```

## Dépannage

- **Le port 5173 est déjà utilisé** → Vite en propose un autre automatiquement, ou lancez `npm run dev -- --port 3000`
- **Erreurs "vulnerabilities" après `npm install`** → sans danger pour le développement local, voir `npm audit` pour le détail
