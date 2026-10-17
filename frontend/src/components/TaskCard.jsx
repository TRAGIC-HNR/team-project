import { STATUSES, getPriority, getStatus } from '../constants.js';
import { formatDate, isOverdue } from '../utils.js';
import { CalendarIcon, CheckIcon, EditIcon, TrashIcon } from './icons.jsx';

const iconBtn =
  'rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500';

export default function TaskCard({ task, view, onEdit, onDelete, onStatusChange }) {
  const status = getStatus(task.status);
  const priority = getPriority(task.priority);
  const done = task.status === 'done';
  const overdue = isOverdue(task);
  const isList = view === 'list';

  return (
    <article
      className={`group relative overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md ${
        overdue ? 'border-rose-200' : 'border-slate-200'
      } ${isList ? 'flex items-center gap-4 p-3 pl-5' : 'flex flex-col gap-3 p-4 pl-5'}`}
    >
      <span className={`absolute inset-y-0 left-0 w-1.5 ${priority.bar}`} aria-hidden="true" />

      <div className={`flex min-w-0 flex-1 items-start gap-3 ${isList ? 'items-center' : ''}`}>
        <button
          onClick={() => onStatusChange(task.id, done ? 'todo' : 'done')}
          aria-label={done ? 'Mark as not done' : 'Mark as done'}
          title={done ? 'Mark as not done' : 'Mark as done'}
          className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
            done ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 text-transparent hover:border-emerald-400 hover:text-emerald-400'
          }`}
        >
          <CheckIcon width={14} height={14} strokeWidth={3.5} />
        </button>

        <div className="min-w-0 flex-1">
          <h3 className={`truncate text-[15px] font-semibold ${done ? 'text-slate-400 line-through' : 'text-slate-900'}`} title={task.title}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`mt-1 text-sm text-slate-500 ${isList ? 'truncate' : 'line-clamp-3'}`}>{task.description}</p>
          )}
        </div>
      </div>

      <div className={`flex flex-wrap items-center gap-2 ${isList ? 'shrink-0' : ''}`}>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${priority.badge}`}>{priority.label}</span>
        {task.dueDate && (
          <span
            className={`inline-flex items-center gap-1 text-xs ${overdue ? 'font-semibold text-rose-600' : 'text-slate-500'}`}
            title={overdue ? 'Overdue' : 'Due date'}
          >
            <CalendarIcon width={13} height={13} />
            {formatDate(task.dueDate)}
            {overdue && ' · Overdue'}
          </span>
        )}
      </div>

      <div className={`flex items-center gap-1 ${isList ? 'shrink-0' : 'justify-between border-t border-slate-100 pt-3'}`}>
        <label className="flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${status.dot}`} aria-hidden="true" />
          <span className="sr-only">Status</span>
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
            className="rounded-md border border-transparent bg-transparent py-1 pr-1 text-xs font-medium text-slate-600 hover:border-slate-200 focus:border-indigo-500 focus:outline-none"
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </label>
        <div className="flex items-center">
          <button onClick={() => onEdit(task)} aria-label={`Edit ${task.title}`} title="Edit" className={`${iconBtn} hover:text-indigo-600`}>
            <EditIcon width={16} height={16} />
          </button>
          <button onClick={() => onDelete(task)} aria-label={`Delete ${task.title}`} title="Delete" className={`${iconBtn} hover:text-rose-600`}>
            <TrashIcon width={16} height={16} />
          </button>
        </div>
      </div>
    </article>
  );
}
