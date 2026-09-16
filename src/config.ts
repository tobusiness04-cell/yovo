import { StoreConfig } from './types';

/**
 * Central Store Configuration for Yovo
 * 
 * You can easily update Instagram, WhatsApp, Brand details, and notices here
 * without modifying any UI components or application code.
 */
export const storeConfig: StoreConfig = {
  brandName: 'Yovo',
  brandTagline: 'اشتراكات رقمية وخدمات Premium في بلاصة وحدة',
  
  // Social & Contact links (Change these anytime)
  instagramUrl: 'https://instagram.com/yovodz',
  instagramUsername: '@yovodz',
  
  // WhatsApp link placeholder (Replace XXXXXXXXXXX with your Algerian phone number e.g. 213XXXXXXXXX)
  whatsappUrl: 'https://wa.me/XXXXXXXXXXX',
  whatsappDisplay: '+213 (WhatsApp)',

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
