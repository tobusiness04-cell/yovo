import React, { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

interface AdminLoginProps {
  onBackToStore: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToStore }) => {
  const { login, authError, clearError, isFirebaseConfigured } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (!email.trim() || !password) {
      setLocalError('يرجى كتابة البريد الإلكتروني وكلمة المرور.');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
    } catch (err: any) {
      // Handled by context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6" dir="rtl">
      <div className="w-full max-w-md">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 text-white backdrop-blur-md mb-4 border border-white/15 shadow-xl">
            <ShieldCheck className="w-7 h-7 text-sky-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Yovo <span className="text-sky-400 font-medium text-lg">Admin</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1.5 font-normal">
            لوحة التحكم الآمنة لإدارة الاشتراكات والأسعار
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          
          {(authError || localError) && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{authError || localError}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                البريد الإلكتروني للإدارة
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@yovodz.com"
                  required
                  className="w-full pl-4 pr-11 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-hidden focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all text-left dir-ltr"
                />
                <Mail className="w-5 h-5 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-4 pr-11 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-hidden focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all text-left dir-ltr"
                />
                <Lock className="w-5 h-5 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-4 bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-slate-950 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جارٍ التحقق...</span>
                </>
              ) : (
                <span>تسجيل الدخول إلى الإدارة</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-700/60 text-center">
            <button
              type="button"
              onClick={onBackToStore}
              className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              <span>العودة إلى متجر Yovo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
