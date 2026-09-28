# Priority To-Do

A to-do list with priorities and a "Rank my tasks" mode that re-orders your list from quick
"which matters more?" matchups. Frontend only: data lives in your browser's localStorage.

Built with Vite, React 18, TypeScript and Tailwind CSS. See [AGENTS.md](./AGENTS.md) for the full spec.

## Run locally

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build into dist/
npm run preview   # serve the production build
```

## Deploy on Vercel

Import the repo in Vercel, set **Root Directory** to `task1-priority-todo`, and keep the detected
Vite preset (build `npm run build`, output `dist`).

## Docker (optional)

```bash
docker build -t priority-todo .
docker run -p 8080:80 priority-todo   # http://localhost:8080
```
