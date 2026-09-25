import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpLeft, Send, Sparkles, Instagram } from 'lucide-react';
import { storeConfig, navLinks } from '../config';
import { StoreConfig } from '../types';

interface NavbarProps {
  onOpenContact: () => void;
  settings?: StoreConfig;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenContact,
  settings,
}) => {
  const currentSettings = settings || storeConfig;
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => setIsOpen(false);

  return (
    <header
      id="main-navbar"
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-[#E5E7EB] py-2.5 sm:py-3'
          : 'bg-white border-b border-[#E5E7EB]/70 py-3 sm:py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo - Yovo Digital Commerce */}
          <a
            id="brand-logo-link"
            href="#hero"
            className="flex items-center gap-2 group focus:outline-hidden"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#080B0F] text-white flex items-center justify-center font-brand font-black text-lg sm:text-xl shadow-xs group-hover:bg-black transition-all">
              <span>Y</span>
            </div>
            <div className="flex items-center">
              <span className="font-brand font-black text-xl sm:text-2xl tracking-tight text-[#080B0F] uppercase">
                {currentSettings.brandName || 'YOVO'}
              </span>
              <span className="w-2 h-2 rounded-full bg-[#FF3B30] mr-0.5 animate-pulse" />
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav id="desktop-nav" className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs sm:text-sm font-semibold text-[#6B7280] hover:text-[#080B0F] transition-colors relative py-1 hover:after:w-full after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-0 after:h-[2px] after:bg-[#FF3B30] after:transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Action CTAs */}
          <div className="hidden md:flex items-center gap-2.5">
            <button
              id="desktop-contact-btn"
              type="button"
              onClick={onOpenContact}
              className="text-xs font-bold px-3.5 py-2 text-[#080B0F] bg-[#F3F4F6] hover:bg-gray-200 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Instagram className="w-3.5 h-3.5 text-[#FF3B30]" />
              <span>تواصل معنا</span>
            </button>

            <a
              id="desktop-cta-products"
              href="#products"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#FF3B30] hover:bg-[#E02D22] shadow-xs shadow-[#FF3B30]/20 transition-all duration-200 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-white/90" />
              <span>الاشتراكات</span>
              <ArrowUpLeft className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Actions: Contact + Quick CTA + Menu Button */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              type="button"
              onClick={onOpenContact}
              className="p-2 text-[#080B0F] hover:text-[#FF3B30] bg-[#F3F4F6] rounded-xl transition-colors"
              aria-label="تواصل"
            >
              <Instagram className="w-4 h-4 text-[#FF3B30]" />
            </button>

            <a
              id="mobile-quick-cta"
              href="#products"
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#FF3B30] shadow-xs active:scale-95 transition-transform"
            >
              الاشتراكات
            </a>

            <button
              id="mobile-menu-toggle"
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 text-[#080B0F] hover:bg-[#F3F4F6] rounded-xl transition-colors"
              aria-label="قائمة التصفح"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Overlay Drawer */}
      {isOpen && (
        <div
          id="mobile-menu-drawer"
          className="md:hidden fixed inset-x-0 top-[53px] bg-white border-b border-[#E5E7EB] shadow-xl px-5 py-5 transition-all animate-in fade-in slide-in-from-top-3"
        >
          <div className="flex flex-col gap-2.5">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className="text-xs sm:text-sm font-bold text-[#080B0F] hover:text-[#FF3B30] py-2 border-b border-[#F3F4F6] transition-colors flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ArrowUpLeft className="w-3.5 h-3.5 text-[#6B7280]" />
              </a>
            ))}

            <div className="pt-2 flex flex-col gap-2">
              <a
                id="mobile-menu-explore-btn"
                href="#products"
                onClick={closeMobileMenu}
                className="w-full text-center py-2.5 rounded-xl font-bold text-xs text-white bg-[#FF3B30] hover:bg-[#E02D22] shadow-xs"
              >
                تصفح جميع الاشتراكات
              </a>
              <button
                id="mobile-menu-contact-btn"
                type="button"
                onClick={() => {
                  closeMobileMenu();
                  onOpenContact();
                }}
                className="w-full text-center py-2.5 rounded-xl font-bold text-xs text-[#080B0F] bg-[#F3F4F6] hover:bg-gray-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <Instagram className="w-3.5 h-3.5 text-[#FF3B30]" />
                <span>تواصل معنا عبر Instagram</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
