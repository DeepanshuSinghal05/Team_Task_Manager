import { useState } from 'react';
import Modal from './Modal';

export default function InviteMemberModal({ open, onClose, onSubmit }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');

  const submit = (e) => {
    e.preventDefault();
    onSubmit({ email, role });
    setEmail('');
    setRole('member');
  };

  return (
    <Modal title="Invite member" open={open} onClose={onClose}>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full rounded border border-slate-300 px-3 py-2 text-sm" placeholder="email@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <select className="w-full rounded border border-slate-300 px-3 py-2 text-sm" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="member">member</option>
          <option value="admin">admin</option>
        </select>
        <button className="rounded bg-indigo-500 px-3 py-2 text-sm font-medium text-white">Invite</button>
      </form>
    </Modal>
  );
}
