export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return 100;
  return Number(((current - previous) / previous * 100).toFixed(1));
}

export function formatCurrency(amount: number, currency: string = 'TND'): string {
  return `${amount.toFixed(2)} ${currency}`;
}