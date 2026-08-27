# Backend and Database

## Backend

Python + FastAPI, serving `/api/v1` at `https://tahadhari-4157e9afb97a.herokuapp.com`.
Interactive docs at `/docs`, schemas at `/redoc`.

### Authentication

OAuth2 password flow with JWT bearer tokens.

Get a token — form-encoded, with the email in the `username` field:

```bash
curl -X POST .../api/v1/users/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user@example.com&password=YOUR_PASSWORD"
```

Use it on every other request:

```
Authorization: Bearer <token>
```

Registration requires a token — there is no public signup. The first account comes from
`ADMIN_EMAIL` / `ADMIN_PASSWORD` in the backend `.env`.

### API reference

**Users**

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/v1/users/register` | Register a new user |
| `POST` | `/api/v1/users/login` | Log in *(no auth)* |
| `GET` | `/api/v1/users/rangers` | List on-duty rangers |
| `GET` | `/api/v1/users/commanders` | List commanders |
| `GET` | `/api/v1/users/me` | Read own profile |
| `GET` | `/api/v1/users/{user_id}` | Read a profile by ID |
| `PATCH` | `/api/v1/users/{user_id}` | Modify a profile |
| `DELETE` | `/api/v1/users/{user_id}` | Remove an account |
| `PATCH` | `/api/v1/users/{user_id}/change-password` | Change password |
| `PATCH` | `/api/v1/users/{user_id}/reactivate` | Reactivate an account |

**Assignments**

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/v1/assignments/deploy` | Assign a ranger to a grid cell |
| `GET` | `/api/v1/assignments/` | List deployments |
| `GET` | `/api/v1/assignments/ranger/{user_id}/map` | Cells assigned to one ranger |
| `DELETE` | `/api/v1/assignments/{assignment_id}` | Cancel a patrol route |

**Locations**

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/v1/locations/init` | Initialise a grid cell |
| `GET` | `/api/v1/locations/` | List all cells |
| `GET` | `/api/v1/locations/{grid_id}` | Read a cell by ID |

**Reports**

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/v1/reports/sync` | Sync offline field reports |
| `GET` | `/api/v1/reports/` | List incident logs |
| `GET` | `/api/v1/reports/{report_id}` | Read one incident log |
| `PATCH` | `/api/v1/reports/{report_id}` | Review and escalate |

**Photos**

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/v1/photos/upload` | Link a photo to a report |
| `GET` | `/api/v1/photos/report/{report_id}` | Read photos for a report |

**Risk**

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/v1/risk/calculate` | Trigger a risk calculation |
| `GET` | `/api/v1/risk/latest` | Read the current heat map |
| `GET` | `/api/v1/risk/grid/{grid_id}` | Read one cell's prediction |

**Environmental**

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/v1/environmental/ingest` | Ingest satellite and weather metrics |
| `GET` | `/api/v1/environmental/grid/{grid_id}` | Read latest telemetry for a cell |
| `GET` | `/api/v1/environmental/matrix` | Read the full feature timeline |

All endpoints require a bearer token except `POST /api/v1/users/login`.

### Error handling

Errors return a single `detail` key:

```json
{ "detail": "Not authenticated" }
```

For validation failures `detail` is an **array** of `{loc, msg, type}` objects instead of a string,
so clients must handle both forms.

| Code | Meaning |
| --- | --- |
| `200` | Success |
| `201` | Created |
| `401` | Missing, malformed or expired token |
| `403` | Role not permitted |
| `404` | No record with that ID |
| `422` | Validation failure |
| `500` | Server error |

---

## Database

PostgreSQL 16 with PostGIS 3.4. All primary keys are UUIDs; all timestamps are `TIMESTAMPTZ`.

### Allowed values

| Type | Values |
| --- | --- |
| `user_role` | `Commander`, `Ranger`, `Admin` |
| `risk_level_type` | `low`, `medium`, `high`, `critical` |
| `incident_type_category` | `Snare`, `Poachers`, `Carcass` |

### `users`

| Column | Type | Constraints |
| --- | --- | --- |
| `user_id` | UUID | Primary key |
| `first_name` | VARCHAR(50) | NOT NULL |
| `last_name` | VARCHAR(50) | NOT NULL |
| `role` | `user_role` | NOT NULL |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL |
| `phone` | VARCHAR(20) | UNIQUE, NOT NULL |
| `password_hash` | VARCHAR(250) | NOT NULL |
| `is_active` | BOOLEAN | NOT NULL, default `true` |
| `created_at` | TIMESTAMPTZ | NOT NULL |
| `created_by` | UUID | FK → `users.user_id` |

### `locations`

| Column | Type | Constraints |
| --- | --- | --- |
| `grid_id` | UUID | Primary key |
| `grid_name` | VARCHAR(50) | NOT NULL |
| `grid_dimension` | GEOMETRY(Polygon, 4326) | NOT NULL |

One row per 1 km × 1 km cell. All geometry uses SRID 4326.

### `environmental_data`

| Column | Type | Constraints |
| --- | --- | --- |
| `env_id` | UUID | Primary key |
| `grid_id` | UUID | FK → `locations`, NOT NULL |
| `ndvi_value` | DECIMAL(5,4) | NOT NULL, −1.0000 to 1.0000 |
| `rainfall` | DECIMAL(6,2) | NOT NULL, mm |
| `moon_phase` | DECIMAL(4,3) | NOT NULL, 0.000 to 1.000 |
| `captured_at` | TIMESTAMPTZ | NOT NULL |

### `risk_assessments`

| Column | Type | Constraints |
| --- | --- | --- |
| `assessment_id` | UUID | Primary key |
| `grid_id` | UUID | FK → `locations`, NOT NULL |
| `risk_score` | DECIMAL(3,2) | NOT NULL, CHECK 0.00–1.00 |
| `risk_level` | `risk_level_type` | NOT NULL |
| `generated_date` | TIMESTAMPTZ | NOT NULL |

### `assignments`

| Column | Type | Constraints |
| --- | --- | --- |
| `assignment_id` | UUID | Primary key |
| `grid_id` | UUID | FK → `locations`, NOT NULL |
| `user_id` | UUID | FK → `users`, NOT NULL |
| `assigned_at` | TIMESTAMPTZ | NOT NULL |
| `created_by` | UUID | FK → `users.user_id` |

### `reports`

| Column | Type | Constraints |
| --- | --- | --- |
| `report_id` | UUID | Primary key |
| `assignment_id` | UUID | FK → `assignments`, **NULL** |
| `user_id` | UUID | FK → `users`, NOT NULL |
| `grid_id` | UUID | FK → `locations`, NOT NULL |
| `incident_type` | `incident_type_category` | NOT NULL |
| `description` | TEXT | NULL |
| `report_date` | TIMESTAMPTZ | NOT NULL |
| `severity_level` | `risk_level_type` | NOT NULL |
| `arrests_made` | INTEGER | |
| `animals_caught` | INTEGER | |

`report_date` is when the incident was observed, not when it synced.

### `incident_report_photos`

| Column | Type | Constraints |
| --- | --- | --- |
| `photo_id` | UUID | Primary key |
| `report_id` | UUID | FK → `reports`, NOT NULL |
| `photo_url` | VARCHAR(250) | NOT NULL |
| `uploaded_at` | TIMESTAMPTZ | NOT NULL |

Images live outside the database; only URLs are stored.

### Relationships

| Parent | Child | Cardinality |
| --- | --- | --- |
| `locations` | `environmental_data` | 1 : many |
| `locations` | `risk_assessments` | 1 : many |
| `locations` | `assignments` | 1 : many |
| `locations` | `reports` | 1 : many |
| `users` | `assignments` | 1 : many |
| `users` | `reports` | 1 : many |
| `users` | `users` | Self-referential (`created_by`) |
| `assignments` | `reports` | 1 : many, optional |
| `reports` | `incident_report_photos` | 1 : many |

`reports.assignment_id` is the only nullable foreign key — rangers can log incidents found outside
an assignment, so joins to `assignments` must use a `LEFT JOIN`.