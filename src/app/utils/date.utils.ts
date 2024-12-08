export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function getTimeLabels(period: string): string[] {
  const now = new Date();
  const labels: string[] = [];

  switch (period) {
    case 'day':
      for (let i = 0; i < 24; i++) {
        labels.push(`${i}h`);
      }
      break;
    case 'week':
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('fr-FR', { weekday: 'short' }));
      }
      break;
    case 'month':
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        labels.push(date.getDate().toString());
      }
      break;
    case 'year':
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        labels.push(date.toLocaleDateString('fr-FR', { month: 'short' }));
      }
      break;
  }

  return labels;
}