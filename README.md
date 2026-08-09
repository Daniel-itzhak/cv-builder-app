# CV Builder App

Personal CV creation and management platform, structured for a future multi-tenant SaaS transition.

## Stack

| Layer      | Tech                                      |
| ---------- | ----------------------------------------- |
| Frontend   | Next.js (App Router), TypeScript, Tailwind, shadcn/ui |
| Backend    | Node.js, Express, TypeScript, ts-node-dev |
| Database   | PostgreSQL (Docker) + Prisma ORM          |
| Auth       | JWT (migratable to Auth0/Clerk later)     |

## Project structure

```
cv-builder-app/
├── backend/              # Express API
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       ├── services/
│       ├── types/
│       ├── utils/
│       ├── app.ts
│       └── server.ts
├── frontend/             # Next.js web app
│   └── src/
│       ├── app/
│       ├── components/
│       ├── hooks/
│       └── lib/
├── docker-compose.yml
└── README.md
```

## Prerequisites

- Node.js **20+** (recommended via nvm — this machine's default may be older). The repo pins the version via `.nvmrc` files (root, `backend`, `frontend`), so `nvm use` (no version argument needed) always picks the right one.
- npm 10+
- Docker Desktop running (for PostgreSQL)

## Exact setup commands

Run these from the repo root (`cv_app`):

```bash
# Use a modern Node (required for Next.js 16) — picks up ./.nvmrc automatically
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"

cd cv-builder-app
nvm use

# 1) PostgreSQL
# Start Docker Desktop first if the daemon is not running
docker compose up -d

# 2) Backend
cd backend
nvm use   # picks up backend/.nvmrc
cp .env.example .env   # skip if .env already exists
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

In a second terminal:

```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"

cd cv-builder-app/frontend
nvm use   # picks up frontend/.nvmrc
cp .env.example .env.local   # skip if .env.local already exists
npm install
# Optional: add more shadcn components later
# npx shadcn@latest add button input card
npm run dev
```

> Tip: if your shell doesn't already have nvm loaded automatically, add `[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"` to your `~/.zshrc` (most nvm installers do this for you), then just run `nvm use` in any of the three project folders.

- Frontend: `http://localhost:3000`
- API: `http://localhost:4000`
- Health: `http://localhost:4000/api/health`

## Running everything together

Once both `backend` and `frontend` have their dependencies installed (and `.env`/`.env.local` are set up per the steps above), you can run everything from the repo root with a single command:

```bash
# One-time: install root tooling (concurrently)
npm install

# Start Postgres, then run backend + frontend together
npm run db:up
npm run dev
```

Other root scripts:

| Script                | Description                                   |
| ---------------------- | ---------------------------------------------- |
| `npm run dev`          | Runs backend + frontend dev servers together  |
| `npm run dev:backend`  | Runs only the backend dev server              |
| `npm run dev:frontend` | Runs only the frontend dev server             |
| `npm run db:up`        | Starts the Postgres container (Docker)        |
| `npm run db:down`      | Stops the Postgres container                  |
| `npm run install:all`  | Installs deps in both `backend` and `frontend`|
| `npm run build`        | Builds both backend and frontend              |

## Debugging in VS Code

The repo includes `.vscode/launch.json` with ready-to-use debug configurations (Run and Debug panel, or `F5`):

- **Backend: Debug (Express)** — runs `nvm use && npm run dev` in `backend` with the debugger attached.
- **Frontend: Debug server-side (Next.js)** — runs `nvm use && npm run dev` in `frontend` with the debugger attached to server-side code.
- **Frontend: Debug client-side (Chrome)** — attaches Chrome dev tools to `http://localhost:3000`.
- **Frontend: Debug full stack (Next.js)** — debugs both server and client code, opening Chrome automatically.
- **Full Stack: Backend + Frontend** (compound) — launches the backend and full-stack frontend configs together, so you can hit breakpoints on both sides in one session.
- **Run: Both together (single terminal)** — runs the root `npm run dev` (backend + frontend via `concurrently`) in one terminal, still using the right Node version.

Every config runs `nvm use` first, so debugging always uses the Node version pinned in the nearest `.nvmrc` (v20) — even if your shell's default nvm alias is older. This requires nvm to already be loaded in your shell profile (see the tip above); no extra VS Code extension is needed.

A `.vscode/settings.json` is also included with a distinct color theme (title bar / activity bar / status bar) so this window is easy to pick out when you have multiple VS Code windows open.


## Auth endpoints

| Method | Path                 | Auth | Description        |
| ------ | -------------------- | ---- | ------------------ |
| POST   | `/api/auth/register` | No   | Create an account  |
| POST   | `/api/auth/login`    | No   | Login, receive JWT |
| GET    | `/api/users/me`      | JWT  | Get current user profile |
| PATCH  | `/api/users/me`      | JWT  | Update profile details |
| GET    | `/api/formats`       | JWT  | List active templates |
| GET    | `/api/formats/:id`   | JWT  | Get a template     |
| GET    | `/api/cvs`           | JWT  | List current user's CVs |
| POST   | `/api/cvs`           | JWT  | Create a CV from a template |
| GET    | `/api/cvs/:id`       | JWT  | Get a CV (with content) |
| PATCH  | `/api/cvs/:id`       | JWT  | Update title / content |
| DELETE | `/api/cvs/:id`       | JWT  | Delete a CV        |

## Environment

### Backend (`backend/.env`)

```env
DATABASE_URL="postgresql://cv_user:cv_password@localhost:5432/cv_builder?schema=public"
JWT_SECRET="change-me-in-production"
JWT_EXPIRES_IN="7d"
PORT=4000
CORS_ORIGIN="http://localhost:3000"
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

## Phase roadmap

1. **Phase 1** — Scaffold, auth, CV stubs, landing + dashboard shell
2. **Phase 2 (current)** — CV editor, templates, live preview, JSONB content CRUD
3. **Phase 3** — Multi-tenant orgs, billing, Auth0/Clerk migration
