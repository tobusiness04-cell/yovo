import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpLeft, Send } from 'lucide-react';
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
          ? 'bg-white/90 backdrop-blur-md shadow-xs border-b border-slate-200/80 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <a
            id="brand-logo-link"
            href="#hero"
            className="flex items-center gap-2.5 group focus:outline-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-brand font-bold text-xl shadow-xs group-hover:bg-slate-800 transition-colors">
              <span className="text-sky-400">Y</span>
              <span>o</span>
            </div>
            <div className="flex flex-col">
              <span className="font-brand font-extrabold text-2xl tracking-tight text-slate-900 leading-none">
                {currentSettings.brandName}
              </span>
              <span className="text-[11px] font-medium text-slate-500 tracking-wide mt-0.5">
                اشتراكات رقمية
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav id="desktop-nav" className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-slate-600 hover:text-slate-950 transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-0 after:h-[2px] after:bg-sky-500 hover:after:w-full after:transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <button
              id="desktop-contact-btn"
              type="button"
              onClick={onOpenContact}
              className="text-xs font-semibold px-3.5 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5 text-slate-500" />
              <span>تواصل معنا</span>
            </button>

            <a
              id="desktop-cta-products"
              href="#products"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-xs hover:shadow-md transition-all duration-200 active:scale-98"
            >
              <span>شوف الاشتراكات</span>
              <ArrowUpLeft className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <a
              id="mobile-quick-cta"
              href="#products"
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-slate-900"
            >
              الاشتراكات
            </a>
            <button
              id="mobile-menu-toggle"
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-colors"
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
          className="md:hidden fixed inset-x-0 top-[65px] bg-white border-b border-slate-200 shadow-xl px-6 py-6 transition-all animate-in fade-in slide-in-from-top-4"
        >
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className="text-base font-semibold text-slate-800 hover:text-sky-600 py-2 border-b border-slate-100 transition-colors flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ArrowUpLeft className="w-4 h-4 text-slate-400" />
              </a>
            ))}

            <div className="pt-2 flex flex-col gap-2.5">
              <a
                id="mobile-menu-explore-btn"
                href="#products"
                onClick={closeMobileMenu}
                className="w-full text-center py-3 rounded-xl font-bold text-sm text-white bg-slate-900 hover:bg-slate-800 shadow-xs"
              >
                شوف الاشتراكات
              </a>
              <button
                id="mobile-menu-contact-btn"
                type="button"
                onClick={() => {
                  closeMobileMenu();
                  onOpenContact();
                }}
                className="w-full text-center py-2.5 rounded-xl font-semibold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-slate-500" />
                <span>تواصل معنا عبر Instagram</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
