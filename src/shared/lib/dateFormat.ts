export const toDateInput = (value: string | Date | null | undefined): string =>
  value ? new Date(value).toISOString().slice(0, 10) : '';

export const formatDate = (value: string | Date | null | undefined): string => {
  if (!value) return '—';
  const date = new Date(value);
  return new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: 'long' }).format(date);
};
