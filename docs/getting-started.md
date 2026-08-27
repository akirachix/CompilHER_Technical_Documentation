# Getting Started

Set up TAHADHARI locally for development.

## 1. Prerequisites

Install:

| Tool       | Version               |
| ---------- | --------------------- |
| Python     | 3.12+                 |
| PostgreSQL | 16                    |
| PostGIS    | 3.4                   |
| Node.js    | 20.x LTS              |
| npm        | Included with Node.js |
| Git        | Recent version        |

## 2. Clone the Repositories

Clone both the FastAPI backend and Next.js dashboard:

```bash
git clone https://github.com/akirachix/Compil-HER_Backend.git
git clone https://github.com/akirachix/Compil-HER_Dashboard.git
```

## 3. Set Up the Backend

```bash
cd Compil-HER_Backend/backend

python3 -m venv venv
source venv/bin/activate

pip install -r requirements.txt
```

## 4. Configure Environment Variables

Create `backend/.env`:

```env
API_URL=http://localhost:8000
LOGIN_URL=http://localhost:3000/login
FRONTEND_URL=http://localhost:3000

DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/tahadhari_db
SECRET_KEY=YOUR_SECURE_SECRET

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=YOUR_ADMIN_PASSWORD
```

Never commit `.env` or real credentials to the repository.

Generate a secure `SECRET_KEY`:

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(64))"
```

`ADMIN_EMAIL` and `ADMIN_PASSWORD` create the first account. This matters because
`POST /api/v1/users/register` requires an authenticated token — without a seeded admin there is no
way to create your first user through the API. Log in with these credentials, then create other
accounts from the dashboard.

## 5. Set Up the Database

Create the database and enable the required extensions:

```bash
psql -U postgres -c "CREATE DATABASE tahadhari_db;"
psql -U postgres -d tahadhari_db -c "CREATE EXTENSION IF NOT EXISTS postgis;"
psql -U postgres -d tahadhari_db -c 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
```

PostGIS provides the polygon geometry type used by grid cells. `uuid-ossp` provides
`uuid_generate_v4()`, the default for every primary key.

Run migrations and seed development data:

```bash
alembic upgrade head
python seed_data.py
```

## 6. Set Up the Next.js Dashboard

```bash
cd Compil-HER_Dashboard
npm install
```

Create `.env.local` in the dashboard root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

This variable specifies the FastAPI backend URL used by the Next.js dashboard.

## 7. Run the Application

Start the FastAPI backend:

```bash
cd Compil-HER_Backend/backend
source venv/bin/activate

uvicorn app.main:app --reload --port 8000
```

In a second terminal, start the Next.js dashboard:

```bash
cd Compil-HER_Dashboard
npm run dev
```

## 8. Verify the Setup

Open:

- **FastAPI documentation:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **TAHADHARI application:** [http://localhost:3000](http://localhost:3000)

The setup is working when the API documentation loads and the TAHADHARI application is accessible.

Log in with the `ADMIN_EMAIL` and `ADMIN_PASSWORD` values from your `.env` file.