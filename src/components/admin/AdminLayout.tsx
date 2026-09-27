import React, { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  LayoutDashboard,
  Package,
  Layers,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  ShoppingBag,
  DollarSign,
  Target,
  Calculator,
  Globe,
  BarChart3,
  TrendingDown,
} from 'lucide-react';

export type AdminTab =
  | 'dashboard'
  | 'orders'
  | 'products'
  | 'categories'
  | 'costs'
  | 'advertising'
  | 'calculator'
  | 'landing_pages'
  | 'analytics'
  | 'settings';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onViewStore: () => void;
  pendingOrdersCount?: number;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  onViewStore,
  pendingOrdersCount = 0,
  children,
}) => {
  const { currentUser, logout, isFirebaseConfigured } = useAdminAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navSections = [
    {
      title: 'المتجر والمبيعات',
      items: [
        { id: 'dashboard', label: 'نظرة عامة', icon: LayoutDashboard },
        { id: 'orders', label: 'إدارة الطلبات', icon: ShoppingBag, badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined },
        { id: 'products', label: 'الاشتراكات والأسعار', icon: Package },
        { id: 'categories', label: 'التصنيفات', icon: Layers },
      ],
    },
    {
      title: 'المالية والتسويق',
      items: [
        { id: 'costs', label: 'المصروفات والتكاليف', icon: TrendingDown },
        { id: 'advertising', label: 'إعلانات Meta Ads & CAC', icon: Target },
        { id: 'calculator', label: 'حاسبة التسعير الذكي', icon: Calculator },
        { id: 'analytics', label: 'تحليلات الأرباح', icon: BarChart3 },
      ],
    },
    {
      title: 'التسويق والنظام',
      items: [
        { id: 'landing_pages', label: 'صفحات الهبوط', icon: Globe },
        { id: 'settings', label: 'إعدادات المتجر', icon: Settings },
      ],
    },
  ] as const;

  const handleNavClick = (tab: AdminTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans" dir="rtl">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-slate-900 text-white border-b border-slate-800 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-md">
        {/* Right side: Mobile Hamburger + Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white lg:hidden rounded-xl hover:bg-slate-800 transition-colors"
            aria-label="القائمة"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-[#6cff76] flex items-center justify-center border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm tracking-tight text-white">YOVO</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-[#6cff76] text-[10px] font-bold border border-emerald-500/30">
                  Store Manager
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Left side: View Store, User email, Logout */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onViewStore}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors border border-slate-700"
          >
            <span>زيارة المتجر</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <div className="hidden md:flex flex-col text-left text-xs dir-ltr">
            <span className="text-slate-200 font-bold text-[11px] truncate max-w-[150px]">
              {currentUser?.email || 'admin@yovo.dz'}
            </span>
            <span className="text-[#6cff76] text-[10px] font-semibold">مسؤول معتمد ✓</span>
          </div>

          <button
            type="button"
            onClick={() => logout()}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors"
            title="تسجيل الخروج"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 bg-white border-l border-slate-200/80 flex-col justify-between p-4 shrink-0 shadow-xs overflow-y-auto">
          <div className="space-y-4">
            {navSections.map((section, sIdx) => (
              <div key={sIdx} className="space-y-1">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {section.title}
                </div>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavClick(item.id as AdminTab)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-[#006633] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#6cff76]' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#6cff76] text-[#003319] animate-pulse">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Bottom Sidebar info */}
          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500">
            <div className="font-bold text-slate-700">YOVO Store System v2.0</div>
            <div>متجر الاشتراكات الرقمية — الجزائر</div>
          </div>
        </aside>

        {/* Mobile Slide-over Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl p-5 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="font-bold text-sm text-slate-900">القائمة الرئيسية</span>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {navSections.map((section, sIdx) => (
                  <div key={sIdx} className="space-y-1">
                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {section.title}
                    </div>
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentTab === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleNavClick(item.id as AdminTab)}
                          className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                            isActive
                              ? 'bg-slate-900 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                            <span>{item.label}</span>
                          </div>
                          {item.badge !== undefined && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    onViewStore();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-slate-50"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>زيارة واجهة المتجر</span>
                </button>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="w-full py-2.5 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-rose-100"
                >
                  <LogOut className="w-4 h-4" />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Viewport Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
