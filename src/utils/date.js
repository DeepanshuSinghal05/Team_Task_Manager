export const formatDate = (value) => {
  if (!value) return 'No due date';
  return new Date(value).toLocaleDateString();
};

export const isOverdue = (value, status) => {
  if (!value || status === 'done') return false;
  const due = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due < today;
};
