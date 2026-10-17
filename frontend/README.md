# TaskFlow – Frontend

React + Tailwind CSS (Vite) frontend for the TaskFlow task manager.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

It starts in **demo mode** (sample tasks saved in your browser) so you can work without the backend.

## Connect to the backend (after integration)

1. Open `.env` and set `VITE_USE_MOCK=false`.
2. Start the Express server (default `http://localhost:5000`; change `VITE_BACKEND_URL` if different).
3. Restart `npm run dev`. Requests to `/api/*` are proxied to the backend (no CORS setup needed in dev).

For production builds set `VITE_API_URL` to the full backend URL.

## API contract (share with the backend developer)

| Method | URL                        | Body                                                        | Returns |
|--------|----------------------------|-------------------------------------------------------------|---------|
| GET    | `/api/tasks`               | –                                                           | array of tasks |
| POST   | `/api/tasks`               | `{ title, description, status, priority, due_date }`        | created task |
| PUT    | `/api/tasks/:id`           | same as POST                                                | updated task |
| PATCH  | `/api/tasks/:id/status`    | `{ status }`                                                | updated task |
| DELETE | `/api/tasks/:id`           | –                                                           | 204 |

Task: `{ id, title, description, status, priority, due_date, created_at }`
- `status`: `todo` | `in_progress` | `done`
- `priority`: `low` | `medium` | `high`
- `due_date`: `"YYYY-MM-DD"` or `null`. Tip: with node-postgres a `DATE` column becomes a JS Date and can shift by a day across time zones; return it as text (`to_char(due_date, 'YYYY-MM-DD')`) or use `pg.types.setTypeParser(1082, v => v)`.
- Errors: respond with a non-2xx status and JSON `{ "message": "..." }`; the UI shows that message.

All API code is in `src/api/tasksApi.js` – if the backend shape differs, change only that file.

## Structure

```
src/
  api/tasksApi.js      mock + real API (one switch)
  hooks/useTasks.js    task state, add/edit/delete/status with optimistic update
  components/          Header, StatsBar, FilterBar, TaskList, TaskCard, TaskModal, ConfirmDialog, Toast
  constants.js         statuses & priorities
  App.jsx              page layout, filters, modals
```

## Features
Dashboard stats + progress bar · Add/Edit task form with validation · card and list views · status change (dropdown or tick circle) · delete with confirmation · search, status tabs, priority filter, sorting · loading, empty and error states · overdue highlighting · responsive.

## Git workflow (team)
```bash
git init && git add . && git commit -m "feat: TaskFlow frontend"
git branch -M main
git remote add origin <repo-url>
git checkout -b feature/frontend && git push -u origin feature/frontend
```
Then open a Pull Request into `main`.
