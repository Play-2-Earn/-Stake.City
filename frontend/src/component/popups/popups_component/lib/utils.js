import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function convertToSubcurrency(amount, factor = 100) {
  return Math.round(amount * factor);
}