import { useEffect, useState } from 'react';
import { tasksApi } from '../api/endpoints';

export const useTasks = (projectId) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await tasksApi.list(projectId);
      setTasks(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) fetchTasks();
  }, [projectId]);

  return { tasks, loading, refetch: fetchTasks };
};
