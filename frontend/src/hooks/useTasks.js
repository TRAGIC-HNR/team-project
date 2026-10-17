import { useCallback, useEffect, useState } from 'react';
import * as api from '../api/tasksApi.js';

/**
 * All task state + server calls live here.
 * Action functions throw on failure so the calling component can show a message.
 */
export default function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setTasks(await api.fetchTasks());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const addTask = async (data) => {
    const created = await api.createTask(data);
    setTasks((prev) => [created, ...prev]);
    return created;
  };

  const editTask = async (id, data) => {
    const updated = await api.updateTask(id, data);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  };

  // Optimistic: UI changes instantly, rolls back if the server says no.
  const changeStatus = async (id, status) => {
    const previous = tasks.find((t) => t.id === id)?.status;
    if (previous === status) return;
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    try {
      await api.updateTaskStatus(id, status);
    } catch (e) {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: previous } : t)));
      throw e;
    }
  };

  const removeTask = async (id) => {
    await api.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return { tasks, loading, error, reload, addTask, editTask, changeStatus, removeTask };
}
