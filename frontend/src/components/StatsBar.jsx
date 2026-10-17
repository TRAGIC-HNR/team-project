import { STATUSES } from '../constants.js';
import { isOverdue } from '../utils.js';

export default function StatsBar({ tasks }) {
  const total = tasks.length;
  const count = (s) => tasks.filter((t) => t.status === s).length;
  const done = count('done');
  const pct = total ? Math.round((done / total) * 100) : 0;
  const overdue = tasks.filter(isOverdue).length;

  const tiles = [
    { label: 'Total', value: total, dot: 'bg-indigo-500' },
    ...STATUSES.map((s) => ({ label: s.label, value: count(s.value), dot: s.dot })),
  ];

  return (
    <section aria-label="Task summary" className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className={`h-2 w-2 rounded-full ${t.dot}`} />
              {t.label}
            </div>
            <div className="mt-1 text-2xl font-bold text-slate-900">{t.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-slate-700">Overall progress</span>
          <span className="text-slate-500">
            {done}/{total} done · <span className="font-semibold text-slate-800">{pct}%</span>
            {overdue > 0 && <span className="ml-2 font-semibold text-rose-600">{overdue} overdue</span>}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </section>
  );
}
