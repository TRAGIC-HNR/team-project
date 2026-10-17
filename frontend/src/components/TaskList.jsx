import TaskCard from './TaskCard.jsx';
import { InboxIcon, PlusIcon } from './icons.jsx';

function Skeleton({ view }) {
  return (
    <div className={view === 'grid' ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-3'}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-32 animate-pulse rounded-xl border border-slate-200 bg-white p-4">
          <div className="h-4 w-2/3 rounded bg-slate-200" />
          <div className="mt-3 h-3 w-full rounded bg-slate-100" />
          <div className="mt-2 h-3 w-1/2 rounded bg-slate-100" />
        </div>
      ))}
    </div>
  );
}

export default function TaskList({ tasks, totalCount, loading, error, view, onRetry, onNewTask, onClearFilters, ...handlers }) {
  if (loading) return <Skeleton view={view} />;

  if (error) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-8 text-center">
        <p className="font-semibold text-rose-800">Couldn't load your tasks</p>
        <p className="mt-1 text-sm text-rose-700">{error}</p>
        <button onClick={onRetry} className="mt-4 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700">
          Try again
        </button>
      </div>
    );
  }

  if (tasks.length === 0) {
    const noTasksAtAll = totalCount === 0;
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <InboxIcon width={40} height={40} className="mx-auto text-slate-300" />
        <p className="mt-3 font-semibold text-slate-800">{noTasksAtAll ? 'No tasks yet' : 'No tasks match your filters'}</p>
        <p className="mt-1 text-sm text-slate-500">
          {noTasksAtAll ? 'Create your first task to get started.' : 'Try a different search or clear the filters.'}
        </p>
        <button
          onClick={noTasksAtAll ? onNewTask : onClearFilters}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          {noTasksAtAll && <PlusIcon width={16} height={16} />}
          {noTasksAtAll ? 'Add a task' : 'Clear filters'}
        </button>
      </div>
    );
  }

  return (
    <div className={view === 'grid' ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-3'}>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} view={view} {...handlers} />
      ))}
    </div>
  );
}
