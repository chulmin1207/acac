import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(price);
}

export function calculateDiscountedPrice(price: number, discount: number): number {
  return Math.floor(price * (1 - discount / 100));
}

export function formatDiscount(discount: number): string {
  return `${discount}%`;
}
