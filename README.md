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

The backend of the AI Resume Builder project is built using Node.js and Express, and it follows a clean MVC architecture. All core backend source files are located inside the /server/src directory, and the structure is organized so that configuration, routes, controllers, and models are clearly separated, making the system modular and easy to maintain.

The configuration logic is contained in the config folder. The env.js file loads environment variables using the dotenv package and makes important settings—such as database credentials—available throughout the server. The database.js file is responsible for connecting the application to MongoDB Atlas through Mongoose, ensuring a stable and secure database connection.

The main logic of the backend is implemented inside the controllers folder. The authController.js file manages all authentication-related features, including user registration, login, password verification, and JWT token generation. Additional controllers, such as resumeController.js or userController.js, can be added to handle features like resume processing or user profile management as the project expands.

Data models are stored inside the models directory. The User.js model defines how user information is structured and saved in MongoDB. Passwords are securely hashed using bcrypt before being stored in the database. If new features are introduced later, such as resume analysis data, additional models like Resume.js can easily be added.

All API endpoints are defined inside the routes folder. The authRoutes.js file handles routes related to user authentication, forwarding requests to the appropriate controller functions. Additional routes—for example, user routes or resume routes—can be created to manage different parts of the application while keeping the structure clean and maintainable.

Security is handled through the middleware layer. The authMiddleware.js file verifies JWT tokens and ensures that only authenticated users can access protected API routes. This middleware plays an important role in protecting sensitive endpoints and user data.

The entry point of the backend is the server.js file. It initializes environment variables, connects to MongoDB, sets up the Express application, registers all routes, and starts the server. This file ties the entire backend together and ensures that all components work smoothly as one system.

The backend uses several key technologies, including Node.js, Express, MongoDB Atlas, Mongoose, JWT, bcrypt, and dotenv. All major API endpoints—such as signup, login, and user profile retrieval—were tested thoroughly using Thunder Client and Postman to ensure they function correctly and reliably.

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

Environment variables live in `client/.env` if you need to set `VITE_API_BASE_URL` (defaults to `/api`) and optional `VITE_DEV_API_PROXY` for local API forwarding.

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
