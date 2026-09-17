import { StoreConfig, SocialPlatform } from './types';

/**
 * Default Social and Order Platforms
 * Instagram is configured as the primary order platform by default.
 */
export const defaultSocialPlatforms: SocialPlatform[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    url: 'https://instagram.com/yovodz',
    handleOrDisplay: '@yovodz',
    icon: 'instagram',
    enabled: true,
    isPrimaryOrderPlatform: true,
    displayOrder: 1,
  },
];

/**
 * Returns all enabled social platforms ordered by displayOrder
 */
export function getEnabledSocialPlatforms(settings?: StoreConfig): SocialPlatform[] {
  const platforms = settings?.socialPlatforms;
  if (Array.isArray(platforms) && platforms.length > 0) {
    const enabled = platforms
      .filter((p) => p.enabled && p.url && p.url.trim() !== '')
      .sort((a, b) => (a.displayOrder ?? 99) - (b.displayOrder ?? 99));

    if (enabled.length > 0) {
      return enabled;
    }
  }

  // Fallback to instagramUrl if socialPlatforms not yet set
  if (settings?.instagramUrl) {
    return [
      {
        id: 'instagram',
        name: 'Instagram',
        url: settings.instagramUrl,
        handleOrDisplay: settings.instagramUsername || '@yovodz',
        icon: 'instagram',
        enabled: true,
        isPrimaryOrderPlatform: true,
        displayOrder: 1,
      },
    ];
  }

  return defaultSocialPlatforms;
}

/**
 * Returns the active Primary Order Platform (defaults to Instagram if enabled)
 */
export function getPrimaryOrderPlatform(settings?: StoreConfig): SocialPlatform | null {
  const enabled = getEnabledSocialPlatforms(settings);
  if (enabled.length === 0) return null;

  const primary = enabled.find((p) => p.isPrimaryOrderPlatform);
  return primary || enabled[0] || null;
}

/**
 * Normalizes an external order or social URL to ensure https:// prefix
 */
export function getOrderPlatformUrl(platformUrl?: string): string {
  if (!platformUrl || !platformUrl.trim()) {
    return '';
  }
  let url = platformUrl.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  return url;
}

/**
 * Central Store Configuration for Yovo
 */
export const storeConfig: StoreConfig = {
  brandName: 'Yovo',
  brandTagline: 'اشتراكات رقمية وخدمات Premium في بلاصة وحدة',
  
  // Primary Social & Contact link
  instagramUrl: 'https://instagram.com/yovodz',
  instagramUsername: '@yovodz',

  // Dynamic social platforms (editable in Admin Panel)
  socialPlatforms: defaultSocialPlatforms,

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
