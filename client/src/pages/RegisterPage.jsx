import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/endpoints';
import { useAuth } from '../hooks/useAuth';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { showToast } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = 'Name must be at least 2 chars';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Invalid email';
    if (form.password.length < 8 || !/\d/.test(form.password)) e.password = 'Password min 8 and one number';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await authApi.register(form);
      showToast('Registration successful. Please login.', 'success');
      navigate('/login');
    } catch {
      showToast('Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="mb-5 text-xl font-semibold text-slate-900">Create account</h1>
        <div className="space-y-3">
          <div><input className="w-full rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />{errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}</div>
          <div><input className="w-full rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />{errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}</div>
          <div><input className="w-full rounded border border-slate-300 px-3 py-2 text-sm" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />{errors.password && <p className="mt-1 text-xs text-rose-600">{errors.password}</p>}</div>
        </div>
        <button disabled={loading} className="mt-4 w-full rounded bg-indigo-500 px-3 py-2 text-sm font-medium text-white disabled:opacity-60">{loading ? 'Creating...' : 'Register'}</button>
        <Link to="/login" className="mt-3 block text-center text-sm text-slate-600">Already have an account?</Link>
      </form>
    </div>
  );
}
