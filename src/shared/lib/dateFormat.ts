const pad2 = (value: number) => String(value).padStart(2, '0');

export const toDateInput = (value: string | Date | null | undefined): string => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
};

export const formatDate = (value: string | Date | null | undefined): string => {
  if (!value) return '-';
  const date = new Date(value);
  return new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: 'long' }).format(date);
};
