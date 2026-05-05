import { useEffect, useState } from 'react';
import { dashboardApi, projectsApi } from '../api/endpoints';
import Sidebar from '../components/Sidebar';
import LoadingSkeleton from '../components/LoadingSkeleton';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    dashboardApi.get().then((res) => setData(res.data.data));
    projectsApi.list().then((res) => setProjects(res.data.data));
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <Sidebar projects={projects} />
      <main className="flex-1 p-5">
        {!data ? <LoadingSkeleton lines={6} /> : (
          <div className="space-y-5">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">Total projects</p><p className="text-2xl font-semibold">{data.total_projects}</p></div>
              <div className="rounded-lg border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">Assigned tasks</p><p className="text-2xl font-semibold">{data.total_assigned_tasks}</p></div>
              <div className="rounded-lg border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">Overdue</p><p className="text-2xl font-semibold">{data.overdue_tasks.length}</p></div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <h2 className="mb-3 text-sm font-semibold text-slate-900">Recently updated tasks</h2>
              <ul className="space-y-2 text-sm text-slate-600">{data.recent_tasks.map((task) => <li key={task.id} className="rounded border border-slate-100 p-2">{task.title}</li>)}</ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
