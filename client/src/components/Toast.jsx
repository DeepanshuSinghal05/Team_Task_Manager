const tone = {
  success: 'bg-emerald-500',
  error: 'bg-rose-500',
  info: 'bg-indigo-500',
};

export default function Toast({ toast }) {
  if (!toast) return null;

  return (
    <div className={`fixed right-4 top-4 z-50 rounded-lg px-4 py-3 text-sm text-white shadow-xl ${tone[toast.type]}`}>
      {toast.message}
    </div>
  );
}
