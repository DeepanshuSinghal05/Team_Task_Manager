import { useState } from 'react';
import Modal from './Modal';
import { PRIORITY_OPTIONS } from '../utils/constants';

export default function TaskModal({ open, onClose, onSubmit, initialValues }) {
  const [form, setForm] = useState(initialValues || { title: '', description: '', priority: 'medium', due_date: '' });

  const submit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Modal title={initialValues?.id ? 'Edit Task' : 'Create Task'} open={open} onClose={onClose}>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Task title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <textarea className="w-full rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <select className="w-full rounded border border-slate-300 px-3 py-2 text-sm" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
          {PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <input type="date" className="w-full rounded border border-slate-300 px-3 py-2 text-sm" value={form.due_date || ''} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
        <button className="rounded bg-indigo-500 px-3 py-2 text-sm font-medium text-white">Save Task</button>
      </form>
    </Modal>
  );
}
