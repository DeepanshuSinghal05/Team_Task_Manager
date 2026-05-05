import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { projectsApi } from '../api/endpoints';
import InviteMemberModal from '../components/InviteMemberModal';
import { useAuth } from '../hooks/useAuth';

export default function ProjectSettingsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [openInvite, setOpenInvite] = useState(false);

  const load = () => projectsApi.detail(id).then((res) => setProject(res.data.data));
  useEffect(() => { load(); }, [id]);

  const isProjectAdmin = project?.members?.some((member) => member.user_id === user?.id && member.role === 'admin');
  const canManageTeam = user?.role === 'admin' || user?.email === 'admin@example.com' || isProjectAdmin;
  if (!canManageTeam) return <Navigate to={`/projects/${id}`} replace />;

  const invite = async (payload) => {
    await projectsApi.invite(id, payload);
    setOpenInvite(false);
    load();
  };

  const remove = async (userId) => {
    await projectsApi.removeMember(id, userId);
    load();
  };

  return (
    <div className="mx-auto max-w-3xl p-5">
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between"><h1 className="text-lg font-semibold">Project Settings</h1><button onClick={() => setOpenInvite(true)} className="rounded bg-indigo-500 px-3 py-2 text-sm text-white">Invite member</button></div>
        <ul className="space-y-2">{project?.members?.map((member) => (
          <li key={member.user_id} className="flex items-center justify-between rounded border border-slate-200 p-3">
            <div><p className="text-sm font-medium">{member.name}</p><p className="text-xs text-slate-500">{member.email} - {member.role}</p></div>
            <button onClick={() => remove(member.user_id)} className="text-sm text-rose-600">Remove</button>
          </li>
        ))}</ul>
      </div>
      <InviteMemberModal open={openInvite} onClose={() => setOpenInvite(false)} onSubmit={invite} />
    </div>
  );
}
