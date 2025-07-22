import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimestamp(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    return date.toLocaleString('id-ID', {
      year: 'numeric',
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  } catch {
    return timestamp;
  }
}

export function getSpeedDisplayText(rawSpeed: number): string {
  switch (rawSpeed) {
    case 255: return 'Kecepatan Penuh';
    case 200: return 'Kecepatan Tinggi';
    case 128: return 'Kecepatan Sedang';
    case 100: return 'Kecepatan Rendah';
    case 0: return 'Berhenti';
    default: return `Kecepatan: ${rawSpeed}`;
  }
}

export function capitalizeFirst(str: string): string {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}
