<!-- # Integrations

Third-party services TAHADHARI depends on.

!!! warning "None of these was verified against running code"
    Their existence is inferred from the database columns they would populate and from the draft
    document. Configuration details are `[VERIFY]` throughout.

## Summary

| Service | Used for | Populates | Status |
| --- | --- | --- | --- |
| Google Earth Engine | Satellite vegetation index | `environmental_data.ndvi_value` | `[VERIFY]` |
| Weather provider | Rainfall | `environmental_data.rainfall` | `[VERIFY]` — **provider unclear** |
| OpenStreetMap | Base map tiles | Client rendering | `[VERIFY]` |
| Geofabrik | Road network shapefiles | Distance-to-road feature | `[VERIFY]` — no storage exists |
| Photo storage | Hosting report images | `incident_report_photos.photo_url` | **`[NOT YET DOCUMENTED]`** |
| Heroku | Application hosting | — | **Confirmed** |

## Google Earth Engine

**Purpose:** extract NDVI from the NASA MODIS `MOD13A1.061` dataset as a proxy for vegetation
density, and therefore for concealment.

| Setting | Value |
| --- | --- |
| Auth | OAuth 2.0 service account |
| Credential | `GEE_SERVICE_ACCOUNT_JSON` |
| Cadence | Every 16 days, matching the MODIS revisit cycle `[VERIFY]` |
| Scale factor | Raw values × 0.0001 |

The scale factor is not optional. MODIS NDVI ships as scaled integers; skipping the multiplication
gives values in the thousands where the model expects a value near ±1.

!!! danger "Two things to check before relying on this"
    **Licensing.** Google Earth Engine's free tier is for non-commercial and research use. Confirm
    the project's registration covers the intended deployment. A conservation authority deployment
    may or may not qualify. `[VERIFY]`

    **Credentials.** The draft names a specific GCP project ID and shows the credential variable
    inline. Service-account keys are private keys. If one has appeared in a shared document,
    **rotate it** — see [Environment Variables](getting-started/environment.md#security-finding-secrets-in-the-draft-document).

## Weather provider

!!! bug "The draft contradicts itself in a single sentence"
    It states rainfall is fetched *"from the CHIRPS API from the OpenWeatherMap API"*.

    These are different services with different characteristics. **CHIRPS** is gridded historical
    rainfall, well suited to building a training set. **OpenWeatherMap** is current conditions and
    forecasts, suited to live inference.

    The environment variable is `OWM_API_KEY`, which points to OpenWeatherMap.

    A defensible answer is *both* — CHIRPS for historical training data, OpenWeatherMap for live
    inference. But if that is the design, it must be stated, because a model trained on CHIRPS
    values and served OpenWeatherMap values at inference will silently degrade from the
    distribution shift. `[DECISION NEEDED]`

## OpenStreetMap and Geofabrik

**Tiles** are served to the map client. For the offline field client, tiles must be pre-cached
before departure — see [Mobile](mobile.md).

!!! note "OSM tile usage policy"
    The public OSM tile servers have a usage policy that prohibits bulk downloading. Pre-caching an
    entire patrol area for multiple rangers is plausibly bulk downloading. Use a commercial tile
    provider or self-host before a pilot. This is the kind of thing that works fine in development
    and gets your IP blocked in the field. `[VERIFY]`

**Geofabrik** road shapefiles feed the distance-to-road feature. Note that no table stores road
geometry and no column stores the computed distance — see
[Model](ai/model.md#features).

!!! warning "Reprojection is required"
    OSM data commonly arrives in SRID 3857. The database uses SRID 4326. Always
    `ST_Transform(geom, 4326)` on ingest, or spatial queries fail with a mixed-SRID error. See
    [Troubleshooting](troubleshooting.md).

## Photo storage

**This is a genuine gap.** `incident_report_photos.photo_url` stores a URL, so files live somewhere
outside the database — but no storage service, bucket, credential or upload path is documented
anywhere.

Questions that must be answered before the field client can attach a photo to anything:

- Which service hosts the files?
- Does the client upload directly, or via the backend?
- Are the URLs public? **A public URL to a snare photo carries the GPS metadata and timestamp of a
  poaching site.** They should be access-controlled.
- Is EXIF data stripped? If not, the photo leaks precise coordinates independently of the API.
- What is the retention policy?

## Heroku

**Confirmed.** The API is served from `tahadhari-4157e9afb97a.herokuapp.com`. See
[Deployment](deployment/index.md).

## Not integrated

The draft mentions daily text alerts to communities. **No messaging integration exists** in the API
surface, and no table stores community contacts. `[NOT YET DOCUMENTED]` — this is unbuilt, not
undocumented. -->
