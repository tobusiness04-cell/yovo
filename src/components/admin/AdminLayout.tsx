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
} from 'lucide-react';

interface AdminLayoutProps {
  currentTab: 'dashboard' | 'products' | 'categories' | 'settings';
  onSelectTab: (tab: 'dashboard' | 'products' | 'categories' | 'settings') => void;
  onViewStore: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  onViewStore,
  children,
}) => {
  const { currentUser, logout, isFirebaseConfigured } = useAdminAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: 'products', label: 'الاشتراكات والأسعار', icon: Package },
    { id: 'categories', label: 'التصنيفات', icon: Layers },
    { id: 'settings', label: 'إعدادات المتجر', icon: Settings },
  ] as const;

  const handleNavClick = (tab: typeof currentTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col" dir="rtl">
      
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-slate-900 text-white border-b border-slate-800 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-md">
        
        {/* Right side (RTL Start): Mobile Hamburger + Brand */}
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
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm tracking-tight text-white">Yovo</span>
                <span className="px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 text-[10px] font-bold border border-sky-500/30">
                  Admin
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Left side (RTL End): User status, View Store, Logout */}
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
              {currentUser?.email || 'Admin'}
            </span>
            <span className="text-slate-400 text-[10px]">
              {isFirebaseConfigured ? 'Firebase Production' : 'Local Preview'}
            </span>
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
        <aside className="hidden lg:flex w-64 bg-white border-l border-slate-200/80 flex-col justify-between p-4 shrink-0 shadow-xs">
          <div className="space-y-1.5">
            <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              القائمة الرئيسية
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Bottom Sidebar info */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 text-[11px] text-slate-500">
            <div className="font-bold text-slate-700 mb-0.5">Yovo v1.2</div>
            <div>متجر الاشتراكات الرقمية — الجزائر</div>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="w-64 h-full bg-white p-5 flex flex-col justify-between shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="font-extrabold text-sm text-slate-900">إدارة Yovo</span>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onViewStore();
                  }}
                  className="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold text-sky-600 hover:bg-sky-50 transition-all mt-4 border border-sky-100"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>زيارة المتجر العام</span>
                </button>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => logout()}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-rose-50 text-rose-700 rounded-xl text-xs font-bold hover:bg-rose-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>

      </div>

    </div>
  );
};
