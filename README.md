# Connexa Frontend

This repository is a Vite + React frontend application.

## Active Architecture

- Active app source: `src/`
- Active scripts: root `package.json`
- Build tool: Vite
- Hosting: static frontend deployment (for example Azure Static Web Apps)

This project is not a backend monolith. API/backend services run in separate repositories (for example FastAPI services) and are called over HTTP.

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## About `client/` and `server/`

`client/` and `server/` are legacy scaffolding kept for reference only. They are not part of the active runtime path for this app.

- Do not use `client/` as the main source of truth.
- Do not use `server/index.js` as the backend API.
- Keep feature work in root `src/` and root Vite config/files.
