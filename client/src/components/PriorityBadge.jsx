const colors = {
  low: 'bg-emerald-100 text-emerald-700',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-rose-100 text-rose-700',
};

export default function PriorityBadge({ priority = 'medium' }) {
  return <span className={`rounded px-2 py-1 text-xs font-medium ${colors[priority]}`}>{priority}</span>;
}
