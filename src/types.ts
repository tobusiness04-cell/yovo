export interface ProductPlan {
  id: string;
  duration: string; // e.g. "شهري", "3 أشهر", "6 أشهر", "عام", "عامين"
  price: number | string; // e.g. 600, 1200
  currency?: string;
  available?: boolean;
  popular?: boolean;
  note?: string; // e.g. "الأكثر توفيراً"
}

export interface Product {
  id: string;
  name: string;
  slug?: string;
  category: string; // e.g. "تصميم", "مونتاج", "AI", "إنتاجية"
  categorySlug?: string;
  categoryId?: string;
  description: string;
  price: number | string; // Base / default price
  currency: string; // Default: "دج"
  duration: string; // Default duration e.g. "شهري"
  features: string[];
  imageUrl?: string;
  image?: string;
  iconName?: string;
  brandColor?: string; // Accent color token for subtle card accents
  available: boolean;
  popular?: boolean;
  displayOrder?: number;
  guarantee?: string; // Configurable per product
  activationTime?: string; // e.g. "خلال 15 - 30 دقيقة"
  contactUrl?: string; // Optional override contact URL
  orderCtaText?: string; // e.g. "اطلب الآن"
  plans: ProductPlan[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  available: boolean;
  displayOrder: number;
}

export interface StoreConfig {
  brandName: string;
  brandTagline: string;
  instagramUrl: string;
  instagramUsername: string;
  whatsappUrl: string;
  whatsappDisplay: string;
  currency: string;
  defaultLanguage: string;
  guaranteeGeneralText: string;
  footerText: string;
  independentBrandNotice: string;
}

export interface AdminUser {
  uid: string;
  email: string | null;
  role: 'admin' | 'superadmin';
  displayName?: string | null;
}


export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface TestimonialItem {
  id: string;
  customerName: string;
  service: string;
  text: string;
  date?: string;
  isPlaceholderNote?: string;
}
