import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// This function combines multiple CSS classes intelligently
// It resolves conflicts between Tailwind classes
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}