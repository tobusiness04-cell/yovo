import React, { useState, useEffect } from 'react';
import { Check, Copy, ExternalLink, X, AlertCircle } from 'lucide-react';
import { SocialIcon } from './SocialIcon';
import { copyTextToClipboard } from '../../lib/clipboard';

export interface OrderConfirmationData {
  productName: string;
  orderMessage: string;
  platformName: string;
  platformUrl: string;
  platformIcon?: string;
  copiedSuccessfully: boolean;
}

interface OrderConfirmationToastProps {
  data: OrderConfirmationData | null;
  onClose: () => void;
}

export const OrderConfirmationToast: React.FC<OrderConfirmationToastProps> = ({
  data,
  onClose,
}) => {
  const [justCopied, setJustCopied] = useState(false);

  // Auto-dismiss management
  useEffect(() => {
    if (!data) return;

    // For successful copies: auto-dismiss after 2.5 seconds
    // AND dismiss immediately when the user switches away and returns to the tab
    if (data.copiedSuccessfully) {
      const autoDismissTimer = setTimeout(() => {
        onClose();
      }, 2500);

      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          onClose();
        }
      };

      const handleWindowFocus = () => {
        onClose();
      };

      // Slight delay before attaching tab focus listeners so the initial click doesn't trigger dismissal
      const attachTimer = setTimeout(() => {
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', handleWindowFocus);
      }, 400);

      return () => {
        clearTimeout(autoDismissTimer);
        clearTimeout(attachTimer);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('focus', handleWindowFocus);
      };
    }
  }, [data, onClose]);

  if (!data) return null;

  const handleManualCopy = async () => {
    const success = await copyTextToClipboard(data.orderMessage);
    if (success) {
      setJustCopied(true);
      setTimeout(() => setJustCopied(false), 2000);
    }
  };

  const handleCopyAndOpen = async () => {
    await copyTextToClipboard(data.orderMessage);
    if (data.platformUrl) {
      window.open(data.platformUrl, '_blank', 'noopener,noreferrer');
    }
    onClose();
  };

  // 1. Success State: Short confirmation notification (no lingering modal on return)
  if (data.copiedSuccessfully) {
    return (
      <div
        id="order-confirmation-toast"
        className="fixed bottom-5 right-5 left-5 sm:left-auto sm:right-6 sm:w-96 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-auto"
        dir="rtl"
      >
        <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl border border-emerald-500/40 ring-1 ring-emerald-500/20">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>تم نسخ رسالة الطلب ✓ سيتم فتح {data.platformName}</span>
                </h4>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  ألصق الرسالة مباشرة في محادثة الخاص (DM).
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="إغلاق التنبيه"
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Failure State: Graceful manual copy modal (only shown if automatic copy genuinely failed)
  return (
    <div
      id="order-manual-copy-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200 pointer-events-auto"
      dir="rtl"
    >
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-2xl border border-slate-700/80 ring-1 ring-white/10 w-full max-w-md">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                يرجى نسخ رسالة الطلب يدوياً
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                تعذر النسخ التلقائي في متصفحك. انسخ الرسالة أدناه ثم افتح {data.platformName}:
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق النافذة"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 font-mono whitespace-pre-wrap select-all leading-relaxed max-h-40 overflow-y-auto">
          {data.orderMessage}
        </div>

        <div className="mt-4 flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={handleManualCopy}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {justCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">تم النسخ!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>نسخ الرسالة</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleCopyAndOpen}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#006633] to-[#008844] hover:opacity-95 text-white text-xs font-bold inline-flex items-center gap-2 transition-all shadow-md shadow-[#006633]/25 cursor-pointer"
          >
            <SocialIcon icon={data.platformIcon} className="w-3.5 h-3.5" />
            <span>فتح {data.platformName}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
