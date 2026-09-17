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

  // Auto-dismiss after 12 seconds
  useEffect(() => {
    if (!data) return;
    const timer = setTimeout(() => {
      onClose();
    }, 12000);
    return () => clearTimeout(timer);
  }, [data, onClose]);

  if (!data) return null;

  const handleManualCopy = async () => {
    const success = await copyTextToClipboard(data.orderMessage);
    if (success) {
      setJustCopied(true);
      setTimeout(() => setJustCopied(false), 2500);
    }
  };

  return (
    <div
      id="order-confirmation-toast"
      className="fixed bottom-5 right-5 left-5 sm:left-auto sm:right-6 sm:w-96 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300 pointer-events-auto"
      dir="rtl"
    >
      <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl border border-slate-700/80 ring-1 ring-white/10">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                data.copiedSuccessfully
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              {data.copiedSuccessfully ? (
                <Check className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
            </div>
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>
                  {data.copiedSuccessfully
                    ? 'تم نسخ رسالة الطلب بنجاح ✓'
                    : 'انسخ رسالة الطلب لإتمام الشراء'}
                </span>
              </h4>
              <p className="text-[11px] text-slate-300 mt-0.5">
                افتح <strong className="text-sky-400 font-semibold">{data.platformName}</strong> وألصق الرسالة في الخاص (DM).
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق التنبيه"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message preview snippet */}
        <div className="mt-3 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed relative group font-mono selection:bg-sky-900">
          <div className="line-clamp-2 pr-1">{data.orderMessage}</div>
          <button
            type="button"
            onClick={handleManualCopy}
            className="mt-1.5 text-[10px] font-sans font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors"
          >
            {justCopied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">تم النسخ إلى الحافظة!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>نسخ الرسالة مرة أخرى</span>
              </>
            )}
          </button>
        </div>

        {/* Action button: Direct link to open primary platform in case tab didn't open */}
        {data.platformUrl && (
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
            <span className="text-[10px] text-slate-400">
              لم يفتح التطبيق تلقائياً؟
            </span>
            <a
              href={data.platformUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white text-[11px] font-bold inline-flex items-center gap-1.5 transition-all shadow-xs"
            >
              <SocialIcon icon={data.platformIcon} className="w-3 h-3" />
              <span>افتح {data.platformName}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
