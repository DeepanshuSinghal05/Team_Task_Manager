import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectsApi } from '../api/endpoints';
import Sidebar from '../components/Sidebar';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../hooks/useAuth';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.email === 'admin@example.com';

  useEffect(() => { projectsApi.list().then((res) => setProjects(res.data.data)); }, []);

  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <Sidebar projects={projects} />
      <main className="flex-1 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Projects</h1>
          {isAdmin && <Link to="/projects/new" className="rounded bg-indigo-500 px-3 py-2 text-sm text-white">Create</Link>}
        </div>
        {!projects.length ? <EmptyState title="No projects yet" subtitle={isAdmin ? 'Create your first project to start managing tasks.' : 'You will see projects once tasks are assigned to you.'} /> : (
          <div className="grid gap-3 md:grid-cols-2">{projects.map((project) => <Link key={project.id} to={`/projects/${project.id}`} className="rounded-lg border border-slate-200 bg-white p-4"><p className="font-medium">{project.name}</p><p className="mt-1 text-sm text-slate-500">{project.description || 'No description'}</p></Link>)}</div>
        )}
      </main>
    </div>
  );
}
