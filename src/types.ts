export interface ProductPlan {
  id: string;
  duration: string; // e.g. "شهري", "3 أشهر", "6 أشهر", "عام", "عامين"
  price: number | string; // e.g. 600, 1200
  currency?: string;
  available?: boolean;
  popular?: boolean;
  note?: string; // e.g. "الأكثر توفيراً"
  purchaseCost?: number; // Cost to acquire/provide this plan
  adCost?: number; // Estimated advertising cost allocation for this plan
  otherCost?: number; // Other direct costs for this plan
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
  purchaseCost?: number; // Default purchase cost
  adCost?: number; // Default ad cost
  otherCosts?: number; // Default other costs
  targetMargin?: number; // Target profit margin percentage e.g. 35%
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

export type OrderStatus = 'pending' | 'completed' | 'cancelled';

export interface Order {
  id: string; // Unique order ID, e.g. ORD-2609-1234
  productId: string;
  productName: string;
  planId: string;
  planName: string;
  sellingPrice: number;
  productCost: number;
  adCost: number;
  paymentFee: number;
  otherCosts: number;
  totalCost: number;
  profit: number; // sellingPrice - totalCost
  customerInstagram?: string;
  customerName?: string;
  customerPhone?: string;
  notes?: string;
  status: OrderStatus;
  landingPageId?: string; // Slug or ID if ordered from a landing page
  currency: string;
  createdAt: string; // ISO string
  completedAt?: string; // ISO string
  cancelledAt?: string; // ISO string
  updatedAt?: string;
}

export type ExpenseCategory =
  | 'product_purchase'
  | 'advertising'
  | 'payment_fees'
  | 'domain_hosting'
  | 'software'
  | 'other';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  date: string; // YYYY-MM-DD
  productId?: string; // Optional linked product
  campaignId?: string; // Optional linked ad campaign
  notes?: string;
  createdAt: string;
}

export type AdPlatform = 'meta_ads' | 'tiktok_ads' | 'google_ads' | 'influencer' | 'other';

export interface AdCampaign {
  id: string;
  name: string;
  platform: AdPlatform;
  productId?: string;
  amountSpent: number;
  startDate: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  notes?: string;
  createdAt: string;
}

export interface LandingPage {
  id: string;
  name: string;
  slug: string; // URL slug, e.g. "canva-pro"
  active: boolean;
  productId: string;
  planId?: string;
  heroTitle: string;
  heroDescription: string;
  badgeText?: string;
  imageUrl?: string;
  benefits: string[];
  features: string[];
  faq: { question: string; answer: string }[];
  ctaText?: string;
  displayOrder?: number;
  createdAt: string;
  updatedAt?: string;
}

export type SocialPlatformIcon =
  | 'instagram'
  | 'facebook'
  | 'telegram'
  | 'tiktok'
  | 'messenger'
  | 'youtube'
  | 'x'
  | 'custom';

export interface SocialPlatform {
  id: string;
  name: string;
  url: string;
  handleOrDisplay?: string;
  icon?: SocialPlatformIcon | string;
  enabled: boolean;
  isPrimaryOrderPlatform: boolean;
  displayOrder: number;
}

export interface StoreConfig {
  brandName: string;
  brandTagline: string;
  instagramUrl?: string;
  instagramUsername?: string;
  currency: string;
  defaultLanguage: string;
  guaranteeGeneralText: string;
  footerText: string;
  independentBrandNotice: string;
  socialPlatforms?: SocialPlatform[];
  orderMessageTemplate?: string;
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

declare global {
  interface Window {
    fbq?: (action: string, eventName: string, params?: Record<string, unknown>) => void;
  }
}
