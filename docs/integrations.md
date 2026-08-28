# Integrations

Third-party services TAHADHARI depends on.

## Summary

| Service | Used for | Populates |
| --- | --- | --- |
| Google Earth Engine | Satellite vegetation index | `environmental_data.ndvi_value` |
| OpenWeatherMap | Rainfall | `environmental_data.rainfall` |
| OpenStreetMap | Base map tiles and road networks | Client map rendering |
| Photo storage | Hosting incident report images | `incident_report_photos.photo_url` |
| Heroku | Backend hosting | — |
| Vercel | Dashboard hosting | — |

## Google Earth Engine

Extracts the Normalized Difference Vegetation Index (NDVI) from the NASA MODIS `MOD13A1.061`
dataset. Dense vegetation gives poachers concealment, so NDVI is a core model feature.

| Setting | Value |
| --- | --- |
| Authentication | OAuth 2.0 service account |
| Credential | `GEE_SERVICE_ACCOUNT_JSON` |
| Cadence | Every 16 days, matching the MODIS revisit cycle |
| Scale factor | Raw values × 0.0001 |

The scale factor is required. MODIS ships NDVI as scaled integers, so skipping the multiplication
produces values in the thousands where the model expects a value near ±1.

Google Earth Engine's free tier covers non-commercial and research use. Confirm the project
registration covers your deployment.

## OpenWeatherMap

Supplies rainfall per grid cell, which drives animal movement toward water and therefore poacher
targeting.

| Setting | Value |
| --- | --- |
| Credential | `OWM_API_KEY` |
| Cadence | Daily |
| Populates | `environmental_data.rainfall`, in millimetres |

## OpenStreetMap

Provides base map tiles for the dashboard and the field client, and road network data used to
compute distance-to-road per grid cell.

The field client pre-caches tiles before departure so the map works with no connectivity — see
[Mobile](mobile.md).

**Reprojection is required.** OpenStreetMap data commonly arrives in SRID 3857 while the database
uses SRID 4326. Always apply `ST_Transform(geom, 4326)` on ingest, or spatial queries fail with a
mixed-SRID error.

The public OSM tile servers prohibit bulk downloading. Use a commercial tile provider or self-host
before deploying pre-caching at scale.

## Photo storage

`incident_report_photos.photo_url` stores a URL rather than binary data, so images are hosted
outside the database.

Photos of snare sites carry the location and timestamp of active poaching activity. URLs must be
access-controlled rather than public, and EXIF metadata should be stripped on upload so coordinates
cannot be read from the file directly.

## Hosting

| Service | Hosts | URL |
| --- | --- | --- |
| Heroku | FastAPI backend | `tahadhari-4157e9afb97a.herokuapp.com` |
| Vercel | Next.js dashboard | `compil-her-dashboard.vercel.app` |

