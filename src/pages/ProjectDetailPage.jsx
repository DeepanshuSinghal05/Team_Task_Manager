import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectsApi, tasksApi } from '../api/endpoints';
import Sidebar from '../components/Sidebar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import EmptyState from '../components/EmptyState';
import { STATUS_LABELS } from '../utils/constants';
import { useAuth } from '../hooks/useAuth';

const statuses = ['todo', 'in_progress', 'in_review', 'done'];

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const isGlobalAdmin = user?.role === 'admin' || user?.email === 'admin@example.com';
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const load = async () => {
    const [allProjects, detail, taskRes] = await Promise.all([projectsApi.list(), projectsApi.detail(id), tasksApi.list(id)]);
    setProjects(allProjects.data.data);
    setProject(detail.data.data);
    setTasks(taskRes.data.data);
  };

  useEffect(() => { load(); }, [id]);

  const isProjectAdmin = useMemo(
    () => project?.members?.some((member) => member.user_id === user?.id && member.role === 'admin') || false,
    [project, user?.id]
  );
  const canManageProject = isGlobalAdmin || isProjectAdmin;

  const grouped = useMemo(() => statuses.reduce((acc, status) => ({ ...acc, [status]: tasks.filter((t) => t.status === status) }), {}), [tasks]);

  const saveTask = async (payload) => {
    if (editingTask?.id) await tasksApi.update(id, editingTask.id, { ...editingTask, ...payload });
    else await tasksApi.create(id, payload);
    setModalOpen(false);
    setEditingTask(null);
    load();
  };

  const updateTaskStatus = async (task, status) => {
    await tasksApi.patchStatus(id, task.id, status);
    load();
  };

  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <Sidebar projects={projects} />
      <main className="flex-1 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div><h1 className="text-lg font-semibold">{project?.name || 'Project'}</h1><p className="text-sm text-slate-500">{project?.description}</p></div>
          <div className="flex gap-2">
            {canManageProject && <button onClick={() => setModalOpen(true)} className="rounded bg-indigo-500 px-3 py-2 text-sm text-white">New Task</button>}
            {canManageProject && <Link to={`/projects/${id}/settings`} className="rounded border border-slate-300 px-3 py-2 text-sm">Manage Team</Link>}
          </div>
        </div>
        {!tasks.length ? <EmptyState title="No tasks yet" subtitle="Create your first task to start execution." /> : (
          <div className="grid gap-4 md:grid-cols-4">
            {statuses.map((status) => (
              <section key={status} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-semibold text-slate-700">{STATUS_LABELS[status]}</h2><span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs">{grouped[status]?.length || 0}</span></div>
                <div className="space-y-2">
                  {grouped[status].map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      canEdit={canManageProject}
                      canUpdateStatus={canManageProject || task.assignee_id === user?.id}
                      onEdit={(t) => {
                        setEditingTask(t);
                        setModalOpen(true);
                      }}
                      onStatusChange={updateTaskStatus}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
      {canManageProject && (
        <TaskModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingTask(null);
          }}
          onSubmit={saveTask}
          initialValues={editingTask}
        />
      )}
    </div>
  );
}
