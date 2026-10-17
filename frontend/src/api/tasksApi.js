import { addDaysISO } from '../utils.js';

/**
 * API layer. This is the ONLY file that knows how tasks are fetched/saved.
 *
 *  VITE_USE_MOCK=true  -> tasks live in the browser's localStorage (no backend needed)
 *  VITE_USE_MOCK=false -> real REST calls to the Express backend
 *
 * Expected backend contract (share this with the backend teammate):
 *   GET    /api/tasks              -> [ task, ... ]
 *   POST   /api/tasks              -> task            body: { title, description, status, priority, due_date }
 *   PUT    /api/tasks/:id          -> task            body: same as POST
 *   PATCH  /api/tasks/:id/status   -> task            body: { status }
 *   DELETE /api/tasks/:id          -> 204 (or any 2xx)
 *
 *   task = { id, title, description, status, priority, due_date, created_at }
 *   status   : 'todo' | 'in_progress' | 'done'
 *   priority : 'low' | 'medium' | 'high'
 *   due_date : 'YYYY-MM-DD' or null
 */

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

/* ---------- shape helpers (backend snake_case <-> frontend camelCase) ---------- */

function normalize(t) {
  const due = t.dueDate ?? t.due_date ?? '';
  return {
    id: t.id,
    title: t.title ?? '',
    description: t.description ?? '',
    status: t.status ?? 'todo',
    priority: t.priority ?? 'medium',
    dueDate: due ? String(due).slice(0, 10) : '',
    createdAt: t.createdAt ?? t.created_at ?? new Date().toISOString(),
  };
}

function toPayload(data) {
  return {
    title: data.title,
    description: data.description,
    status: data.status,
    priority: data.priority,
    due_date: data.dueDate || null,
  };
}

const unwrapOne = (d) => normalize(d?.task ?? d?.data ?? d);
const unwrapMany = (d) => (Array.isArray(d) ? d : d?.tasks ?? d?.data ?? []).map(normalize);

/* ---------- real backend ---------- */

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new Error('Cannot reach the server. Is the backend running?');
  }
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      message = body.message || body.error || message;
    } catch {
      /* response had no JSON body */
    }
    throw new Error(message);
  }
  return res.status === 204 ? null : res.json().catch(() => null);
}

const realApi = {
  fetchTasks: async () => unwrapMany(await request('/tasks')),
  createTask: async (data) =>
    unwrapOne(await request('/tasks', { method: 'POST', body: JSON.stringify(toPayload(data)) })),
  updateTask: async (id, data) =>
    unwrapOne(await request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(toPayload(data)) })),
  updateTaskStatus: async (id, status) =>
    unwrapOne(await request(`/tasks/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })),
  deleteTask: async (id) => {
    await request(`/tasks/${id}`, { method: 'DELETE' });
  },
};

/* ---------- mock backend (localStorage) ---------- */

const KEY = 'taskflow.tasks.v1';
const wait = (ms = 250) => new Promise((r) => setTimeout(r, ms));

function seed() {
  const now = Date.now();
  return [
    { id: 's1', title: 'Design the dashboard layout', description: 'Stats bar, filters and card grid.', status: 'done', priority: 'high', dueDate: addDaysISO(-2), createdAt: new Date(now - 5 * 864e5).toISOString() },
    { id: 's2', title: 'Build the Add Task form', description: 'Title, description, priority, status and due date with validation.', status: 'in_progress', priority: 'high', dueDate: addDaysISO(1), createdAt: new Date(now - 3 * 864e5).toISOString() },
    { id: 's3', title: 'Connect frontend to the API', description: 'Switch VITE_USE_MOCK to false once the backend is up.', status: 'todo', priority: 'medium', dueDate: addDaysISO(5), createdAt: new Date(now - 2 * 864e5).toISOString() },
    { id: 's4', title: 'Write the README', description: '', status: 'todo', priority: 'low', dueDate: '', createdAt: new Date(now - 864e5).toISOString() },
    { id: 's5', title: 'Fix overdue sample task', description: 'This one shows the overdue style.', status: 'todo', priority: 'medium', dueDate: addDaysISO(-1), createdAt: new Date(now).toISOString() },
  ];
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  const initial = seed();
  save(initial);
  return initial;
}

function save(tasks) {
  try {
    localStorage.setItem(KEY, JSON.stringify(tasks));
  } catch {
    /* storage unavailable: data just won't persist */
  }
}

const newId = () => `m${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

const mockApi = {
  async fetchTasks() {
    await wait();
    return load().map(normalize);
  },
  async createTask(data) {
    await wait();
    const task = normalize({ ...data, id: newId(), createdAt: new Date().toISOString() });
    save([task, ...load()]);
    return task;
  },
  async updateTask(id, data) {
    await wait();
    const tasks = load();
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error('Task not found');
    tasks[idx] = normalize({ ...tasks[idx], ...data });
    save(tasks);
    return tasks[idx];
  },
  async updateTaskStatus(id, status) {
    await wait(120);
    const tasks = load();
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error('Task not found');
    tasks[idx] = { ...tasks[idx], status };
    save(tasks);
    return normalize(tasks[idx]);
  },
  async deleteTask(id) {
    await wait();
    save(load().filter((t) => t.id !== id));
  },
};

const api = USE_MOCK ? mockApi : realApi;

export const isMockMode = USE_MOCK;
export const { fetchTasks, createTask, updateTask, updateTaskStatus, deleteTask } = api;
