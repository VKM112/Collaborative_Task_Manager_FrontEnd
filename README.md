# Frontend README

## Overview
The frontend is a Vite + React single-page application that connects to the backend API, handles OAuth-based sign-in, renders collaborative task boards, and syncs updates over WebSockets.

## Tech Stack
- Vite (fast dev server & build)
- React 19 + React DOM
- React Router 7 for client-side routing
- React Query for server state caching
- Socket.IO client for live updates
- Axios for HTTP requests
- React Hook Form + Zod for typed form handling
- Tailwind CSS for utility-first styling
- `@react-oauth/google` for Google Sign-In flows

## Setup

### Prerequisites
- Node.js 18+
- Backend API running (see `../backend/README.md`)

### Install
```bash
cd frontend
npm install
```

### Environment
The frontend relies on two Vite environment variables. Create a `.env` file (or update the existing one) with:

```
VITE_API_URL=https://your-backend.example.com/api/v1
VITE_GOOGLE_CLIENT_ID=<your-Google-client-id>
```

`VITE_API_URL` should point to the running backend, and the client ID must match the one registered for OAuth.

### Development
```bash
npm run dev
```
This starts the Vite dev server (default `http://localhost:5173`) with hot module replacement.

### Building & Preview
- `npm run build` compiles the app for production (`dist/` folder).
- `npm run preview` serves the production build locally.

## Project layout
- `src/` contains React pages, hooks, and utility modules.
- `public/` holds static assets referenced directly (icons, fonts, etc.).
- `types/` declares shared TypeScript definitions used across the UI.
