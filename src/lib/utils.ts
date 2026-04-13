import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function formatCompactNumber(number: number | string | undefined | null): string {
  if (number === undefined || number === null) return "0";
  const num = typeof number === 'string' ? Number.parseFloat(number) : number;
  if (Number.isNaN(num) || !Number.isFinite(num)) return "0";

  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  if (num >= 100) {
    return num.toFixed(0);
  }
  if (num >= 10) {
    return (num).toFixed(0);
  }
  return num.toString();
}

