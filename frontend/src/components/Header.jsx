import { CheckIcon, PlusIcon } from './icons.jsx';
import { isMockMode } from '../api/tasksApi.js';

export default function Header({ onNewTask }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white shadow-sm">
            <CheckIcon width={20} height={20} strokeWidth={3} />
          </span>
          <div className="leading-tight">
            <h1 className="text-lg font-bold tracking-tight text-slate-900">TaskFlow</h1>
            <p className="hidden text-xs text-slate-500 sm:block">Plan it. Track it. Finish it.</p>
          </div>
          {isMockMode && (
            <span
              className="ml-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800"
              title="Using sample data stored in your browser. Set VITE_USE_MOCK=false in .env to use the real backend."
            >
              Demo data
            </span>
          )}
        </div>
        <button
          onClick={onNewTask}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          <PlusIcon width={16} height={16} strokeWidth={2.5} />
          New Task
        </button>
      </div>
    </header>
  );
}
