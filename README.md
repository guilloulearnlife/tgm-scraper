# TGM Scraper 🔍

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)
![Google Places](https://img.shields.io/badge/Google_Places_API-4285F4?style=flat&logo=googlemaps&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)

**B2B-Intelligence-Plattform zur automatisierten Analyse von Unternehmenswebsites.**

TGM Scraper erfasst Unternehmensdaten über die Google Places API, analysiert deren digitale Präsenz und berechnet einen Digital-Maturity-Score — um gezielt B2B-Prospects mit dem größten Automatisierungspotenzial zu identifizieren.

🔗 **Live Demo:** [tgm-scraper.vercel.app](https://tgm-scraper.vercel.app)

---

## Wie es funktioniert

```
Suchparameter (Branche + Region)
         │
         ▼ Google Places API
  Rohdaten: Name, Adresse,
  Website, Telefon, Bewertungen
         │
         ▼ Technologie-Erkennung
  Website analysieren:
  CMS, Analytics, Chat-Tools,
  Buchungssysteme erkannt?
         │
         ▼ Digital-Maturity-Scoring
  Score 0–100 basierend auf:
  - Online-Präsenz
  - Tool-Stack
  - Kundenbewertungen
  - Digitalisierungsgrad
         │
         ▼ Supabase (PostgreSQL)
  Strukturierte Speicherung
  aller Prospects + Scores
```

---

## Funktionen

- **Automatisierte Unternehmenssuche** via Google Places API — Branche + Region als Parameter
- **Technologie-Erkennung** — erkennt CMS, Analytics-Tools, Chat-Widgets, Buchungssysteme auf Unternehmenswebsites
- **Digital-Maturity-Score** — eigener Algorithmus bewertet den Digitalisierungsgrad jedes Prospects (0–100)
- **Supabase-Integration** — alle Daten strukturiert gespeichert, filterbar und exportierbar
- **150+ Zielmärkte** — konfiguriert für frankophone Märkte (Frankreich, Belgien, Kanada, Afrika)
- **API-gesichertes Backend** — geschützte Endpunkte via `API_SECRET`
- **Vercel-Deployment** — serverless, skalierbar

---

## Projektstruktur

```
tgm-scraper/
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── api/           # API-Endpunkte (scraping, scoring)
│   │   └── ...
│   ├── components/        # UI-Komponenten
│   └── lib/               # Hilfsfunktionen (Scoring-Algorithmus, API-Clients)
├── .env.example           # Benötigte Umgebungsvariablen
├── next.config.js
├── vercel.json            # Vercel-Konfiguration
└── package.json
```

---

## Setup

### Voraussetzungen

- Node.js 18+
- Google Places API Key
- Supabase-Projekt

### Installation

```bash
git clone https://github.com/guilloulearnlife/tgm-scraper.git
cd tgm-scraper
npm install
cp .env.example .env.local
```

### Umgebungsvariablen

```env
GOOGLE_PLACES_API_KEY=   # Google Places API Key
SUPABASE_URL=            # Supabase Projekt-URL
SUPABASE_SERVICE_KEY=    # Supabase Service Role Key
API_SECRET=              # Eigener API-Schlüssel für gesicherte Endpunkte
```

### Lokale Entwicklung

```bash
npm run dev
# App läuft auf http://localhost:3000
```

### Deployment

```bash
vercel deploy
```

---

## Tech Stack

| Komponente | Technologie |
|---|---|
| Framework | Next.js 14 (App Router) |
| Sprache | TypeScript |
| Datenbank | Supabase (PostgreSQL) |
| Externe API | Google Places API |
| Deployment | Vercel (Serverless) |

---

## Projektkontext

Entwickelt für **TGM Automation** zur automatisierten B2B-Leadgenerierung im frankophonen Markt. Das Tool identifiziert Unternehmen mit niedrigem Digitalisierungsgrad — genau die Zielgruppe für Workflow-Automatisierungslösungen.

Abgedeckte Märkte: Frankreich, Belgien, Kanada, Kamerun, Senegal, Côte d'Ivoire und weitere frankophone Länder.

---

## Lizenz

MIT — freie Verwendung mit Quellenangabe.
