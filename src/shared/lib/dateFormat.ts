export const toDateInput = (value: string | Date | null | undefined): string =>
  value ? new Date(value).toISOString().slice(0, 10) : '';

export const formatDate = (value: string | Date | null | undefined): string =>
  value ? new Date(value).toLocaleDateString('ru-RU') : '—';
