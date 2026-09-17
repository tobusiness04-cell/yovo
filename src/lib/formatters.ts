/**
 * Price and Link Formatting Utilities for Yovo
 */

export function formatPrice(price: number | string, currency = 'دج'): string {
  if (typeof price === 'number') {
    return `${price.toLocaleString('fr-DZ')} ${currency}`;
  }
  return `${price} ${currency}`;
}

