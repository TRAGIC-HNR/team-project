import { PRIORITIES, STATUSES } from '../constants.js';
import { GridIcon, ListIcon, SearchIcon } from './icons.jsx';

const selectCls =
  'rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200';

export default function FilterBar({ filters, setFilters, counts, view, setView }) {
  const set = (patch) => setFilters((f) => ({ ...f, ...patch }));
  const tabs = [{ value: 'all', label: 'All' }, ...STATUSES];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Filter by status">
        {tabs.map((t) => {
          const active = filters.status === t.value;
          return (
            <button
              key={t.value}
              role="tab"
              aria-selected={active}
              onClick={() => set({ status: t.value })}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                active ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100'
              }`}
            >
              {t.label} <span className={active ? 'text-indigo-200' : 'text-slate-400'}>{counts[t.value] ?? 0}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={filters.search}
            onChange={(e) => set({ search: e.target.value })}
            placeholder="Search tasks…"
            aria-label="Search tasks"
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>
        <select aria-label="Filter by priority" value={filters.priority} onChange={(e) => set({ priority: e.target.value })} className={selectCls}>
          <option value="all">All priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p.value} value={p.value}>{p.label} priority</option>
          ))}
        </select>
        <select aria-label="Sort tasks" value={filters.sort} onChange={(e) => set({ sort: e.target.value })} className={selectCls}>
          <option value="newest">Newest first</option>
          <option value="due">Due date</option>
          <option value="priority">Priority</option>
          <option value="title">Title A–Z</option>
        </select>
        <div className="flex overflow-hidden rounded-lg border border-slate-300 bg-white" role="group" aria-label="Layout">
          {[
            { v: 'grid', Icon: GridIcon, label: 'Card view' },
            { v: 'list', Icon: ListIcon, label: 'List view' },
          ].map(({ v, Icon, label }) => (
            <button
              key={v}
              onClick={() => setView(v)}
              aria-label={label}
              aria-pressed={view === v}
              title={label}
              className={`px-3 py-2 transition ${view === v ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Icon />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
