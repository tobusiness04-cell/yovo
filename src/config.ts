import { StoreConfig, SocialPlatform, SocialPlatformIcon } from './types';

/**
 * Default Social and Order Platforms
 * WhatsApp is configured as the PRIMARY order platform by default.
 */
export const defaultSocialPlatforms: SocialPlatform[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    url: 'https://wa.me/213549759489',
    handleOrDisplay: '0549 75 94 89',
    icon: 'whatsapp',
    enabled: true,
    isPrimaryOrderPlatform: true,
    displayOrder: 1,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    url: 'https://instagram.com/yovodz',
    handleOrDisplay: '@yovodz',
    icon: 'instagram',
    enabled: true,
    isPrimaryOrderPlatform: false,
    displayOrder: 2,
  },
];

/**
 * Detects whether a platform is WhatsApp regardless of icon type, custom platform status, or Algerian phone input.
 */
export function isWhatsAppPlatform(platform?: Partial<SocialPlatform> | null): boolean {
  if (!platform) return false;
  const icon = (platform.icon || '').toLowerCase();
  const name = (platform.name || '').toLowerCase();
  const id = (platform.id || '').toLowerCase();
  const url = (platform.url || '').toLowerCase();
  const handle = (platform.handleOrDisplay || '').toLowerCase();

  return (
    icon === 'whatsapp' ||
    id.includes('whatsapp') ||
    name.includes('whatsapp') ||
    name.includes('واتساب') ||
    name.includes('واتس') ||
    url.includes('wa.me') ||
    url.includes('whatsapp') ||
    // Detect phone numbers like 0549759489, +213..., https://05...
    /^(https?:\/\/)?(\+?213|0[567])[0-9]{8}/.test(url.replace(/[\s\-\/\.]/g, '')) ||
    /^(\+?213|0[567])[0-9]{8}/.test(handle.replace(/[\s\-\/\.]/g, ''))
  );
}

/**
 * Formats a phone number or WhatsApp URL into an active WhatsApp direct-chat URL with prefilled text.
 * Intelligently extracts Algerian numbers (05/06/07...), strips faulty https:// prefixes on raw phones,
 * and eliminates invalid characters like '+' that break wa.me links.
 */
export function buildWhatsAppOrderUrl(urlOrPhone?: string, message?: string): string {
  const defaultPhone = '213549759489';
  const encodedText = message ? encodeURIComponent(message) : '';

  if (!urlOrPhone || !urlOrPhone.trim() || urlOrPhone.includes('XXXXXXXXXXX')) {
    return `https://wa.me/${defaultPhone}${encodedText ? `?text=${encodedText}` : ''}`;
  }

  const cleaned = urlOrPhone.trim();

  // Case 1: api.whatsapp.com/send?phone=...
  if (cleaned.includes('api.whatsapp.com/send')) {
    try {
      const parsedUrl = new URL(cleaned.startsWith('http') ? cleaned : `https://${cleaned}`);
      const phoneParam = parsedUrl.searchParams.get('phone');
      if (phoneParam) {
        let digits = phoneParam.replace(/[^\d]/g, '');
        if (digits.startsWith('0') && digits.length === 10) {
          digits = '213' + digits.slice(1);
        }
        return `https://wa.me/${digits}${encodedText ? `?text=${encodedText}` : ''}`;
      }
    } catch (_) {}
  }

  // Case 2: wa.me/... URL
  if (cleaned.includes('wa.me/')) {
    const afterWaMe = cleaned.split('wa.me/')[1] || '';
    const numberOnly = afterWaMe.split('?')[0].split('/')[0];
    let digits = numberOnly.replace(/[^\d]/g, '');
    if (digits.startsWith('0') && digits.length === 10) {
      digits = '213' + digits.slice(1);
    }
    if (digits.length >= 8 && digits !== '555000000') {
      return `https://wa.me/${digits}${encodedText ? `?text=${encodedText}` : ''}`;
    }
  }

  // Case 3: Extract digits from input (handles "https://0549759489", "0549 75 94 89", "+213 549 75 94 89", etc.)
  let digits = cleaned.replace(/[^\d]/g, '');

  // Handle Algerian 10 digits starting with 05, 06, 07 -> 2135..., 2136..., 2137...
  if (digits.startsWith('0') && digits.length === 10) {
    digits = '213' + digits.slice(1);
  } else if (digits.length === 9 && ['5', '6', '7'].includes(digits[0])) {
    digits = '213' + digits;
  } else if (digits.startsWith('00213')) {
    digits = digits.slice(2);
  }

  if (digits.length >= 8) {
    return `https://wa.me/${digits}${encodedText ? `?text=${encodedText}` : ''}`;
  }

  return `https://wa.me/${defaultPhone}${encodedText ? `?text=${encodedText}` : ''}`;
}

/**
 * Returns all enabled social platforms ordered by displayOrder, automatically normalizing WhatsApp platforms
 */
export function getEnabledSocialPlatforms(settings?: StoreConfig): SocialPlatform[] {
  const platforms = settings?.socialPlatforms;
  if (Array.isArray(platforms) && platforms.length > 0) {
    const enabled = platforms
      .filter((p) => p.enabled && p.url && p.url.trim() !== '')
      .map((p) => {
        if (isWhatsAppPlatform(p)) {
          return {
            ...p,
            id: p.id || 'whatsapp',
            icon: 'whatsapp' as SocialPlatformIcon,
            url: buildWhatsAppOrderUrl(p.url),
            handleOrDisplay:
              p.handleOrDisplay && !p.handleOrDisplay.startsWith('http')
                ? p.handleOrDisplay
                : '0549 75 94 89',
          };
        }
        return p;
      })
      .sort((a, b) => (a.displayOrder ?? 99) - (b.displayOrder ?? 99));

    if (enabled.length > 0) {
      return enabled;
    }
  }

  // Fallback to whatsappUrl & instagramUrl if socialPlatforms not yet set
  if (settings?.whatsappUrl || settings?.instagramUrl) {
    const fallbackList: SocialPlatform[] = [];
    if (settings.whatsappUrl) {
      fallbackList.push({
        id: 'whatsapp',
        name: 'WhatsApp',
        url: buildWhatsAppOrderUrl(settings.whatsappUrl),
        handleOrDisplay: settings.whatsappDisplay || settings.whatsappPhone || '0549 75 94 89',
        icon: 'whatsapp',
        enabled: true,
        isPrimaryOrderPlatform: true,
        displayOrder: 1,
      });
    }
    if (settings.instagramUrl) {
      fallbackList.push({
        id: 'instagram',
        name: 'Instagram',
        url: settings.instagramUrl,
        handleOrDisplay: settings.instagramUsername || '@yovodz',
        icon: 'instagram',
        enabled: true,
        isPrimaryOrderPlatform: !settings.whatsappUrl,
        displayOrder: 2,
      });
    }
    return fallbackList;
  }

  return defaultSocialPlatforms;
}

/**
 * Returns the active Primary Order Platform (defaults to WhatsApp if enabled)
 */
export function getPrimaryOrderPlatform(settings?: StoreConfig): SocialPlatform | null {
  const enabled = getEnabledSocialPlatforms(settings);
  if (enabled.length === 0) return null;

  const primary = enabled.find((p) => p.isPrimaryOrderPlatform);
  if (primary) return primary;

  const whatsapp = enabled.find((p) => isWhatsAppPlatform(p));
  return whatsapp || enabled[0] || null;
}

/**
 * Normalizes an external order or social URL to ensure https:// prefix
 */
export function getOrderPlatformUrl(platformUrl?: string): string {
  if (!platformUrl || !platformUrl.trim()) {
    return '';
  }
  let url = platformUrl.trim();
  if (isWhatsAppPlatform({ url })) {
    return buildWhatsAppOrderUrl(url);
  }
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  return url;
}

/**
 * Default order message template with variable placeholders:
 * {product} - The product name
 * {plan} - The chosen duration or plan title
 * {price} - The formatted price with currency
 */
export const DEFAULT_ORDER_MESSAGE_TEMPLATE =
  'سلام Yovo 👋 حاب نطلب اشتراك: {product} – {plan} – {price}.\nمن فضلك ابعثلي تفاصيل الدفع والتفعيل.';

/**
 * Builds the dynamic pre-filled order text based on product, plan, and settings template.
 */
export function generateOrderMessage(
  template: string | undefined,
  product: { name: string; currency?: string; price?: number | string },
  plan?: { duration?: string; price?: number | string },
  fallbackCurrency: string = 'دج'
): string {
  const tpl = (template && template.trim()) || DEFAULT_ORDER_MESSAGE_TEMPLATE;
  const productName = product.name || 'الاشتراك';
  const planDuration = plan?.duration || 'اشتراك كامل';
  const rawPrice =
    plan?.price !== undefined && plan?.price !== ''
      ? plan.price
      : product.price !== undefined
      ? product.price
      : 0;
  const currency = product.currency || fallbackCurrency;
  const formattedPrice = `${rawPrice} ${currency}`.trim();

  return tpl
    .replace(/\{product\}/gi, productName)
    .replace(/\{المنتج\}/gi, productName)
    .replace(/\{plan\}/gi, planDuration)
    .replace(/\{الخطة\}/gi, planDuration)
    .replace(/\{المدة\}/gi, planDuration)
    .replace(/\{price\}/gi, formattedPrice)
    .replace(/\{السعر\}/gi, formattedPrice)
    .trim();
}

/**
 * Central Store Configuration for Yovo
 */
export const storeConfig: StoreConfig = {
  brandName: 'Yovo',
  brandTagline: 'اشتراكات رقمية وخدمات Premium في بلاصة وحدة',
  
  // Primary Communication & Order link (WhatsApp)
  whatsappUrl: 'https://wa.me/213549759489',
  whatsappPhone: '+213 549 75 94 89',
  whatsappDisplay: '0549 75 94 89',

  // Secondary Social & Contact link
  instagramUrl: 'https://instagram.com/yovodz',
  instagramUsername: '@yovodz',

  // Dynamic social platforms (editable in Admin Panel)
  socialPlatforms: defaultSocialPlatforms,

  // Order message template for clipboard copying & WhatsApp prefilled messages
  orderMessageTemplate: DEFAULT_ORDER_MESSAGE_TEMPLATE,

  // Currency used across all price calculations
  currency: 'دج',
  defaultLanguage: 'ar',

  // Guarantee and transparency disclosures
  guaranteeGeneralText: 'شروط الضمان تختلف حسب الخدمة والاشتراك، ويتم توضيحها ومتابعتها خطوة بخطوة قبل تأكيد الطلب.',
  footerText: 'اشتراكات رقمية وخدمات Premium في بلاصة وحدة.',
  independentBrandNotice: 'Yovo علامة مستقلة. جميع أسماء المنتجات والماركات التجارية المذكورة (مثل Canva، CapCut، وغيرها) ملك لأصحابها ولا ندّعي أي شراكة أو تمثيل رسمي.',
};

export const navLinks = [
  { label: 'الرئيسية', href: '#hero' },
  { label: 'الاشتراكات', href: '#products' },
  { label: 'علاش Yovo؟', href: '#why' },
  { label: 'كيفاش تطلب؟', href: '#how-it-works' },
  { label: 'الأسئلة', href: '#faq' },
];
