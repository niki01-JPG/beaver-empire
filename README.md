# Beaver Empire

Ein browser-basiertes Idle-Strategie-Spiel im Stil von Kittens Game, aber mit Bibern, Dämmen, Ressourcenmanagement und Tech-Tree.

## Spielidee

Du startest mit einer kleinen Biberkolonie am Fluss. Deine Aufgabe ist es, Ressourcen zu sammeln, Häuser und Infrastruktur zu bauen, die Bevölkerung zu fördern und technologische Fortschritte zu erkunden. Das Ziel ist nicht nur Mehrproduktion, sondern auch nachhaltige Entwicklung einer ganzen Biberzivilisation.

## Features

- Ressourcenmanagement: Nahrung, Holz, Stein, Wasser, Wissen, Ruhm
- Baustoffe und Gebäude: Dämme, Hütten, Sägewerke, Steinbrüche, Werkstätten
- Population & Jobs: Sammler, Holzfäller, Bauleiter, Forscher
- Tech-Tree: Holzverarbeitung, Mauerwerk, Flusskontrolle, Ökologie, Industrie
- Wetterwechsel über die Tages- und Jahreszeit
- Offline-Progress über den letzten Tick (mit LocalStorage)
- Prestige/Reset mit Ruhm
- Browser-Playability per HTML, CSS und JavaScript

## Starten

Option 1: einfach `index.html` im Browser öffnen.

Option 2: lokal mit einem kleinen Server:

```bash
cd beaver-empire
python -m http.server 8000
```

Danach im Browser: http://localhost:8000

## Struktur

- `index.html` – Spieloberfläche
- `styles.css` – Styling
- `game.js` – Spiel-Logik, Ressourcen, Jobs, Tech-Tree, Save/Load

## Geplante Erweiterungen

- Mehrzeilige Kampagnen / Ereignisse
- Biber-„Zivilisation“-Missionssystem
- Erdbeben, Dürre, Jahreszeiten mit echter Ökosystem-Mechanik
- Autosave- und Export/Import-Funktion
- More advanced prestige and branching tech choices

## Hinweis

Das Spiel ist bewusst leichtgewicht und sofort spielbar, damit es schnell erweiterbar bleibt.
