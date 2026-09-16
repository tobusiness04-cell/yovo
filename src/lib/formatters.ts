/**
 * Price and Link Formatting Utilities for Yovo
 */

export function formatPrice(price: number | string, currency = 'دج'): string {
  if (typeof price === 'number') {
    return `${price.toLocaleString('fr-DZ')} ${currency}`;
  }
  return `${price} ${currency}`;
}

export function buildWhatsAppOrderUrl(
  baseWhatsAppUrl: string,
  productName: string,
  duration?: string,
  price?: number | string,
  currency = 'دج'
): string {
  const cleanBase = baseWhatsAppUrl.trim();
  const priceText = price ? ` - ${formatPrice(price, currency)}` : '';
  const durationText = duration ? ` (المدة: ${duration}${priceText})` : '';
  
  const text = encodeURIComponent(
    `سلام Yovo 👋\nحاب نطلب اشتراك: ${productName}${durationText}\nممكن تفاصيل الدفع والتفعيل من فضلك؟`
  );

  if (cleanBase.includes('?')) {
    return `${cleanBase}&text=${text}`;
  }
  return `${cleanBase}?text=${text}`;
}

export function buildWhatsAppInquiryUrl(baseWhatsAppUrl: string): string {
  const cleanBase = baseWhatsAppUrl.trim();
  const text = encodeURIComponent('سلام Yovo 👋 حاب نستفسر على الاشتراكات الرقمية والخدمات المتوفرة عندكم.');
  if (cleanBase.includes('?')) {
    return `${cleanBase}&text=${text}`;
  }
  return `${cleanBase}?text=${text}`;
}
