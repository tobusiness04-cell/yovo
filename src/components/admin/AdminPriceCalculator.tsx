import React, { useState } from 'react';
import { Product, ProductPlan } from '../../types';
import {
  Calculator,
  ArrowRight,
  Sparkles,
  HelpCircle,
  CheckCircle,
  AlertTriangle,
  Save,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

interface AdminPriceCalculatorProps {
  products: Product[];
  onSaveProduct: (product: Partial<Product>) => Promise<string>;
}

export const AdminPriceCalculator: React.FC<AdminPriceCalculatorProps> = ({
  products,
  onSaveProduct,
}) => {
  // Inputs
  const [purchaseCost, setPurchaseCost] = useState<number>(300);
  const [adCost, setAdCost] = useState<number>(150);
  const [paymentFee, setPaymentFee] = useState<number>(30);
  const [otherCosts, setOtherCosts] = useState<number>(20);
  const [targetMargin, setTargetMargin] = useState<number>(40); // 40%

  // Pre-fill selection
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');

  // Status message
  const [applySuccess, setApplySuccess] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  // Calculations
  const totalCost = (Number(purchaseCost) || 0) + (Number(adCost) || 0) + (Number(paymentFee) || 0) + (Number(otherCosts) || 0);

  // Mathematically correct Profit Margin Formula:
  // Selling Price = Total Cost / (1 - Target Margin)
  const marginDecimal = Math.min(Math.max((Number(targetMargin) || 0) / 100, 0), 0.95);
  const recommendedPrice = marginDecimal < 1 ? Math.round(totalCost / (1 - marginDecimal)) : 0;
  const netProfit = recommendedPrice - totalCost;
  const actualMarginPercent = recommendedPrice > 0 ? ((netProfit / recommendedPrice) * 100).toFixed(1) : '0';

  // Flawed Markup comparison (Markup = Cost * (1 + M))
  const markupPrice = Math.round(totalCost * (1 + (Number(targetMargin) || 0) / 100));
  const markupProfit = markupPrice - totalCost;
  const markupRealMargin = markupPrice > 0 ? ((markupProfit / markupPrice) * 100).toFixed(1) : '0';

  // Pre-fill from selected product/plan
  const handleProductSelect = (prodId: string) => {
    setSelectedProductId(prodId);
    setApplySuccess(null);
    const prod = products.find((p) => p.id === prodId);
    if (!prod) return;

    if (prod.plans && prod.plans.length > 0) {
      const firstPlan = prod.plans[0];
      setSelectedPlanId(firstPlan.id);
      loadPlanData(prod, firstPlan);
    } else {
      setSelectedPlanId('');
      setPurchaseCost(prod.purchaseCost || 0);
      setAdCost(prod.adCost || 0);
      setOtherCosts(prod.otherCosts || 0);
      if (prod.targetMargin) setTargetMargin(prod.targetMargin);
    }
  };

  const handlePlanSelect = (planId: string) => {
    setSelectedPlanId(planId);
    setApplySuccess(null);
    const prod = products.find((p) => p.id === selectedProductId);
    if (!prod) return;
    const plan = prod.plans?.find((p) => p.id === planId);
    if (plan) {
      loadPlanData(prod, plan);
    }
  };

  const loadPlanData = (prod: Product, plan: ProductPlan) => {
    const pCost = plan.purchaseCost !== undefined ? plan.purchaseCost : (prod.purchaseCost || 0);
    const aCost = plan.adCost !== undefined ? plan.adCost : (prod.adCost || 0);
    const oCost = plan.otherCost !== undefined ? plan.otherCost : (prod.otherCosts || 0);
    setPurchaseCost(pCost);
    setAdCost(aCost);
    setPaymentFee(0);
    setOtherCosts(oCost);
    if (prod.targetMargin) setTargetMargin(prod.targetMargin);
  };

  // Direct Apply to product plan
  const handleApplyToProduct = async () => {
    if (!selectedProductId || !selectedPlanId) return;
    const prod = products.find((p) => p.id === selectedProductId);
    if (!prod) return;

    try {
      setIsApplying(true);
      setApplySuccess(null);

      const updatedPlans = prod.plans.map((pl) => {
        if (pl.id === selectedPlanId) {
          return {
            ...pl,
            price: recommendedPrice,
            purchaseCost,
            adCost,
            otherCost: otherCosts,
          };
        }
        return pl;
      });

      await onSaveProduct({
        ...prod,
        purchaseCost,
        adCost,
        otherCosts,
        targetMargin,
        plans: updatedPlans,
      });

      setApplySuccess(`تم بنجاح تحديث سعر الخطة إلى ${recommendedPrice.toLocaleString()} دج!`);
    } catch (err: any) {
      alert(err.message || 'حدث خطأ أثناء تطبيق السعر.');
    } finally {
      setIsApplying(false);
    }
  };

  const currentProd = products.find((p) => p.id === selectedProductId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Calculator className="w-6 h-6 text-emerald-600" />
          <span>حاسبة التسعير الذكي وهوامش الربح</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          تسعير اشتراكاتك بالمعادلة الرياضية الدقيقة لهامش الربح (Profit Margin) لتجنب فخ التسعير الخاسر
        </p>
      </div>

      {/* Pre-fill Picker */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <span className="text-xs font-bold text-slate-700 whitespace-nowrap">
          تحميل بيانات اشتراك وخطة موجودة:
        </span>
        <select
          value={selectedProductId}
          onChange={(e) => handleProductSelect(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:border-emerald-500 focus:outline-hidden"
        >
          <option value="">اختر اشتراكاً...</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        {currentProd && currentProd.plans?.length > 0 && (
          <select
            value={selectedPlanId}
            onChange={(e) => handlePlanSelect(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:border-emerald-500 focus:outline-hidden"
          >
            {currentProd.plans.map((pl) => (
              <option key={pl.id} value={pl.id}>
                الخطة: {pl.duration} (الحالي: {pl.price} دج)
              </option>
            ))}
          </select>
        )}
      </div>

      {applySuccess && (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{applySuccess}</span>
        </div>
      )}

      {/* Main Grid: Inputs vs Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Input Parameters (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-slate-500" />
            <span>مدخلات التكاليف وهامش الربح</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                1. تكلفة شراء الاشتراك من المورد (دج)
              </label>
              <input
                type="number"
                min="0"
                value={purchaseCost}
                onChange={(e) => {
                  setPurchaseCost(Number(e.target.value));
                  setApplySuccess(null);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-bold focus:border-emerald-500 focus:outline-hidden bg-slate-50/50"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                سعر الحساب الفردي أو حصة الحساب من المورد
              </span>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                2. ميزانية الإعلانات المقدرة للبيع الواحد (دج)
              </label>
              <input
                type="number"
                min="0"
                value={adCost}
                onChange={(e) => {
                  setAdCost(Number(e.target.value));
                  setApplySuccess(null);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-bold focus:border-emerald-500 focus:outline-hidden bg-slate-50/50"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                حصة إعلانات فيسبوك / إنستغرام لكل زبون (CAC)
              </span>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                3. رسوم وعمولات تحويل الدفع (دج)
              </label>
              <input
                type="number"
                min="0"
                value={paymentFee}
                onChange={(e) => {
                  setPaymentFee(Number(e.target.value));
                  setApplySuccess(null);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-bold focus:border-emerald-500 focus:outline-hidden bg-slate-50/50"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                رسوم بريدي موب أو CCP أو أي عمولة تحويل
              </span>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                4. تكاليف تشغيلية أخرى (دج)
              </label>
              <input
                type="number"
                min="0"
                value={otherCosts}
                onChange={(e) => {
                  setOtherCosts(Number(e.target.value));
                  setApplySuccess(null);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-bold focus:border-emerald-500 focus:outline-hidden bg-slate-50/50"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                حصته من الدومين، السيرفر، الدعم الفني
              </span>
            </div>
          </div>

          {/* Target Margin Slider / Input */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800">
                هامش الربح الصافي المستهدف (Target Profit Margin %)
              </label>
              <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                {targetMargin}%
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="85"
              step="1"
              value={targetMargin}
              onChange={(e) => {
                setTargetMargin(Number(e.target.value));
                setApplySuccess(null);
              }}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>5% (أدنى ربح)</span>
              <span>40% (متوسط متزن)</span>
              <span>85% (أعلى ربح)</span>
            </div>
          </div>

          {/* Total Cost Breakdown */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 block">إجمالي تكلفة الوحدة الكاملة (Total Cost):</span>
              <span className="text-[11px] text-slate-400">
                {purchaseCost} (شراء) + {adCost} (إعلان) + {paymentFee} (رسوم) + {otherCosts} (أخرى)
              </span>
            </div>
            <span className="text-base font-black text-slate-900">
              {totalCost.toLocaleString()} دج
            </span>
          </div>
        </div>

        {/* Right Side: Recommended Output & Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Main Recommended Price Card */}
          <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white p-6 rounded-3xl shadow-xl border border-emerald-900/40 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                سعر البيع الموصى به
              </span>
              <span className="text-[11px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Margin {actualMarginPercent}%
              </span>
            </div>

            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
              {recommendedPrice.toLocaleString()}{' '}
              <span className="text-lg font-bold text-emerald-400">دج</span>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-800 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>صافي الربح المتوقع للطلب:</span>
                <span className="font-bold text-emerald-400 text-sm">
                  +{netProfit.toLocaleString()} دج
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>التكلفة الإجمالية المخصومة:</span>
                <span>-{totalCost.toLocaleString()} دج</span>
              </div>
            </div>

            {/* Apply Button */}
            {selectedProductId && selectedPlanId && (
              <div className="mt-5 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleApplyToProduct}
                  disabled={isApplying}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-md disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>تطبيق هذا السعر على الخطة المختارة</span>
                </button>
              </div>
            )}
          </div>

          {/* Margin vs Markup Visual Comparison */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
              <HelpCircle className="w-4 h-4 text-sky-600" />
              <span>الفرق الحاسم: الهامش (Margin) مقابل الزيادة (Markup)</span>
            </h4>

            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2 text-[11px] text-slate-700 leading-relaxed">
              <p>
                <strong>تحذير تجاري شائع:</strong> استخدام صيغة الزيادة البسيطة{' '}
                <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-mono">
                  التكلفة × (1 + {targetMargin}%)
                </code>{' '}
                يعطيك سعراً قدره <strong>{markupPrice.toLocaleString()} دج</strong>، ولكن هامش الربح الحقيقي سيكون فقط{' '}
                <strong className="text-rose-600">{markupRealMargin}%</strong> وليس {targetMargin}%!
              </p>
              <p>
                بينما المعادلة الصحيحة التي نستخدمها:{' '}
                <code className="bg-emerald-100 px-1 py-0.5 rounded text-emerald-900 font-mono">
                  السعر = التكلفة ÷ (1 - {targetMargin / 100})
                </code>{' '}
                تضمن لك تحقيق نسبة {targetMargin}% بالتمام والكمال من سعر البيع الإجمالي.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
