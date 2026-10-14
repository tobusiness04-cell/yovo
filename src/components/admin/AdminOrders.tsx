import React, { useState, useMemo } from 'react';
import { Order, OrderStatus, Product } from '../../types';
import {
  Search,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Calendar,
  DollarSign,
  TrendingUp,
  User,
  Instagram,
  FileText,
  X,
  Save,
  Trash2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { SocialIcon } from '../common/SocialIcon';

interface AdminOrdersProps {
  orders: Order[];
  products: Product[];
  onUpdateStatus: (orderId: string, status: OrderStatus, notes?: string) => Promise<void>;
  onUpdateDetails: (orderId: string, patch: Partial<Order>) => Promise<void>;
  onDeleteOrder: (orderId: string) => Promise<void>;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({
  orders,
  products,
  onUpdateStatus,
  onUpdateDetails,
  onDeleteOrder,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [productFilter, setProductFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | '7days' | '30days'>('all');

  // Selected Order for Detail / Edit Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editProductCost, setEditProductCost] = useState<number>(0);
  const [editAdCost, setEditAdCost] = useState<number>(0);
  const [editPaymentFee, setEditPaymentFee] = useState<number>(0);
  const [editOtherCosts, setEditOtherCosts] = useState<number>(0);
  const [editNotes, setEditNotes] = useState<string>('');
  const [editCustomerName, setEditCustomerName] = useState<string>('');
  const [editCustomerInstagram, setEditCustomerInstagram] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Status Change Confirmation
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    orderId: string;
    newStatus: OrderStatus;
  } | null>(null);

  const openOrderModal = (order: Order) => {
    setSelectedOrder(order);
    setIsEditing(false);
    setEditProductCost(order.productCost || 0);
    setEditAdCost(order.adCost || 0);
    setEditPaymentFee(order.paymentFee || 0);
    setEditOtherCosts(order.otherCosts || 0);
    setEditNotes(order.notes || '');
    setEditCustomerName(order.customerName || '');
    setEditCustomerInstagram(order.customerInstagram || '');
    setActionError(null);
  };

  const handleSaveOrderDetails = async () => {
    if (!selectedOrder) return;
    setIsSaving(true);
    setActionError(null);
    try {
      const patch: Partial<Order> = {
        productCost: Number(editProductCost) || 0,
        adCost: Number(editAdCost) || 0,
        paymentFee: Number(editPaymentFee) || 0,
        otherCosts: Number(editOtherCosts) || 0,
        notes: editNotes.trim(),
        customerName: editCustomerName.trim(),
        customerInstagram: editCustomerInstagram.trim(),
      };
      await onUpdateDetails(selectedOrder.id, patch);

      // Update local modal state
      const totalCost = (patch.productCost || 0) + (patch.adCost || 0) + (patch.paymentFee || 0) + (patch.otherCosts || 0);
      const profit = selectedOrder.sellingPrice - totalCost;
      setSelectedOrder({
        ...selectedOrder,
        ...patch,
        totalCost,
        profit,
      });
      setIsEditing(false);
    } catch (err: any) {
      setActionError(err.message || 'فشل تحديث بيانات الطلب');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmStatusChange = async () => {
    if (!pendingStatusChange) return;
    setIsSaving(true);
    setActionError(null);
    try {
      await onUpdateStatus(pendingStatusChange.orderId, pendingStatusChange.newStatus);
      if (selectedOrder && selectedOrder.id === pendingStatusChange.orderId) {
        setSelectedOrder({
          ...selectedOrder,
          status: pendingStatusChange.newStatus,
          ...(pendingStatusChange.newStatus === 'completed' ? { completedAt: new Date().toISOString() } : {}),
          ...(pendingStatusChange.newStatus === 'cancelled' ? { cancelledAt: new Date().toISOString() } : {}),
        });
      }
      setPendingStatusChange(null);
    } catch (err: any) {
      setActionError(err.message || 'فشل تغيير حالة الطلب');
    } finally {
      setIsSaving(false);
    }
  };

  // Filter orders
  const filteredOrders = useMemo(() => {
    const now = new Date().getTime();
    return orders.filter((ord) => {
      // Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesId = ord.id.toLowerCase().includes(term);
        const matchesProd = ord.productName.toLowerCase().includes(term);
        const matchesCust = (ord.customerName || '').toLowerCase().includes(term);
        const matchesIg = (ord.customerInstagram || '').toLowerCase().includes(term);
        const matchesNotes = (ord.notes || '').toLowerCase().includes(term);
        if (!matchesId && !matchesProd && !matchesCust && !matchesIg && !matchesNotes) {
          return false;
        }
      }

      // Status
      if (statusFilter !== 'all' && ord.status !== statusFilter) {
        return false;
      }

      // Product
      if (productFilter !== 'all' && ord.productId !== productFilter) {
        return false;
      }

      // Date Filter
      if (dateFilter !== 'all') {
        const orderTime = new Date(ord.createdAt).getTime();
        const diffDays = (now - orderTime) / (1000 * 60 * 60 * 24);
        if (dateFilter === 'today' && diffDays > 1) return false;
        if (dateFilter === '7days' && diffDays > 7) return false;
        if (dateFilter === '30days' && diffDays > 30) return false;
      }

      return true;
    });
  }, [orders, searchTerm, statusFilter, productFilter, dateFilter]);

  // Order summary counts
  const totalCount = orders.length;
  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const completedCount = orders.filter((o) => o.status === 'completed').length;
  const cancelledCount = orders.filter((o) => o.status === 'cancelled').length;

  return (
    <div className="space-y-6">
      {/* Top Header & Quick Status Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            إدارة طلبات الاشتراكات
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            متابعة الطلبات المبدئية عبر إنستغرام، تأكيد الدفعات، واحتساب الأرباح المحققة
          </p>
        </div>

        {/* Quick Filter Status Badges */}
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            الكل ({totalCount})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === 'pending'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white text-amber-700 border border-amber-200 hover:bg-amber-50'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>قيد الانتظار ({pendingCount})</span>
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === 'completed'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>مكتملة ومحققة ({completedCount})</span>
          </button>
          <button
            onClick={() => setStatusFilter('cancelled')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === 'cancelled'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white text-rose-700 border border-rose-200 hover:bg-rose-50'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>ملغاة ({cancelledCount})</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث برقم الطلب، اسم المنتج، اسم الزبون، أو رقم WhatsApp..."
            className="w-full pr-10 pl-4 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 focus:outline-hidden bg-slate-50/50 focus:bg-white transition-colors"
          />
        </div>

        <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center">
          {/* Product Filter */}
          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:border-sky-500 focus:outline-hidden font-medium"
          >
            <option value="all">كل المنتجات</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as any)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:border-sky-500 focus:outline-hidden font-medium"
          >
            <option value="all">كل التواريخ</option>
            <option value="today">اليوم</option>
            <option value="7days">آخر 7 أيام</option>
            <option value="30days">آخر 30 يوماً</option>
          </select>
        </div>
      </div>

      {/* Orders Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center px-4">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Clock className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 mb-1">
              {orders.length === 0 ? 'لا توجد طلبات حتى الآن' : 'لا توجد نتائج مطابقة للبحث'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {orders.length === 0
                ? 'عند قيام الزوار بالنقر على "اطلب الآن" أو إتمام طلب عبر WhatsApp، ستُنشأ الطلبات تلقائياً هنا في حالة "قيد الانتظار".'
                : 'جرّب تعديل معايير البحث أو تصفية الحالة.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">رقم الطلب</th>
                  <th className="py-3.5 px-4">المنتج والخطة</th>
                  <th className="py-3.5 px-4">سعر البيع</th>
                  <th className="py-3.5 px-4">إجمالي التكلفة</th>
                  <th className="py-3.5 px-4">الربح المتوقع/المحقق</th>
                  <th className="py-3.5 px-4">الزبون / وسيلة التواصل</th>
                  <th className="py-3.5 px-4">الحالة</th>
                  <th className="py-3.5 px-4">التاريخ</th>
                  <th className="py-3.5 px-4 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => {
                  const isCompleted = order.status === 'completed';
                  const isPending = order.status === 'pending';
                  const isCancelled = order.status === 'cancelled';

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {order.id}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{order.productName}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">
                            {order.planName}
                          </span>
                          {order.landingPageId && (
                            <span className="text-[10px] text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100">
                              صفحة هبوط
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {order.sellingPrice.toLocaleString()} {order.currency}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {order.totalCost.toLocaleString()} {order.currency}
                        <div className="text-[10px] text-slate-400">
                          شراء: {order.productCost} | إعلان: {order.adCost}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-bold">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] ${
                            isCompleted
                              ? order.profit >= 0
                                ? 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-200'
                                : 'bg-rose-100 text-rose-800'
                              : isPending
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-slate-100 text-slate-400 line-through'
                          }`}
                        >
                          {order.profit.toLocaleString()} {order.currency}
                          {isPending && ' (مبدئي)'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-700">
                        {order.customerPhone || order.customerWhatsApp || order.customerInstagram ? (
                          (() => {
                            const contact = (order.customerPhone || order.customerWhatsApp || order.customerInstagram || '').trim();
                            const isPhone = /^(\+|00|[0-9])/.test(contact) || contact.includes('213');
                            if (isPhone) {
                              const cleanDigits = contact.replace(/[^\d]/g, '');
                              const waDigits = cleanDigits.startsWith('0') && cleanDigits.length === 10 ? '213' + cleanDigits.slice(1) : cleanDigits;
                              return (
                                <a
                                  href={`https://wa.me/${waDigits}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 text-emerald-700 hover:text-emerald-900 font-medium dir-ltr justify-end hover:underline"
                                  title="مراسلة الزبون على WhatsApp"
                                >
                                  <span>{contact}</span>
                                  <SocialIcon icon="whatsapp" className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                </a>
                              );
                            }
                            return (
                              <div className="flex items-center gap-1 text-slate-900 font-medium dir-ltr justify-end">
                                <span>@{contact.replace('@', '')}</span>
                                <Instagram className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                              </div>
                            );
                          })()
                        ) : order.customerName ? (
                          <span>{order.customerName}</span>
                        ) : (
                          <span className="text-slate-400 italic">غير محدد</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {isCompleted && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle className="w-3 h-3" />
                            مكتمل
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            <Clock className="w-3 h-3" />
                            قيد الانتظار
                          </span>
                        )}
                        {isCancelled && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            <XCircle className="w-3 h-3" />
                            ملغي
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {new Date(order.createdAt).toLocaleDateString('ar-DZ', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => openOrderModal(order)}
                            className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                            title="عرض وتعديل التفاصيل والتكاليف"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {isPending && (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  setPendingStatusChange({
                                    orderId: order.id,
                                    newStatus: 'completed',
                                  })
                                }
                                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="تأكيد الدفع واكتمال الطلب"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  setPendingStatusChange({
                                    orderId: order.id,
                                    newStatus: 'cancelled',
                                  })
                                }
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="إلغاء الطلب"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details & Cost Editor Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 relative my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-900">
                    تفاصيل الطلب: {selectedOrder.id}
                  </h3>
                  {selectedOrder.status === 'completed' && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      مكتمل
                    </span>
                  )}
                  {selectedOrder.status === 'pending' && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      قيد الانتظار
                    </span>
                  )}
                  {selectedOrder.status === 'cancelled' && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                      ملغي
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  تم الإنشاء في {new Date(selectedOrder.createdAt).toLocaleString('ar-DZ')}
                  {selectedOrder.completedAt && ` • اكتمل في: ${new Date(selectedOrder.completedAt).toLocaleString('ar-DZ')}`}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {actionError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            {/* Financial Overview Card */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 mb-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div>
                <span className="text-[11px] text-slate-500 block mb-1">سعر البيع</span>
                <span className="text-sm font-black text-slate-900">
                  {selectedOrder.sellingPrice.toLocaleString()} {selectedOrder.currency}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block mb-1">إجمالي التكاليف</span>
                <span className="text-sm font-bold text-slate-700">
                  {(
                    (isEditing ? editProductCost + editAdCost + editPaymentFee + editOtherCosts : selectedOrder.totalCost)
                  ).toLocaleString()} {selectedOrder.currency}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block mb-1">صافي الربح</span>
                <span
                  className={`text-sm font-black ${
                    (isEditing ? selectedOrder.sellingPrice - (editProductCost + editAdCost + editPaymentFee + editOtherCosts) : selectedOrder.profit) >= 0
                      ? 'text-emerald-600'
                      : 'text-rose-600'
                  }`}
                >
                  {(
                    isEditing
                      ? selectedOrder.sellingPrice - (editProductCost + editAdCost + editPaymentFee + editOtherCosts)
                      : selectedOrder.profit
                  ).toLocaleString()} {selectedOrder.currency}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block mb-1">هامش الربح</span>
                <span className="text-sm font-black text-slate-900">
                  {selectedOrder.sellingPrice > 0
                    ? `${(
                        ((isEditing
                          ? selectedOrder.sellingPrice - (editProductCost + editAdCost + editPaymentFee + editOtherCosts)
                          : selectedOrder.profit) /
                          selectedOrder.sellingPrice) *
                        100
                      ).toFixed(1)}%`
                    : '0%'}
                </span>
              </div>
            </div>

            {/* Product & Plan Details */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">المنتج والخطة</label>
                  <div className="p-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-800">
                    {selectedOrder.productName} — <span className="text-sky-600 font-medium">{selectedOrder.planName}</span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">بيانات التواصل (WhatsApp / هاتف / يوزر) أو اسم الزبون</label>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editCustomerInstagram}
                        onChange={(e) => setEditCustomerInstagram(e.target.value)}
                        placeholder="رقم الواتساب / الهاتف أو الحساب"
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-xl bg-white focus:border-sky-500 focus:outline-hidden"
                      />
                      <input
                        type="text"
                        value={editCustomerName}
                        onChange={(e) => setEditCustomerName(e.target.value)}
                        placeholder="اسم الزبون"
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-xl bg-white focus:border-sky-500 focus:outline-hidden"
                      />
                    </div>
                  ) : (
                    <div className="p-3 bg-white border border-slate-200 rounded-xl text-slate-800 flex items-center justify-between">
                      <div>
                        {selectedOrder.customerInstagram || selectedOrder.customerPhone || selectedOrder.customerWhatsApp ? (
                          (() => {
                            const contact = (selectedOrder.customerPhone || selectedOrder.customerWhatsApp || selectedOrder.customerInstagram || '').trim();
                            const isPhone = /^(\+|00|[0-9])/.test(contact) || contact.includes('213');
                            if (isPhone) {
                              const cleanDigits = contact.replace(/[^\d]/g, '');
                              const waDigits = cleanDigits.startsWith('0') && cleanDigits.length === 10 ? '213' + cleanDigits.slice(1) : cleanDigits;
                              return (
                                <a
                                  href={`https://wa.me/${waDigits}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-bold text-emerald-600 hover:text-emerald-800 dir-ltr inline-flex items-center gap-1.5 hover:underline"
                                  title="فتح محادثة WhatsApp"
                                >
                                  <SocialIcon icon="whatsapp" className="w-4 h-4 text-emerald-600" />
                                  <span>{contact} (WhatsApp)</span>
                                </a>
                              );
                            }
                            return (
                              <span className="font-bold text-pink-600 dir-ltr inline-flex items-center gap-1">
                                <Instagram className="w-3.5 h-3.5 text-pink-600" />
                                <span>@{contact.replace('@', '')}</span>
                              </span>
                            );
                          })()
                        ) : (
                          selectedOrder.customerName || <span className="text-slate-400">غير مسجل</span>
                        )}
                      </div>
                      {selectedOrder.customerName && (selectedOrder.customerInstagram || selectedOrder.customerPhone) && (
                        <span className="text-xs text-slate-500 font-medium">{selectedOrder.customerName}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Cost Allocation Editor */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span>توزيع التكاليف الدقيقة لهذا الطلب</span>
                  </h4>
                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="text-xs text-sky-600 hover:text-sky-700 font-bold"
                    >
                      تعديل التكاليف والملاحظات
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-1">تكلفة الشراء (دج)</label>
                    <input
                      type="number"
                      min="0"
                      disabled={!isEditing}
                      value={isEditing ? editProductCost : selectedOrder.productCost}
                      onChange={(e) => setEditProductCost(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-900 font-bold disabled:bg-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-1">حصة الإعلانات (دج)</label>
                    <input
                      type="number"
                      min="0"
                      disabled={!isEditing}
                      value={isEditing ? editAdCost : selectedOrder.adCost}
                      onChange={(e) => setEditAdCost(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-900 font-bold disabled:bg-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-1">رسوم الدفع (دج)</label>
                    <input
                      type="number"
                      min="0"
                      disabled={!isEditing}
                      value={isEditing ? editPaymentFee : selectedOrder.paymentFee}
                      onChange={(e) => setEditPaymentFee(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-900 font-bold disabled:bg-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-1">تكاليف أخرى (دج)</label>
                    <input
                      type="number"
                      min="0"
                      disabled={!isEditing}
                      value={isEditing ? editOtherCosts : selectedOrder.otherCosts}
                      onChange={(e) => setEditOtherCosts(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-900 font-bold disabled:bg-slate-100"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="text-[10px] text-slate-500 block mb-1">ملاحظات الطلب والزبون</label>
                  {isEditing ? (
                    <textarea
                      rows={2}
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="أدخل أي ملاحظات حول تفعيل الحساب أو إثبات الدفع..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:border-sky-500 focus:outline-hidden"
                    />
                  ) : (
                    <div className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 min-h-[36px]">
                      {selectedOrder.notes || <span className="text-slate-400 italic">لا توجد ملاحظات.</span>}
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold transition-colors"
                    >
                      إلغاء التعديل
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveOrderDetails}
                      disabled={isSaving}
                      className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors shadow-xs disabled:opacity-50"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>حفظ التعديلات</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Status Change Buttons in Modal */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-medium">تغيير الحالة:</span>
                  {selectedOrder.status !== 'completed' && (
                    <button
                      type="button"
                      onClick={() =>
                        setPendingStatusChange({
                          orderId: selectedOrder.id,
                          newStatus: 'completed',
                        })
                      }
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>تأكيد الاكتمال والدفع</span>
                    </button>
                  )}

                  {selectedOrder.status !== 'cancelled' && (
                    <button
                      type="button"
                      onClick={() =>
                        setPendingStatusChange({
                          orderId: selectedOrder.id,
                          newStatus: 'cancelled',
                        })
                      }
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>إلغاء الطلب</span>
                    </button>
                  )}

                  {selectedOrder.status !== 'pending' && (
                    <button
                      type="button"
                      onClick={() =>
                        setPendingStatusChange({
                          orderId: selectedOrder.id,
                          newStatus: 'pending',
                        })
                      }
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>إعادة لقيد الانتظار</span>
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('هل أنت متأكد من حذف هذا السجل نهائياً؟')) {
                      onDeleteOrder(selectedOrder.id);
                      setSelectedOrder(null);
                    }
                  }}
                  className="px-3 py-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors font-bold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>حذف السجل</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Status Change */}
      {pendingStatusChange && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-slate-200 text-right animate-in fade-in zoom-in-95">
            <h4 className="text-sm font-black text-slate-900 mb-2">
              {pendingStatusChange.newStatus === 'completed'
                ? 'تأكيد اكتمال الطلب'
                : pendingStatusChange.newStatus === 'cancelled'
                ? 'تأكيد إلغاء الطلب'
                : 'تغيير حالة الطلب'}
            </h4>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              {pendingStatusChange.newStatus === 'completed'
                ? 'سيتم تسجيل تاريخ الاكتمال، واحتساب إيراد وربح هذا الطلب في الإحصائيات المحققة للمتجر.'
                : pendingStatusChange.newStatus === 'cancelled'
                ? 'سيتم استبعاد هذا الطلب من إجمالي الإيرادات والأرباح المحققة.'
                : 'سيتم نقل الطلب إلى قيد الانتظار.'}
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingStatusChange(null)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                تراجع
              </button>
              <button
                type="button"
                onClick={handleConfirmStatusChange}
                disabled={isSaving}
                className={`px-4 py-1.5 rounded-xl text-white text-xs font-bold transition-colors shadow-xs ${
                  pendingStatusChange.newStatus === 'completed'
                    ? 'bg-emerald-600 hover:bg-emerald-500'
                    : pendingStatusChange.newStatus === 'cancelled'
                    ? 'bg-rose-600 hover:bg-rose-500'
                    : 'bg-amber-500 hover:bg-amber-600'
                }`}
              >
                تأكيد التغيير
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
