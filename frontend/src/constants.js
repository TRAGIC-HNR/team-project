// NOTE: class names are written out in full so Tailwind can detect them.
export const STATUSES = [
  { value: 'todo', label: 'To Do', dot: 'bg-slate-400', badge: 'bg-slate-100 text-slate-700 ring-slate-200' },
  { value: 'in_progress', label: 'In Progress', dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700 ring-amber-200' },
  { value: 'done', label: 'Done', dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
];

export const PRIORITIES = [
  { value: 'low', label: 'Low', rank: 1, badge: 'bg-sky-50 text-sky-700 ring-sky-200', bar: 'bg-sky-400' },
  { value: 'medium', label: 'Medium', rank: 2, badge: 'bg-violet-50 text-violet-700 ring-violet-200', bar: 'bg-violet-400' },
  { value: 'high', label: 'High', rank: 3, badge: 'bg-rose-50 text-rose-700 ring-rose-200', bar: 'bg-rose-500' },
];

export const getStatus = (value) => STATUSES.find((s) => s.value === value) ?? STATUSES[0];
export const getPriority = (value) => PRIORITIES.find((p) => p.value === value) ?? PRIORITIES[1];
