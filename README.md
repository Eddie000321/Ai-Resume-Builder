# Resume Match Studio (MERN + AI)

This repo is a JavaScript-only implementation of the ATS résumé matching concept we discussed: a Vite/React front-end that talks to an Express/Mongo API with PDF parsing, embedding, scoring, and LLM suggestion hooks.

## Project structure

```
client/  # React (Vite) app with React Query, Tailwind and the landing/auth/dashboard flows
server/  # Express API (ESM) with Mongo/Mongoose models, PDF upload, scoring, and suggestion services
```

## Getting started

### 1. Requirements

- Node.js 18+
- MongoDB connection string (local or Atlas)

### 2. Backend (`server/`)

```bash
cd server
cp .env.example .env   # fill in Mongo URI + JWT secrets
npm install
npm run dev            # nodemon watches src/**/*.js
```

The API expects:

- `POST /api/auth/signup|login|logout|me`
- `POST /api/resumes` (multipart PDF upload, GridFS storage)
- `POST /api/jobs` + `POST /api/matches` orchestrating embeddings, scoring, suggestions

### 3. Frontend (`client/`)

```bash
cd client
npm install
npm run dev            # launches Vite dev server
```

Pages already wired:

- `/` – landing page with résumé dropzone that caches the PDF before auth
- `/auth` – login/signup with automatic resume upload once authenticated
- `/app` – protected dashboard showing resume status, job modal, and match cards

Environment variables live in `client/.env` if you need to override `VITE_API_URL` (defaults to `/api` for the proxy setup).

## Next steps

- Hook up real embedding/LLM providers by filling the placeholders in `server/src/services/embed.service.js` and `suggest.service.js`.
- Add BullMQ/Redis if you want asynchronous match processing.
- Extend the React dashboard with resume/job management tables and live progress indicators.

## File guide

### Server (`server/src`)

- `server.js` – boots the API by loading env vars, connecting Mongo, and starting Express.
- `app.js` – Express app wiring: CORS, rate limiting, cookie parser, `/api` routes, and the global error handler.
- `config/env.js` – dotenv load + Zod validation for all required environment variables.
- `lib/logger.js` / `lib/mongo.js` – Pino logger config and MongoDB connection helper.
- `middleware/auth.js` / `middleware/error.js` – cookie-based session deserialization + auth guard, and a centralized error responder.
- `utils/asyncHandler.js` / `utils/cookies.js` / `utils/token.js` – async wrapper, HTTP-only cookie helpers, and JWT signer utilities.
- `models/*.js` – Mongoose schemas for `User`, `Resume`, `Job`, and `Match` documents.
- `controllers/auth|resume|job|match.controller.js` – REST handlers for auth, resume upload/list, job creation, and match orchestration (embedding, scoring, suggestions).
- `routes/*.routes.js` – Route modules that map HTTP paths to the corresponding controllers.
- `services/pdf|storage|embed|score|suggest.service.js` – PDF text extraction, GridFS storage, embedding cache/API wrapper, scoring heuristics, and LLM/fallback suggestion generator.

### Client (`client/src`)

- `main.jsx` – React entry point that mounts `<App />` with global styles.
- `App.jsx` – Sets up React Router and query/resume context providers for `/`, `/auth`, `/app`.
- `lib/api.js` / `lib/auth.js` / `lib/queryClient.js` – Axios instance (with credentials), auth API helpers, and shared React Query client.
- `context/ResumeDraftContext.jsx` – Stores the dropped résumé file so it survives the auth redirect.
- `hooks/useAuth.js` – React Query hook that calls `/auth/me` to guard protected routes.
- `components/FileDrop.jsx`, `ProtectedRoute.jsx`, `ScoreGauge.jsx` – Shared UI pieces (dropzone, auth gate, scoring gauge).
- `features/resume/ResumeDropzone.jsx`, `features/job/JobModal.jsx`, `features/match/MatchCards.jsx` – Feature-specific UI for resume drop, job input/match creation, and match score cards.
- `pages/Landing.jsx`, `pages/Auth.jsx`, `pages/Dashboard.jsx` – High-level screens implementing the landing funnel, login/signup flow, and protected dashboard.
