import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Utils - Format Fiat Display
export function formatFiat(fiat, maxDigit) {
  return fiat.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: maxDigit });
}