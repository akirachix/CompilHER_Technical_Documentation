#  TAHADHARI System Architecture: Backend & Database

Welcome to the core backend engineering reference for the **TAHADHARI Ecosystem**. This platform provides high-throughput telemetry ingestion, predictive wildlife risk modeling, and seamless operational synchronization between **Commanders** at HQ and **Rangers** deployed in the field.

---

##  1. Getting Started

Follow these step-by-step instructions to get your local development environment up and running.

###  Prerequisites
Ensure your local host machine meets the following strict system engine requirements:

| Tool       | Version               |
| ---------- | --------------------- |
| Python     | 3.12+                 |
| PostgreSQL | 16                    |
| PostGIS    | 3.4                   |
| Git        | Recent version        |

### Local Environment Initialization

#### Step 1: Clone Core Repository
Clone the project backend code directly from the organization repository:
```bash
git clone https://github.com/akirachix/Compil-HER_Backend.git
```

#### Step 2: Configure and Boot the FastAPI Server
```bash
# Navigate to backend application directory
cd Compil-HER_Backend/backend

# Create and isolate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install exact dependency trees
pip install -r requirements.txt
```

#### Step 3: Populate Environment Profiles
Create a standard system configuration file named `.env` in your `Compil-HER_Backend/backend/` root directory:
```env
API_URL=http://localhost:8000
LOGIN_URL=http://localhost:3000/login
FRONTEND_URL=http://localhost:3000

DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/tahadhari_db
SECRET_KEY=YOUR_SECURE_SECRET

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=YOUR_ADMIN_PASSWORD
```
> **CRITICAL SECURITY NOTE:** Never commit the `.env` file to source control. Generate your cryptographically secure `SECRET_KEY` by running:
> `python3 -c "import secrets; print(secrets.token_urlsafe(64))"`
> 
> *The `ADMIN_EMAIL` and `ADMIN_PASSWORD` keys seed the initial base user. Because client registration requires a valid bearer token, these values let you establish the first master dashboard session.*

#### Step 4: Provision Spatial Database Architecture
Log into your local PostgreSQL console instance and execute these structural commands to spin up the relational data store:
```bash
psql -U postgres -c "CREATE DATABASE tahadhari_db;"
psql -U postgres -d tahadhari_db -c "CREATE EXTENSION IF NOT EXISTS postgis;"
psql -U postgres -d tahadhari_db -c 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
```

* **`postgis`** enables high-performance `GEOMETRY(Polygon)` data handling for tactical 1km × 1km grid patterns.

* **`uuid-ossp`** configures native generation loops for secure UUID primary keys.

Now run system upgrades and seed test data files to populate the tables:
```bash
alembic upgrade head
python seed_data.py
```

#### Step 5: Configure Dashboard Environment variables
Create a `.env.local` configuration file in your dashboard layout project root directory and add the following variable:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### Step 6: Launch the Backend Service Gateway
Run the live server loop with the reload flag active for fast prototyping changes:
```bash
cd Compil-HER_Backend/backend
source venv/bin/activate

uvicorn app.main:app --reload --port 8000
```

#### Step 7: Verify Application Engine Connectivity

Once channels are open, verify application connectivity statuses instantly:

* **Interactive OpenAPI Specs (Local):** [http://localhost:8000/docs](http://localhost:8000/docs)

* **Production Live Swagger UI Engine:** [https://herokuapp.com](https://tahadhari-4157e9afb97a.herokuapp.com/)

---

##  2. Security & Core API Workflows

### Authentication Flow
The system operates exclusively via an **OAuth2 Password Bearer Flow** enforcing ephemeral signed stateless JSON Web Tokens (JWT).

#### Fetch Authorization Token Sequence
Get a bearer token - form-encoded, passing user emails inside the native `username` field target:
```bash
curl -X POST https://herokuapp.com \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user@example.com&password=YOUR_PASSWORD"
```

Pass the generated session token string safely within the header payload framework for all guarded sub-routes:
```text
Authorization: Bearer <token>
```
> Note: Account creation functions are protected. There is no open public registration path; new users must be created through an administrative dashboard session.

---

##  3. Microservice API Reference Map

All endpoints below require a valid bearer token payload configuration except for `POST /api/v1/users/login`.

### Users Management

| Method | Path | Purpose |
| :--- | :--- | :--- |
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

### Assignments & Deployment

| Method | Path | Purpose |
| :--- | :--- | :--- |
| `POST` | `/api/v1/assignments/deploy` | Assign a ranger to a grid cell |
| `GET` | `/api/v1/assignments/` | List deployments |
| `GET` | `/api/v1/assignments/ranger/{user_id}/map` | Cells assigned to one ranger |
| `DELETE` | `/api/v1/assignments/{assignment_id}` | Cancel a patrol route |

### Spatial Locations Grid

| Method | Path | Purpose |
| :--- | :--- | :--- |
| `POST` | `/api/v1/locations/init` | Initialise a grid cell |
| `GET` | `/api/v1/locations/` | List all cells |
| `GET` | `/api/v1/locations/{grid_id}` | Read a cell by ID |

### Field Reports & Incident Tracking

| Method | Path | Purpose |
| :--- | :--- | :--- |
| `POST` | `/api/v1/reports/sync` | Sync offline field reports |
| `GET` | `/api/v1/reports/` | List incident logs |
| `GET` | `/api/v1/reports/{report_id}` | Read one incident log |
| `PATCH` | `/api/v1/reports/{report_id}` | Review and escalate |

### Multimedia Management

| Method | Path | Purpose |
| :--- | :--- | :--- |
| `POST` | `/api/v1/photos/upload` | Link a photo to a report |
| `GET` | `/api/v1/photos/report/{report_id}` | Read photos for a report |

### Risk Assessment & Prediction Models

| Method | Path | Purpose |
| :--- | :--- | :--- |
| `POST` | `/api/v1/risk/calculate` | Trigger a risk calculation |
| `GET` | `/api/v1/risk/latest` | Read the current heat map |
| `GET` | `/api/v1/risk/grid/{grid_id}` | Read one cell's prediction |

### Environmental Telemetry Layers

| Method | Path | Purpose |
| :--- | :--- | :--- |
| `POST` | `/api/v1/environmental/ingest` | Ingest satellite and weather metrics |
| `GET` | `/api/v1/environmental/grid/{grid_id}` | Read latest telemetry for a cell |
| `GET` | `/api/v1/environmental/matrix` | Read the full feature timeline |

---

##  4. Standardized Application Error Envelopes

The backend structural framework handles edge cases explicitly. Standard operational rejections output a single `detail` key-value string:

```json
{ 
  "detail": "Not authenticated" 
}
```

For client request or Pydantic layer data type alignment exceptions, the `detail` object converts to an **array payload listing** detailing `{loc, msg, type}` vectors:

```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "value is not a valid email address",
      "type": "value_error.email"
    }
  ]
}
```

### Global System Server Code Map

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

## 5. Relational Database Schema Model

The production instance runs on **PostgreSQL 16** with **PostGIS 3.4**. Primary keys are natively managed via non-sequential UUID nodes. Global temporal logs use standard transactional `TIMESTAMPTZ` properties.

The main engine components track coordinates and assignments across four core transactional structural systems: `users`, `locations`, `risk_assessments`, and `environmental_data`.

![TAHADHARI Relational Entity Mapping](assets/database/erd.png)
