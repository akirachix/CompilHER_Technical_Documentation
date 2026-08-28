# TAHADHARI System Architecture: Backend & Database

Welcome to the core backend engineering reference for the **TAHADHARI Ecosystem**. This platform provides high-throughput telemetry ingestion, predictive wildlife risk modeling, and seamless operational synchronization between **Commanders** at HQ and **Rangers** deployed in the field.

---

## 1. Getting Started

Follow these step-by-step instructions to get your local development environment up and running.

### Prerequisites

Ensure your local host machine meets the following strict system engine requirements:

| Tool       | Version        |
| ---------- | -------------- |
| Python     | 3.12+          |
| PostgreSQL | 16             |
| PostGIS    | 3.4            |
| Git        | Recent version |

### Local Environment Initialization

#### Step 1: Clone Core Repository

Clone the project backend code directly from the organization repository:

```bash
git clone https://github.com
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
> _The `ADMIN_EMAIL` and `ADMIN_PASSWORD` keys seed the initial base user. Because client registration requires a valid bearer token, these values let you establish the first master dashboard session._

#### Step 4: Provision Spatial Database Architecture

Log into your local PostgreSQL console instance and execute these structural commands to spin up the relational data store:

```bash
psql -U postgres -c "CREATE DATABASE tahadhari_db;"
psql -U postgres -d tahadhari_db -c "CREATE EXTENSION IF NOT EXISTS postgis;"
psql -U postgres -d tahadhari_db -c 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
```

- **`postgis`** enables high-performance `GEOMETRY(Polygon)` data handling for tactical 1km × 1km grid patterns.

- **`uuid-ossp`** configures native generation loops for secure UUID primary keys.

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

- **Interactive OpenAPI Specs (Local):** [http://localhost:8000/docs](http://localhost:8000/docs)

- **Production Live Swagger UI Engine:** [https://herokuapp.com](https://tahadhari-4157e9afb97a.herokuapp.com/)

---

## 2. Core Repository Architecture

The codebase follows an explicit **Repository-Router-Service Pattern** within the main package directories. This separates data ingestion logic from business validation workflows and core database management layers.

```text
Compil-HER_Backend/
│
├── alembic/                    # Database schema migration control scripts
│   └── versions/               # Incremental SQL migration history scripts
│
├── tahadhari/                  # Core application source root
│   ├── core/                   # Global configuration and cross-cutting profiles
│   │   └── config.py           # Pydantic BaseSettings environment validations
│   │
│   ├── models/                 # SQLAlchemy structural data-layer entity models
│   │   ├── assignment.py       # Patrol grid deployment models
│   │   ├── environmental.py    # Satellite data telemetry logs
│   │   └── ...                 # user.py, reports.py, risk.py, locations.py
│   │
│   ├── repositories/           # Isolated data layer interfaces (Direct SQL access)
│   │   ├── user_repository.py  # User specific database queries & persistence
│   │   └── ...                 # CRUD engines for assignments, reports, risk layers
│   │
│   ├── routers/                # FastAPI routing paths (HTTP API endpoints)
│   │   ├── auth.py             # Login processing, TOTP / MFA checking routes
│   │   └── ...                 # Endpoint controllers for maps, telemetry, assets
│   │
│   ├── schemas/                # Pydantic validation structures (Data envelopes)
│   │   └── ...                 # Enforced input/output serialization payloads
│   │
│   └── services/               # Explicit business domains (Predictive risk modeling)
│
├── database.py                 # Structural async session pool engine configuration
├── dependencies.py             # FastAPI dependency injections (JWT & RBAC interceptors)
├── main.py                     # Gateway ASGI initialization engine app context
├── Procfile                    # Cloud process allocation matrix for Heroku runtime
└── requirements.txt            # Explicit third-party system requirements manifest
```

---

## 3. Comprehensive Zero-Trust Security Architecture

The TAHADHARI backend implements a strict **Zero-Trust Security Framework** across transport, authentication, and authorization layer contexts. Security is not applied as a post-process; it is deeply embedded directly inside global FastAPI dependencies, interceptor routers, and database middleware layers.

Click on the tabs below to explore the explicit implementation files, logic, and code structures.

=== " Core Configuration (`config.py`)"

    ### Cryptographic Profiles & Environmental Properties
    All security policies rely on cryptographically secure environment profiles. A new developer must verify these parameters are bound inside their localized configuration matrix:

    ```python
    # Location: Compil-HER_Backend/backend/tahadhari/core/config.py
    from pydantic_settings import BaseSettings

    class SecuritySettings(BaseSettings):
        SECRET_KEY: str  # Generated via: openssl rand -hex 32
        ALGORITHM: str = "HS256"
        ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
        REFRESH_TOKEN_EXPIRE_DAYS: int = 7
        
        # Cross-Site Request Forgery Enforcements
        CSRF_COOKIE_NAME: str = "tahadhari_csrf"
        CSRF_SECRET: str
        
        class Config:
            env_file = ".env"

    security_settings = SecuritySettings()
    ```

=== " JWT & Hashing Lifecycles (`security.py`)"

    ### Session Interceptors & Token Lifecycles
    We combine stateless **JSON Web Tokens (JWT)** with secure **CSRF mitigation tokens** and sliding-window refresh cycles to safeguard sessions.

    ```python
    # Location: Compil-HER_Backend/backend/tahadhari/core/security.py
    from datetime import datetime, timedelta, timezone
    from typing import Optional
    from jose import jwt, JWTError
    from passlib.context import CryptContext

    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def get_password_hash(password: str) -> str:
        """Generates a salt-unique cryptographic bcrypt hash string."""
        return pwd_context.hash(password)

    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verifies cleartext parameters against salt-encoded storage targets."""
        return pwd_context.verify(plain_password, hashed_password)

    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
        """Signs an ephemeral JWT access token mapping explicit user claims."""
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=15))
        to_encode.update({"exp": int(expire.timestamp()), "type": "access"})
        return jwt.encode(to_encode, security_settings.SECRET_KEY, algorithm=security_settings.ALGORITHM)
    ```

=== " Token Verification Middleware (`dependencies.py`)"

    ### Dependency Overrides & Claims Verification
    FastAPI intercepts inbound requests before reaching router controllers using injection loops. The system unpacks the authorization header string, matches parameters, and checks for revocation.

    ```python
    # Location: Compil-HER_Backend/backend/tahadhari/dependencies.py
    from fastapi import Depends, HTTPException, status
    from fastapi.security import OAuth2PasswordBearer
    from jose import jwt, JWTError
    from sqlalchemy.orm import Session
    from tahadhari.core.config import security_settings
    from tahadhari.database import get_db
    from tahadhari.repositories.user_repository import UserRepository

    oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/users/login")

    async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
        """Global request interceptor checking token states and token signature health."""
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate security credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )
        try:
            payload = jwt.decode(token, security_settings.SECRET_KEY, algorithms=[security_settings.ALGORITHM])
            user_id: str = payload.get("sub")
            token_type: str = payload.get("type")
            
            if user_id is None or token_type != "access":
                raise credentials_exception
        except JWTError:
            raise credentials_exception
            
        user = UserRepository.get_by_uuid(db, user_uuid=user_id)
        if user is None or not user.is_active:
            raise HTTPException(status_code=403, detail="User account is deactivated or missing.")
        return user
    ```

=== " Two-Step Multi-Factor Auth (`auth.py`)"

    ### Time-Based One-Time Password (TOTP) Validation Flow
    As shown in your Swagger layouts (`POST /api/v1/users/login/mfa`), logins operate via a two-step validation model. Initial credentials match passes an ephemeral state tracking parameter, requiring a TOTP validation verification execution block to complete authentication.

    ```python
    # Location: Compil-HER_Backend/backend/tahadhari/routers/auth.py
    import pyotp
    from fastapi import APIRouter, Depends, HTTPException, status
    from sqlalchemy.orm import Session
    from tahadhari.database import get_db
    from tahadhari.schemas.auth import MFALoginPayload
    from tahadhari.repositories.user_repository import UserRepository
    from tahadhari.core.security import create_access_token

    router = APIRouter(prefix="/api/v1/users", tags=["Authentication"])

    @router.post("/login/mfa")
    async def verify_mfa_login_token(payload: MFALoginPayload, db: Session = Depends(get_db)):
        """Enforces explicit 6-digit cryptographic token validation against unique user seeds."""
        user = UserRepository.get_by_email(db, email=payload.email)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Identity mapping mismatch.")
            
        # Initialize the engine validation instance using the user's encrypted base32 secret seed
        totp_verifier = pyotp.TOTP(user.mfa_secret_seed)
        
        # Check the 6-digit string code against active sliding execution intervals (30s window)
        if not totp_verifier.verify(payload.totp_code, valid_window=1):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Invalid or expired multi-factor authentication token."
            )
            
        # Mint production tokens only upon passing TOTP layer validation
        access_token = create_access_token(data={"sub": str(user.uuid), "role": user.role.value})
        return {"access_token": access_token, "token_type": "bearer"}
    ```

=== " Role Clearance & RBAC (`assignments.py`)"

    ### Role-Based Access Control Enforcement
    Authorization routing parameters check user attributes (`UserRole.COMMANDER` or `UserRole.RANGER`) using modular functions injected directly into API paths.

    ```python
    # Location: Compil-HER_Backend/backend/tahadhari/routers/assignments.py
    from fastapi import APIRouter, Depends, status
    from tahadhari.dependencies import get_current_user
    from tahadhari.models.user import User, UserRole
    from tahadhari.schemas.assignment import AssignmentDeploySchema

    router = APIRouter(prefix="/api/v1/assignments", tags=["Patrol Route Assignments"])

    def enforce_clearance_level(required_roles: list[UserRole]):
        """Authorization factory checking user membership context profiles."""
        def dependency_interceptor(user: User = Depends(get_current_user)):
            if user.role not in required_roles:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Access denied. Insufficient role clearances for this operational vector."
                )
            return user
        return dependency_interceptor

    @router.post("/deploy", status_code=status.HTTP_201_CREATED, 
                 dependencies=[Depends(enforce_clearance_level([UserRole.COMMANDER]))])
    async def deploy_ranger_to_grid(payload: AssignmentDeploySchema):
        """Guarded API operation. Only reachable by users containing the COMMANDER enum role."""
        return {"status": "Deployment successful", "message": f"Ranger assigned to localized grid cell target."}
    ```


---

## 4. Relational Database Schema Model

The production instance runs on **PostgreSQL 16** with **PostGIS 3.4**. Primary keys are natively managed via non-sequential UUID nodes. Global temporal logs use standard transactional `TIMESTAMPTZ` properties.

The main engine components track coordinates and assignments across four core transactional structural systems: `users`, `locations`, `risk_assessments`, and `environmental_data`.

- **Database Layout Diagram:** Review relational tables, column layouts, unique constraints, and foreign bindings via our centralized design diagram:
  
  [🔗 TAHADHARI Entity Relationship Diagram (ERD Blueprint) ↗](https://lucid.app/lucidchart/729277ce-ce15-4e77-bdd9-eb9c0376218a/edit?view_items=QJ2~37ZeEoxc&page=0_0&invitationId=inv_fbccff22-40f7-4611-8aba-cec7308f5392)

- **Geographical Spatial Ingestion:** Cell boundaries leverage `GEOMETRY(Polygon, 4326)` structures. This setup drives our high-performance 1km × 1km telemetry grid math, proximity operations, and predictive risk heatmaps.

![TAHADHARI Relational Entity Mapping](assets/database/erd.png)

---

## 5. Microservice API Reference Map

All endpoints below require a valid bearer token payload configuration except for `POST /api/v1/users/login`. Click on any service tab below to expand its API reference table.

=== " Users Management"

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

=== " Assignments & Deployment"

    | Method | Path | Purpose |
    | :--- | :--- | :--- |
    | `POST` | `/api/v1/assignments/deploy` | Assign a ranger to a grid cell |
    | `GET` | `/api/v1/assignments/` | List deployments |
    | `GET` | `/api/v1/assignments/ranger/{user_id}/map` | Cells assigned to one ranger |
    | `DELETE` | `/api/v1/assignments/{assignment_id}` | Cancel a patrol route |

=== " Spatial Locations Grid"

    | Method | Path | Purpose |
    | :--- | :--- | :--- |
    | `POST` | `/api/v1/locations/init` | Initialise a grid cell |
    | `GET` | `/api/v1/locations/` | List all cells |
    | `GET` | `/api/v1/locations/{grid_id}` | Read a cell by ID |

=== " Field Reports & Incident Tracking"

    | Method | Path | Purpose |
    | :--- | :--- | :--- |
    | `POST` | `/api/v1/reports/sync` | Sync offline field reports |
    | `GET` | `/api/v1/reports/` | List incident logs |
    | `GET` | `/api/v1/reports/{report_id}` | Read one incident log |
    | `PATCH` | `/api/v1/reports/{report_id}` | Review and escalate |

=== " Multimedia Management"

    | Method | Path | Purpose |
    | :--- | :--- | :--- |
    | `POST` | `/api/v1/photos/upload` | Link a photo to a report |
    | `GET` | `/api/v1/photos/report/{report_id}` | Read photos for a report |

=== " Risk Assessment Models"

    | Method | Path | Purpose |
    | :--- | :--- | :--- |
    | `POST` | `/api/v1/risk/calculate` | Trigger a risk calculation |
    | `GET` | `/api/v1/risk/latest` | Read the current heat map |
    | `GET` | `/api/v1/risk/grid/{grid_id}` | Read one cell's prediction |

=== " Environmental Telemetry"

    | Method | Path | Purpose |
    | :--- | :--- | :--- |
    | `POST` | `/api/v1/environmental/ingest` | Ingest satellite and weather metrics |
    | `GET` | `/api/v1/environmental/grid/{grid_id}` | Read latest telemetry for a cell |
    | `GET` | `/api/v1/environmental/matrix` | Read the full feature timeline |

---
##  6. Quality Assurance, Verification & Automated Testing Matrix

API behaviors are checked through comprehensive testing pipelines within a shared team runtime environment. We enforce a zero-production-bug policy by subjecting code modifications to three distinct automated testing layers before repository merger: **Unit Testing**, **Integration Testing**, and **End-to-End Functional Flows**.

### Testing Isolation & Environment Management
To prevent test cross-contamination and database corruption, our automated pipeline operates under strict runtime constraints:

*   **Database Sandbox Isolation:** Tests never target production or standard local development databases. Pytest initialization hooks programmatically orchestrate a clean, isolated spatial database (`tahadhari_test_db`).

*   **Transactional Rollback Loop:** Every individual execution block runs inside an isolated atomic transaction block. The session engine issues a structural `ROLLBACK` database statement immediately after a test method finishes, restoring the sandbox environment to a pristine state.

*   **Dependency Override Engine:** We use FastAPI’s dependency overriding mechanism (`app.dependency_overrides`) at runtime to safely swap the live database connection out for the isolated testing connection pool.

Click on the tabs below to explore our automated testing suites and team replication instructions.

=== " Tier 1: Unit Testing"

    ### Cryptographic & Payload Unit Validations
    Unit validations evaluate isolated functions without spinning up an active web server context. This tier tests password hashing utilities, JWT encoder/decoder subroutines, and token expiration edge cases.

    ```python
    # Location: Compil-HER_Backend/backend/tests/unit/test_security.py
    import pytest
    from datetime import timedelta
    from jose import jwt
    from tahadhari.core.config import settings
    from tahadhari.core.security import create_access_token, verify_password, get_password_hash

    def test_password_cryptographic_hashing_lifecycle():
        """Validates pass hashes are securely evaluated and salt-unique."""
        raw_password = "SecureRangerPassword123!"
        hashed_str = get_password_hash(raw_password)
        
        assert hashed_str != raw_password
        assert verify_password(raw_password, hashed_str) is True
        assert verify_password("WrongPassword123!", hashed_str) is False

    def test_jwt_token_generation_and_claim_serialization():
        """Validates stateless token payloads properly bake explicit UUID vectors."""
        user_id_payload = "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
        token_data = {"sub": user_id_payload, "role": "ranger"}
        
        token = create_access_token(data=token_data, expires_delta=timedelta(minutes=15))
        decoded_claims = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        
        assert decoded_claims.get("sub") == user_id_payload
        assert decoded_claims.get("role") == "ranger"
        assert "exp" in decoded_claims
    ```

=== " Tier 2: Integration Testing"

    ### Guarded Endpoints & RBAC Middleware Verification
    Integration validations utilize an asynchronous test client to execute virtual mock HTTP request/response lifecycles against target API routing layers, asserting security restrictions and status codes.

    ```python
    # Location: Compil-HER_Backend/backend/tests/integration/test_rbac_middleware.py
    import pytest
    from httpx import AsyncClient
    from starlette import status
    from tahadhari.main import app

    @pytest.mark.asyncio
    async def test_unauthenticated_request_rejection():
        """Asserts guarded routes throw standard 401 envelopes when lacking headers."""
        async with AsyncClient(app=app, base_url="http://test") as ac:
            response = await ac.get("/api/v1/assignments/")
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert response.json() == {"detail": "Not authenticated"}

    @pytest.mark.asyncio
    async def test_ranger_role_access_restriction_on_commander_routes(ranger_auth_header: dict):
        """Verifies RBAC middleware throws a 403 when a Ranger tries to call a Commander route."""
        deployment_payload = {
            "ranger_id": "c3b073b0-d779-4171-8bc6-df3029f60bfb",
            "grid_cell_id": "e22a4b8f-1a1a-4c22-921d-bc40d2109ff1",
            "shift_start": "2026-08-28T08:00:00Z"
        }
        
        async with AsyncClient(app=app, base_url="http://test") as ac:
            response = await ac.post(
                "/api/v1/assignments/deploy",
                json=deployment_payload,
                headers=ranger_auth_header
            )
            
        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert "Insufficient security clearance" in response.json()["detail"]
    ```

=== " Tier 3: End-to-End (E2E) Testing"

    ### Multi-Step Telemetry & PostGIS Spatial Ingestion Flows
    End-to-end testing executes sequential dependency pipelines: authenticating a commander, initializing a 1km x 1km PostGIS spatial grid partition, and updating telemetry metrics across the newly populated cells.

    ```python
    # Location: Compil-HER_Backend/backend/tests/e2e/test_spatial_telemetry_flow.py
    import pytest
    from httpx import AsyncClient
    from starlette import status
    from tahadhari.main import app

    @pytest.mark.asyncio
    async def test_commander_grid_initialization_to_telemetry_ingest_flow(commander_auth_header: dict):
        """Validates multi-step cross-functional engine sequence from grid provisioning to satellite data ingestion."""
        async with AsyncClient(app=app, base_url="http://test") as ac:
            
            # Step 1: Provision a new geographical grid cell boundary (WGS84 Coordinates)
            spatial_cell_payload = {
                "cell_identifier": "GRID-ZONE-DELTA-9",
                "polygon_coordinates": [
                    [36.70, -1.30], [36.71, -1.30], 
                    [36.71, -1.31], [36.70, -1.31], [36.70, -1.30]
                ]
            }
            grid_response = await ac.post(
                "/api/v1/locations/init", 
                json=spatial_cell_payload, 
                headers=commander_auth_header
            )
            assert grid_response.status_code == status.HTTP_201_CREATED
            grid_id = grid_response.json()["grid_id"]
            
            # Step 2: Ingest environmental satellite indices against the provisioned PostGIS coordinate bounds
            telemetry_payload = {
                "grid_id": grid_id,
                "normalized_difference_vegetation_index": 0.68,
                "surface_temperature_celsius": 24.5,
                "precipitation_probability": 12.4
            }
            telemetry_response = await ac.post(
                "/api/v1/environmental/ingest",
                json=telemetry_payload,
                headers=commander_auth_header
            )
            assert telemetry_response.status_code == status.HTTP_200_OK
            
            # Step 3: Read back the matrix history tracking profile to confirm structural write success
            matrix_response = await ac.get(
                f"/api/v1/environmental/grid/{grid_id}",
                headers=commander_auth_header
            )
            assert matrix_response.status_code == status.HTTP_200_OK
            assert matrix_response.json()["normalized_difference_vegetation_index"] == 0.68
    ```

=== " Team Postman Workspace"

    ### Collaborative Workspace Sync & Run Parameters
    To sync local automated verifications with teammate environments, use our shared Postman ecosystem workspace:

    *   **Shared Testing Workspace:** Team engineers must pull down, synchronize, and update endpoints using our unified workspace collections profile:
        🔗 **[TAHADHARI Shared Team Postman Collection ↗](https://app.getpostman.com/join-team?invite_code=e380dbd8a01c92f7641f28732d2bcc5bfe881b33161140d31c91e50975a54188&target_code=34bab4b5518b537c18eb64aef38447ac)** 

    #### Interactive Team Validation Steps
    1. Open your Postman team runtime agent. Execute a `POST` request against the `/api/v1/users/login` endpoint using your active developer seed coordinates.
    2. The pre-request and test-assertion scripts built into the team repository collection will parse the resulting `access_token` string payload from the response body.
    3. Postman automatically binds this token string to your local collection namespace environment configuration as `{{accessToken}}`. This token value is then programmatically appended as a Bearer authorization string block to all secure downstream testing components.


---

## 7. Continuous Deployment & Cloud Infrastructure

Our production service tier and database instances are hosted and scaled on **Heroku**.

- **Live Infrastructure Control Panel:** To check system deployment states, evaluate runtime process loads, or review variable configurations, visit the cloud panel:
  🔗 **[TAHADHARI Production Heroku Console Dashboard ↗](https://tahadhari-4157e9afb97a.herokuapp.com/)** 

### Release Pipeline Actions

- **Process Control Matrix:** Managed via the project's root `Procfile`, which sets up high-performance **Uvicorn** worker threads running behind an ASGI server loop.
- **Automated Migration Hook:** Database schemas are systematically checked and upgraded right before initialization via an integrated release phase step (`release: alembic upgrade head`).

---

## 8. Standardized Application Error Envelopes

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

Click on the tabs below to verify how error parameters map out across structural client interactions.

=== "✅ Success & Standard Responses"

    | Code | Meaning | Context / Description |
    | :--- | :--- | :--- |
    | `200` | Success | The request completed successfully and returned data. |
    | `201` | Created | Resource successfully initialized inside the data layers. |

=== "❌ Validation & Authorization Errors"

    | Code | Meaning | Context / Description |
    | :--- | :--- | :--- |
    | `401` | Unauthorized | Missing, malformed, or expired token payload strings. |
    | `403` | Forbidden | Operation rejected. Insufficient security clearance scopes. |

## 9. Code Standards & Structural Conventions

To maintain a clean and maintainable codebase on shared environments, all backend engineers must adhere to the following development guidelines before pushing code to the repository.

### Naming Conventions

- **Files and Directories:** Use strict `snake_case` for all Python modules, utilities, and folder paths (e.g., `user_repository.py`).

- **Classes:** Use strict `PascalCase` for all SQLAlchemy data models and Pydantic schema envelopes (e.g., `UserAssignment`).

- **Functions and Variables:** Use explicit `snake_case` for endpoints, dependencies, and internal variables (e.g., `get_current_user`).

### Commit Message Format

We follow a strict semantic commit format to keep our version control history perfectly organized:

- `feat:` Use when introducing a completely new API route, router module, or data feature (e.g., `feat: add TOTP validation route`).

- `fix:` Use when patching an endpoint bug, data model validation gap, or type mismatch (e.g., `fix: resolve PostGIS spatial polygon type crash`).

- `docs:` Use when modifying technical markdown records, inline definitions, or Swagger metadata.

- `refactor:` Use when restructuring existing directory paths or logic trees without altering operational endpoints.

---

## 10. Database Schema Migrations (Alembic Workflow)

Whenever you alter a database structure (adding a table, renaming a column, or modifying a PostGIS geometry attribute), do not execute manual queries against your database engine. Use our structured migration lifecycle:

### Step 1: Detect Schema Mutations Automatically

With your local application and virtual environment active, auto-generate a new version control migration script:

```bash
alembic revision --autogenerate -m "describe_your_structural_changes_here"
```

### Step 2: Code Review the Migration Script

Open the newly generated Python module inside the `alembic/versions/` directory. Verify that both the `upgrade()` and `downgrade()` logic matches your intentional schema modifications.

### Step 3: Propagate Upgrades and Downgrades

```bash
# Push structural definitions upstream to your active target database
alembic upgrade head

# Rollback one sequential structural version step if errors happen
alembic downgrade -1
```

---

## 11. Automated Testing Suite & Code Linting

Before pushing your branch for peer code review or continuous integration tests on Heroku, verify your implementation behavior locally.

### Local Test Execution Suite

Our validation environment uses `pytest` for mock lifecycle processing:

```bash
# Execute the entire backend testing pipeline
pytest -v

# Run verification checks exclusively against your active target module
pytest tests/test_openapi.py -v
```

### Formatting Enforcements

Run our code analysis engine tools from the root folder to make sure your styles match your team's code configurations:

```bash
# Auto-sort imports to keep package structures standardized
isort .

# Run automated formatting alignments across Python folders
black .
```
