import PriorityBadge from './PriorityBadge';
import { formatDate, isOverdue } from '../utils/date';
import { STATUS_OPTIONS } from '../utils/constants';

export default function TaskCard({ task, canEdit, canUpdateStatus, onEdit, onStatusChange }) {
  return (
    <div className="w-full rounded-lg border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:border-indigo-300">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-slate-900">{task.title}</p>
        <PriorityBadge priority={task.priority} />
      </div>
      <p className="text-xs text-slate-500">Due: {formatDate(task.due_date)}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className={`text-xs ${isOverdue(task.due_date, task.status) ? 'text-rose-600' : 'text-slate-500'}`}>
          {isOverdue(task.due_date, task.status) ? 'Overdue' : task.status.replace('_', ' ')}
        </span>
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-700">
          {(task.assignee_name || 'U').slice(0, 1).toUpperCase()}
        </span>
      </div>
      <div className="mt-3 flex items-center gap-2">
        {canEdit && (
          <button onClick={() => onEdit(task)} className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700">
            Edit
          </button>
        )}
        {canUpdateStatus && (
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task, e.target.value)}
            className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status.replace('_', ' ')}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
