# 🚀 Collaborative Task Manager — Frontend

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Real-Time Features](#-real-time-features)
- [API Expectations](#-api-expectations)
- [Design Decisions](#-design-decisions)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [License](#-license)
- [Author](#-author)

## ✨ Features
- Mobile-first React 19 dashboard that highlights assigned, created, and overdue tasks
- Filtering and sorting by status, priority, due date, and assignee
- Google OAuth + JWT auth flow handled with HttpOnly cookies
- Real-time task updates powered by Socket.io paired with React Query
- Type-safe forms via React Hook Form + Zod with shared DTOs
- Tailwind CSS for styling with PostCSS/autoprefixer tooling

## 🛠 Tech Stack
- **React 19 + TypeScript** for the SPA foundation
- **Vite** for fast builds
- **Tailwind CSS + PostCSS + Autoprefixer** for utility-first styling
- **React Query (@tanstack/react-query)** for server state caching & mutations
- **React Hook Form + Zod** for form validation
- **React Router v7** for routing
- **Socket.io Client** to mirror backend real-time events
- **Axios** for HTTP requests
- **@react-oauth/google** for Google Sign-In flows
- **TypeScript**, **tsconfig** + **Vite plugins** for typing/build tooling

## 🏗 Architecture

```
frontend/src/
├── api/         # Axios clients, auth helpers, interceptors
├── assets/      # Icons, SVGs, fonts, and static media
├── components/  # Shared UI primitives (Cards, Modals, Badges)
├── config/      # Environment constants and timers
├── features/    # Feature slices (auth, tasks, notifications, settings)
├── hooks/       # Custom hooks (React Query, realtime, forms)
├── pages/       # Route-level screens (Dashboard, TaskDetails, Profile)
├── providers/   # Context providers (AuthProvider, SocketProvider)
├── styles/      # Global Tailwind layers and CSS utilities
├── utils/       # Date formatting, sorting, helpers
├── App.tsx
├── main.tsx
└── router.tsx
```

Feature folders orchestrate API calls, React Query hooks, and UI states, while providers expose reusable auth/socket state to all pages and components.

## 📦 Prerequisites
- Node.js 20+
- npm 10+
- Backend running at `http://localhost:5000`

## 🚀 Installation & Setup

```bash
# from repo root
cd frontend
npm install
```

Create `.env`:

```
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

Start dev server:

```bash
npm run dev
```

Build & preview:

```bash
npm run build
npm run preview
```

## ⚡ Real-Time Features

`frontend/src/hooks/useTaskRealtime.ts` pairs Socket.io with React Query:

```typescript
export function useTaskRealtime(mutate: () => void) {
  const { socket } = useSocket();

  useEffect(() => {
    socket.on('task-created', () => mutate());
    socket.on('task-updated', () => mutate());
    socket.on('task-deleted', () => mutate());

    return () => {
      socket.off('task-created');
      socket.off('task-updated');
      socket.off('task-deleted');
    };
  }, [socket, mutate]);
}
```

The socket connection is authenticated via the JWT cookie the backend sets. Clients join `user:${userId}` rooms so targeted events (e.g. `task-assigned`) reach the right person.

## 📡 API Expectations
- All requests target `VITE_API_URL`.
- JWT is stored in HttpOnly cookies; browsers send it automatically.
- Key endpoints:
  - `/auth/register`, `/auth/login`, `/auth/logout`
  - `/tasks` (supports `status`, `priority`, `sortBy`, `sortOrder` queries)
  - `/tasks/dashboard`, `/tasks/my/assigned`, `/tasks/my/created`, `/tasks/overdue`
  - `/users/profile`
- React Query mutations invalidate or refetch the task cache once actions succeed.

## 💡 Design Decisions
1. **React Query + Socket.io** keeps UI responsive while syncing with backend events without manual polling.
2. **Provider-driven auth/socket context** ensures a single authenticated socket across the app.
3. **React Hook Form + Zod** mirror backend DTOs, so validation stays consistent end-to-end.
4. **Tailwind + PostCSS tooling** delivers utility-first styling that compiles fast with Vite.
5. **Axios + custom API layer** keeps auth headers, error handling, and retries centralized.

## 🧪 Testing
- Manual QA with `npm run dev` and browser testing.
- Type checking via `npm run typecheck` (add script if missing).

## 🚀 Deployment
1. Set `VITE_API_URL` to the production backend (e.g., `https://api.example.com/api/v1`).
2. Run `npm run build`.
3. Deploy the `dist/` directory to Vercel, Netlify, or a static host.

## 📄 License
ISC

## 👤 Author
**Krishna Mohan** · https://github.com/VKM112
