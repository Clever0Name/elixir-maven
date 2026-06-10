export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function formatAmount(amount: number | undefined, unit: string | undefined): string {
  if (!unit) return '';
  if (!amount) return unit;
  if (unit === 'ml') return `${amount}ml`;
  if (unit === 'dash') return `${amount} ${amount === 1 ? 'dash' : 'dashes'}`;
  return `${amount} ${unit}`;
}
