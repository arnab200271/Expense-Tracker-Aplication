
const rates: Record<string, number> = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0095,
  JPY: 1.83,
};

export function convertCurrency(amount: number, from: string, to: string): number {
  if (!from || !to) {
    console.warn("convertCurrency: missing currency type", { from, to });
    return amount; 
  }
  const fromRate = rates[from.toUpperCase()] || 1;
  const toRate = rates[to.toUpperCase()] || 1;
  return (amount / fromRate) * toRate;
}
