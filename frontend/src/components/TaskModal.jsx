import { useEffect, useRef, useState } from 'react';
import { PRIORITIES, STATUSES } from '../constants.js';
import { CloseIcon } from './icons.jsx';

const field =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200';

/** Used for both "Add Task" (task = null) and "Edit Task" (task = existing task). */
export default function TaskModal({ task, onClose, onSubmit }) {
  const editing = Boolean(task);
  const [form, setForm] = useState({
    title: task?.title ?? '',
    description: task?.description ?? '',
    status: task?.status ?? 'todo',
    priority: task?.priority ?? 'medium',
    dueDate: task?.dueDate ?? '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const titleRef = useRef(null);

  useEffect(() => {
    titleRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && !saving && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, saving]);

  const set = (name) => (e) => {
    setForm((f) => ({ ...f, [name]: e.target.value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const validate = () => {
    const er = {};
    const title = form.title.trim();
    if (!title) er.title = 'Title is required';
    else if (title.length > 100) er.title = 'Title must be 100 characters or fewer';
    if (form.description.length > 500) er.description = 'Description must be 500 characters or fewer';
    return er;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length) return;
    setSaving(true);
    setSubmitError('');
    try {
      await onSubmit({ ...form, title: form.title.trim(), description: form.description.trim() });
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong');
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && !saving && onClose()}
    >
      <form
        onSubmit={handleSubmit}
        noValidate
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
        className="animate-pop-in max-h-full w-full overflow-y-auto rounded-t-2xl bg-white shadow-xl sm:max-w-lg sm:rounded-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 id="task-modal-title" className="text-lg font-semibold text-slate-900">
            {editing ? 'Edit task' : 'Add a new task'}
          </h2>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <CloseIcon />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div>
            <label htmlFor="title" className="mb-1 block text-sm font-medium text-slate-700">
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="title"
              ref={titleRef}
              value={form.title}
              onChange={set('title')}
              placeholder="e.g. Build the login page"
              aria-invalid={Boolean(errors.title)}
              className={`${field} ${errors.title ? 'border-rose-400' : ''}`}
            />
            {errors.title && <p className="mt-1 text-xs text-rose-600">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="description" className="mb-1 block text-sm font-medium text-slate-700">Description</label>
            <textarea
              id="description"
              rows={3}
              value={form.description}
              onChange={set('description')}
              placeholder="Optional details…"
              className={`${field} resize-none ${errors.description ? 'border-rose-400' : ''}`}
            />
            {errors.description && <p className="mt-1 text-xs text-rose-600">{errors.description}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="priority" className="mb-1 block text-sm font-medium text-slate-700">Priority</label>
              <select id="priority" value={form.priority} onChange={set('priority')} className={field}>
                {PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="status" className="mb-1 block text-sm font-medium text-slate-700">Status</label>
              <select id="status" value={form.status} onChange={set('status')} className={field}>
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="dueDate" className="mb-1 block text-sm font-medium text-slate-700">Due date</label>
            <input id="dueDate" type="date" value={form.dueDate} onChange={set('dueDate')} className={field} />
          </div>

          {submitError && (
            <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{submitError}</p>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3 sm:rounded-b-2xl">
          <button type="button" onClick={onClose} disabled={saving} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 disabled:opacity-50">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60">
            {saving ? 'Saving…' : editing ? 'Save changes' : 'Add task'}
          </button>
        </div>
      </form>
    </div>
  );
}
