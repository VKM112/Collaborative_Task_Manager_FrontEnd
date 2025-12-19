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

## ✨ Features
- Mobile-first React 19 interface with Tailwind CSS
- Rich task management UI featuring filters for status, priority, due date, and sorting
- Personalized dashboards for created, assigned, and overdue tasks
- JWT authentication flow with HttpOnly cookies managed by the backend
- Live updates via Socket.io + SWR cache invalidation
- Framer Motion and Lucide React for engaging UI interactions

## 🛠 Tech Stack
- React 19 + TypeScript
- Vite for fast dev/build cycles
- Tailwind CSS with custom animation utilities
- SWR for data fetching & caching
- React Hook Form + Zod for typed form handling
- React Router v7 for routing
- Socket.io client for real-time sync
- Framer Motion for transitions
- Lucide React icons

## 🏗 Architecture

```
frontend/src/
├── components/  # Shared UI pieces (modals, cards, badges)
├── contexts/    # Auth, socket, and theme providers
├── hooks/       # Custom hooks (API client, realtime, notifications)
├── lib/         # API wrapper, fetcher, and utilities
├── pages/       # Route-level screens (Dashboard, Tasks, Profile)
├── types/       # Shared type definitions
├── utils/       # Helpers (date formatting, sort helpers)
└── styles/      # Tailwind config & custom CSS (if needed)
```

Pages compose reusable components, contexts provide global state (auth/socket), and hooks encapsulate the real-time + SWR logic so UI stays declarative.

## 📦 Prerequisites
- Node.js 20+
- Backend API running (`http://localhost:5000`)
- npm 10+

## 🚀 Installation & Setup

```bash
# from repo root
cd frontend
npm install
```

Create a `.env` with:

```
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

Start the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## ⚡ Real-Time Features
`frontend/src/hooks/useTaskRealtime.ts` pairs Socket.io with SWR:

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

Socket connection is authenticated via the JWT stored in HttpOnly cookies, and the backend handles room membership (`user:${userId}`) to target personal notifications.

## 📡 API Expectations
- All calls expect the backend base path defined by `VITE_API_URL`.
- API uses JWT stored in cookies, so the browser automatically attaches credentials.
- Key endpoints:
  - `/auth/register`, `/auth/login`, `/auth/logout`
  - `/tasks` for CRUD + query params (`status`, `priority`, `sortBy`, `sortOrder`)
  - `/tasks/dashboard`, `/tasks/my/assigned`, `/tasks/my/created`, `/tasks/overdue`
  - `/users/profile`

## 💡 Design Decisions
1. **React + SWR**: keeps UI declarative while caching responses; works seamlessly with mutations triggered by Socket.io events.
2. **Socket.io client via context**: central `SocketProvider` ensures a single connection per session + reconnect logic.
3. **Tailwind + Framer Motion**: responsive, consistent design system with subtle motion for feedback.
4. **React Hook Form + Zod**: type-safe validation ensures backend + frontend agree on payload shapes.
5. **Lucide Icons**: lightweight, modern iconography that pairs well with tailwind utilities.

## 🧪 Testing
- Manual QA via `npm run dev` + browser testing.
- Optionally run TypeScript checks: `npm run typecheck`.

## 🚀 Deployment
1. Set `VITE_API_URL` to the production backend (e.g., `https://api.example.com/api/v1`).
2. Build the app: `npm run build`.
3. Host the `dist/` folder on Vercel, Netlify, or any static host.

## 📄 License
ISC

## 👤 Author
**Krishna Mohan** · https://github.com/VKM112
