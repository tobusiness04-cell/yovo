import React, { useState } from 'react';
import { Product, Category } from '../../types';
import {
  Plus,
  Search,
  Edit2,
  Copy,
  Trash2,
  CheckCircle,
  XCircle,
  Sparkles,
  Zap,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import { formatPrice } from '../../lib/formatters';
import { ProductFormModal } from './ProductFormModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface AdminProductsProps {
  products: Product[];
  categories: Category[];
  onSaveProduct: (product: Partial<Product>) => Promise<string>;
  onDeleteProduct: (productId: string) => Promise<void>;
  onToggleStatus: (productId: string, current: boolean) => Promise<void>;
  onDuplicateProduct: (product: Product) => Promise<string>;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({
  products,
  categories,
  onSaveProduct,
  onDeleteProduct,
  onToggleStatus,
  onDuplicateProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenAdd = () => {
    setProductToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setProductToEdit(product);
    setIsFormModalOpen(true);
  };

  const handleSave = async (payload: Partial<Product>) => {
    await onSaveProduct(payload);
    showToast(payload.id ? 'تم تحديث المنتج بنجاح' : 'تم إضافة المنتج بنجاح');
  };

  const handleDuplicate = async (product: Product) => {
    try {
      setActionLoading(true);
      await onDuplicateProduct(product);
      showToast(`تم إنشاء نسخة من: ${product.name}`);
    } catch (e: any) {
      alert('فشل نسخ المنتج: ' + e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      setActionLoading(true);
      await onDeleteProduct(productToDelete.id);
      showToast('تم حذف المنتج بنجاح');
      setProductToDelete(null);
    } catch (e: any) {
      alert('فشل حذف المنتج: ' + e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggle = async (product: Product) => {
    try {
      await onToggleStatus(product.id, product.available);
      showToast(product.available ? 'تم إيقاف توفر المنتج' : 'تم تفعيل المنتج بنجاح');
    } catch (e: any) {
      alert('فشل تحديث الحالة: ' + e.message);
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6" dir="rtl">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            إدارة الاشتراكات الرقمية
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            إجمالي {products.length} اشتراك متاح في قاعدة البيانات
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-5 py-3 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة اشتراك جديد</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث بالاسم، التصنيف، أو الوصف..."
            className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-sky-500 focus:bg-white transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-48 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden focus:border-sky-500 focus:bg-white"
          >
            <option value="all">كل التصنيفات ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table (Desktop & Tablet) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200/80 font-bold">
              <tr>
                <th className="py-3.5 px-4">الترتيب</th>
                <th className="py-3.5 px-4">الاشتراك</th>
                <th className="py-3.5 px-4">التصنيف</th>
                <th className="py-3.5 px-4">السعر الأساسي</th>
                <th className="py-3.5 px-4">الخطط</th>
                <th className="py-3.5 px-4 text-center">الحالة</th>
                <th className="py-3.5 px-4 text-center">مميز</th>
                <th className="py-3.5 px-4 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    لا توجد منتجات مطابقة لعملية البحث.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    
                    {/* Display Order */}
                    <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                      #{p.displayOrder ?? 99}
                    </td>

                    {/* Product Name & Thumbnail */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                          {p.imageUrl || p.image ? (
                            <img
                              src={p.imageUrl || p.image}
                              alt={p.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80';
                              }}
                            />
                          ) : (
                            <Zap className="w-5 h-5 text-sky-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{p.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{p.slug || p.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-medium">
                        {p.category}
                      </span>
                    </td>

                    {/* Price & Duration */}
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-slate-900">
                        {formatPrice(p.price, p.currency)}
                      </div>
                      <div className="text-[10px] text-slate-400">/{p.duration}</div>
                    </td>

                    {/* Plans Count */}
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] text-slate-600 font-medium">
                        {p.plans && p.plans.length > 0 ? `${p.plans.length} مدد` : 'خطة واحدة'}
                      </span>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggle(p)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                          p.available
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                        }`}
                        title="انقر لتغيير الحالة"
                      >
                        {p.available ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            <span>متوفر</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            <span>غير متوفر</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Popular Badge */}
                    <td className="py-3.5 px-4 text-center">
                      {p.popular ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md text-[10px] font-bold border border-amber-200/60">
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span>الأكثر طلباً</span>
                        </span>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                          title="تعديل المنتج"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicate(p)}
                          disabled={actionLoading}
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="تكرار / نسخ"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setProductToDelete(p)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="حذف المنتج"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <ProductFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSave}
        productToEdit={productToEdit}
        categories={categories}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(productToDelete)}
        title="هل أنت متأكد من حذف هذا المنتج؟"
        message={
          productToDelete
            ? `سيتم حذف اشتراك "${productToDelete.name}" نهائياً من قاعدة البيانات.`
            : ''
        }
        onCancel={() => setProductToDelete(null)}
        onConfirm={handleConfirmDelete}
        isLoading={actionLoading}
      />

    </div>
  );
};
