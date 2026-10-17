import { useCallback, useMemo, useState } from 'react';
import useTasks from './hooks/useTasks.js';
import { getPriority } from './constants.js';
import Header from './components/Header.jsx';
import StatsBar from './components/StatsBar.jsx';
import FilterBar from './components/FilterBar.jsx';
import TaskList from './components/TaskList.jsx';
import TaskModal from './components/TaskModal.jsx';
import ConfirmDialog from './components/ConfirmDialog.jsx';
import Toast from './components/Toast.jsx';

const DEFAULT_FILTERS = { search: '', status: 'all', priority: 'all', sort: 'newest' };

export default function App() {
  const { tasks, loading, error, reload, addTask, editTask, changeStatus, removeTask } = useTasks();

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [view, setView] = useState('grid');
  const [modal, setModal] = useState({ open: false, task: null });
  const [toDelete, setToDelete] = useState(null);
  const [toast, setToast] = useState(null);
  const dismissToast = useCallback(() => setToast(null), []);

  const visible = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    const list = tasks.filter(
      (t) =>
        (filters.status === 'all' || t.status === filters.status) &&
        (filters.priority === 'all' || t.priority === filters.priority) &&
        (!q || t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)),
    );
    const by = {
      newest: (a, b) => String(b.createdAt).localeCompare(String(a.createdAt)),
      due: (a, b) => (a.dueDate || '9999').localeCompare(b.dueDate || '9999'),
      priority: (a, b) => getPriority(b.priority).rank - getPriority(a.priority).rank,
      title: (a, b) => a.title.localeCompare(b.title),
    };
    return [...list].sort(by[filters.sort]);
  }, [tasks, filters]);

  // Totals shown on the status tabs.
  const counts = useMemo(
    () => ({
      all: tasks.length,
      todo: tasks.filter((t) => t.status === 'todo').length,
      in_progress: tasks.filter((t) => t.status === 'in_progress').length,
      done: tasks.filter((t) => t.status === 'done').length,
    }),
    [tasks],
  );

  const handleSubmit = async (data) => {
    if (modal.task) {
      await editTask(modal.task.id, data);
      setToast({ type: 'success', message: 'Task updated' });
    } else {
      await addTask(data);
      setToast({ type: 'success', message: 'Task added' });
    }
    setModal({ open: false, task: null });
  };

  const handleStatus = async (id, status) => {
    try {
      await changeStatus(id, status);
    } catch (e) {
      setToast({ type: 'error', message: `Couldn't update status: ${e.message}` });
    }
  };

  const handleDelete = async () => {
    try {
      await removeTask(toDelete.id);
      setToast({ type: 'success', message: 'Task deleted' });
    } catch (e) {
      setToast({ type: 'error', message: `Couldn't delete task: ${e.message}` });
    } finally {
      setToDelete(null);
    }
  };

  return (
    <div className="min-h-screen">
      <Header onNewTask={() => setModal({ open: true, task: null })} />

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6">
        <StatsBar tasks={tasks} />
        <FilterBar filters={filters} setFilters={setFilters} counts={counts} view={view} setView={setView} />
        <TaskList
          tasks={visible}
          totalCount={tasks.length}
          loading={loading}
          error={error}
          view={view}
          onRetry={reload}
          onNewTask={() => setModal({ open: true, task: null })}
          onClearFilters={() => setFilters(DEFAULT_FILTERS)}
          onEdit={(task) => setModal({ open: true, task })}
          onDelete={setToDelete}
          onStatusChange={handleStatus}
        />
      </main>

      {modal.open && <TaskModal task={modal.task} onClose={() => setModal({ open: false, task: null })} onSubmit={handleSubmit} />}

      {toDelete && (
        <ConfirmDialog
          title="Delete this task?"
          message={`“${toDelete.title}” will be permanently removed. This can't be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}

      <Toast toast={toast} onDismiss={dismissToast} />
    </div>
  );
}
