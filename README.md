# Spritkosten-Rechner mit Tankerkönig

PWA für Android, iPhone, Windows und Desktop-Browser. Die App berechnet eine Route anhand manuell eingegebener Start- und Zieladressen, ermittelt den Kraftstoffbedarf und holt aktuelle Tankstellenpreise über die Tankerkönig-API. Es wird kein GPS- oder Geräte-Standortzugriff verwendet.

## Datenquelle und Kosten

- Tankerkönig API: https://creativecommons.tankerkoenig.de/
- API-Nutzung ist kostenlos, benötigt aber einen persönlichen API-Schlüssel und eine Registrierung.
- Datenlizenz: CC BY 4.0. Quellenhinweis ist in der App enthalten.
- Die API wird erst auf Nutzeraktion abgefragt; bitte keine automatisierten Dauerabfragen einrichten.
- Die Tankpreissuche kann am Startort, am Zielort oder an bis zu fünf Punkten entlang der Route erfolgen.
- Die Ortsbestimmung erfolgt ausschließlich über die manuell eingegebenen Adressen via OpenStreetMap/Nominatim; die Browser-Geolocation-API wird nicht verwendet und es wird keine Standortberechtigung angefordert.
- Die App berechnet den Durchschnitt aus den gefundenen Tankstellen mit Preis im gewählten Umkreis. Wenn geöffnete Stationen verfügbar sind, werden diese bevorzugt.

## API-Schlüssel einrichten

1. Bei https://creativecommons.tankerkoenig.de/ registrieren und persönlichen API-Schlüssel anfordern.
2. Im Hosting-Dienst die Umgebungsvariable `TANKERKOENIG_API_KEY` mit dem Schlüssel setzen.
3. Niemals den Schlüssel in `public/index.html`, GitHub oder ein öffentliches Repository eintragen.
4. Optional lokal `.env.example` in `.env` kopieren; für den Serverbetrieb die Variable direkt im Hosting hinterlegen.

## Lokal starten

Voraussetzung: Node.js 18 oder neuer.

```bash
npm install
# TANKERKOENIG_API_KEY als Umgebungsvariable setzen
npm start
```

Danach `http://localhost:3000` öffnen. Für Installation als PWA und Standortfreigabe im produktiven Einsatz ist HTTPS erforderlich.

## Deployment

Das Projekt kann z. B. auf Render, Railway oder einem eigenen Node.js-Server betrieben werden:
- Build-/Install-Schritt: `npm install`
- Startbefehl: `npm start`
- Umgebungsvariable: `TANKERKOENIG_API_KEY`
- Node-Version: 18+
- HTTPS aktivieren

## Externe Dienste

- Geocoding: Nominatim / OpenStreetMap
- Routing: öffentlicher OSRM-Demo-Server
- Kraftstoffpreise: Tankerkönig / MTS-K

Die kostenlosen öffentlichen Dienste haben eigene Nutzungsbedingungen, Verfügbarkeits- und Rate-Limits. Für eine größere öffentliche Nutzung sollte vorab geprüft werden, ob die jeweiligen Bedingungen und Limits zum erwarteten Traffic passen.
