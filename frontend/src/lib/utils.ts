import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * @description The function that allows other components and pages to grab ShadCN
 * styling classes and apply them
 * 
 * @param {ClassValue[]} inputs The class values from ShadCN to be applied to the
 * component
 * 
 * @returns Merged classes from ShadCN into TailwindCSS
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
