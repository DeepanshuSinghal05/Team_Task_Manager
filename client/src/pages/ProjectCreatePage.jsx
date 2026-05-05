import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { projectsApi } from '../api/endpoints';
import { useAuth } from '../hooks/useAuth';

export default function ProjectCreatePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.email === 'admin@example.com';
  const [form, setForm] = useState({
    name: '',
    description: '',
    members: [{ email: '', role: 'member' }],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  if (!isAdmin) return <Navigate to="/projects" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        name: form.name,
        description: form.description,
        members: form.members.filter((member) => member.email.trim()),
      };
      const res = await projectsApi.create(payload);
      navigate(`/projects/${res.data.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create project');
    } finally {
      setLoading(false);
    }
  };

  const updateMember = (index, key, value) => {
    const next = [...form.members];
    next[index] = { ...next[index], [key]: value };
    setForm({ ...form, members: next });
  };

  const addMemberField = () => {
    setForm({ ...form, members: [...form.members, { email: '', role: 'member' }] });
  };

  const removeMemberField = (index) => {
    const next = form.members.filter((_, idx) => idx !== index);
    setForm({ ...form, members: next.length ? next : [{ email: '', role: 'member' }] });
  };

  return (
    <div className="mx-auto max-w-2xl p-5">
      <form onSubmit={submit} className="rounded-lg border border-slate-200 bg-white p-5">
        <h1 className="mb-4 text-lg font-semibold">Create Project</h1>
        <div className="space-y-3">
          <input required className="w-full rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Project name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <textarea className="w-full rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="space-y-2 rounded border border-slate-200 p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-800">Add team members</p>
              <button type="button" onClick={addMemberField} className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700">Add member</button>
            </div>
            {form.members.map((member, index) => (
              <div key={index} className="grid gap-2 md:grid-cols-[1fr_130px_80px]">
                <input
                  type="email"
                  className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                  placeholder="member@email.com"
                  value={member.email}
                  onChange={(e) => updateMember(index, 'email', e.target.value)}
                />
                <select
                  className="rounded border border-slate-300 px-3 py-2 text-sm"
                  value={member.role}
                  onChange={(e) => updateMember(index, 'role', e.target.value)}
                >
                  <option value="member">member</option>
                  <option value="admin">admin</option>
                </select>
                <button type="button" onClick={() => removeMemberField(index)} className="rounded border border-rose-200 px-2 py-2 text-xs text-rose-600">Remove</button>
              </div>
            ))}
          </div>
        </div>
        {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
        <button disabled={loading} className="mt-4 rounded bg-indigo-500 px-3 py-2 text-sm text-white disabled:opacity-60">{loading ? 'Creating...' : 'Create'}</button>
      </form>
    </div>
  );
}
