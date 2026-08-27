# Glossary

## Domain terms

**Boma** — A livestock enclosure at a pastoralist homestead. The unit at which livestock-attack risk
would be predicted by Model C, which is not currently implemented.

**Bushmeat** — Wild animal meat traded commercially. The economic driver behind wire snaring.

**Calving zone** — An area where herbivores give birth seasonally. Armed patrols entering during
calving can disturb breeding, so the system is intended to flag them advisorily.

**Grid cell** — The 1 km × 1 km unit the conservation area is divided into. One row in `locations`.
Every prediction, assignment and report is attached to one.

**Ranger** — Field operator who patrols assigned cells and files incident reports. A system role.

**Commander** — Plans and deploys patrols, reviews the heat map and incoming reports. A system role.

**Retaliatory killing** — Killing of predators by communities after livestock losses. The final step
in the ecological chain the product targets upstream.

**Snare** — A wire loop set to trap animals. Cheap, silent, indiscriminate, and the product's
primary target.

**Snare line / array** — Multiple snares set together across an animal path.

## Technical terms

**AUC-ROC** — Area under the receiver operating characteristic curve. Measures how well a model
ranks positives above negatives, independent of any threshold. 0.5 is random; 1.0 is perfect.

**Bcrypt** — Password hashing algorithm, deliberately slow to resist brute force.

**CHIRPS** — Climate Hazards Group InfraRed Precipitation with Station data. Gridded historical
rainfall.

**Feedback loop bias** — When a model's predictions determine where data is collected, which
reinforces those predictions. Unpatrolled cells generate no reports, so they look safe, so they stay
unpatrolled.

**GEE** — Google Earth Engine. Platform for planetary-scale satellite imagery analysis.

**GeoJSON** — JSON format for geographic features. The expected shape of the heat map response.

**GIST index** — Generalized Search Tree. The PostgreSQL index type that makes spatial queries fast.

**Idempotency key** — A client-generated identifier that lets a server recognise a retried request
as a duplicate. Essential for safe offline sync retries.

**IndexedDB** — Browser database for structured client-side storage. Backs the offline report queue.

**JWT** — JSON Web Token. A signed token carrying claims about the authenticated user.

**KWS** — Kenya Wildlife Service. The state body managing wildlife conservation in Kenya.

**Localforage** — Library providing a simpler API over IndexedDB.

**MODIS** — Moderate Resolution Imaging Spectroradiometer. NASA instrument supplying the 16-day
NDVI product `MOD13A1.061`.

**NDVI** — Normalized Difference Vegetation Index. Measures green vegetation density. **Ranges from
−1.0 to +1.0**; negative values indicate water or bare ground. Used as a proxy for concealment.

**OAuth2 password flow** — Authentication flow where a client exchanges a username and password for
a token. Requires the credential field to be named `username` — which here carries an email address.

**OpenAPI** — Machine-readable API specification. FastAPI generates one automatically at
`/openapi.json`.

**OSM** — OpenStreetMap. Open geographic data, used for base tiles and road networks.

**PostGIS** — Spatial extension for PostgreSQL. Adds geometry types and spatial indexing.

**Precision** — Of everything flagged risky, what fraction actually was. Low precision wastes patrol
effort.

**PWA** — Progressive Web App. A web app that installs and works offline via a service worker.

**Recall** — Of everything actually risky, what fraction was flagged. Low recall misses real snares.

**Service worker** — Browser script that intercepts network requests, enabling offline operation.

**SRID** — Spatial Reference System Identifier. `4326` is WGS 84 (latitude/longitude); `3857` is Web
Mercator. Mixing them causes query errors.

**Stale-while-revalidate** — Caching strategy serving the cached copy immediately while fetching a
fresh one in the background.

**UUID** — Universally Unique Identifier. Non-sequential, so it cannot be enumerated. Used for every
primary key.

**WGS 84** — The global coordinate system used by GPS. SRID 4326.

**XGBoost** — Extreme Gradient Boosting. Gradient-boosted decision trees; the risk model's
algorithm.
