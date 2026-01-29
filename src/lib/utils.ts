import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPlayerCount(count: number): string {
  const plural = count === 1 ? 'player' : 'players'
  return `${count} ${plural}`
}
