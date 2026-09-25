import React, { useState, useMemo } from 'react';
import { Expense, ExpenseCategory, Product, AdCampaign } from '../../types';
import { ExpenseFormModal } from './ExpenseFormModal';
import {
  Plus,
  DollarSign,
  Search,
  Filter,
  Trash2,
  Edit,
  Tag,
  Calendar,
  Layers,
  TrendingDown,
} from 'lucide-react';

interface AdminExpensesProps {
  expenses: Expense[];
  products: Product[];
  campaigns: AdCampaign[];
  onSaveExpense: (expense: Partial<Expense>) => Promise<string>;
  onDeleteExpense: (expenseId: string) => Promise<void>;
}

export const AdminExpenses: React.FC<AdminExpensesProps> = ({
  expenses,
  products,
  campaigns,
  onSaveExpense,
  onDeleteExpense,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);

  const categoryLabels: Record<ExpenseCategory, string> = {
    product_purchase: 'شراء اشتراكات',
    advertising: 'إعلانات وحملات',
    payment_fees: 'رسوم دفع',
    domain_hosting: 'دومين واستضافة',
    software: 'أدوات وبرمجيات',
    other: 'مصاريف أخرى',
  };

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesDesc = e.description.toLowerCase().includes(term);
        const matchesNotes = (e.notes || '').toLowerCase().includes(term);
        if (!matchesDesc && !matchesNotes) return false;
      }
      if (selectedCategory !== 'all' && e.category !== selectedCategory) {
        return false;
      }
      return true;
    });
  }, [expenses, searchTerm, selectedCategory]);

  const totalExpensesAmount = useMemo(() => {
    return expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  }, [expenses]);

  const handleEdit = (exp: Expense) => {
    setExpenseToEdit(exp);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setExpenseToEdit(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            إدارة التكاليف والمصروفات
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            تسجيل تكاليف شراء المنتجات، مصاريف الإعلانات، الاشتراكات والبرمجيات لحساب صافي الربح الحقيقي
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddNew}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>تسجيل مصروف جديد</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500 font-bold block mb-1">إجمالي المصروفات المسجلة</span>
            <span className="text-lg font-black text-rose-600">
              {totalExpensesAmount.toLocaleString()} دج
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500 font-bold block mb-1">عدد بنود المصروفات</span>
            <span className="text-lg font-black text-slate-900">{expenses.length}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center border border-slate-200">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500 font-bold block mb-1">مصاريف الإعلانات المسجلة</span>
            <span className="text-lg font-black text-sky-600">
              {expenses
                .filter((e) => e.category === 'advertising')
                .reduce((s, e) => s + (Number(e.amount) || 0), 0)
                .toLocaleString()}{' '}
              دج
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
            <Layers className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث في وصف المصروف أو الملاحظات..."
            className="w-full pr-10 pl-4 py-2 text-xs rounded-xl border border-slate-200 focus:border-sky-500 focus:outline-hidden bg-slate-50/50 focus:bg-white"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:border-sky-500 focus:outline-hidden"
        >
          <option value="all">كل التصنيفات</option>
          {Object.entries(categoryLabels).map(([catKey, label]) => (
            <option key={catKey} value={catKey}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredExpenses.length === 0 ? (
          <div className="py-16 text-center px-4">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 mb-1">
              {expenses.length === 0 ? 'لا توجد مصاريف مسجلة حتى الآن' : 'لا توجد نتائج مطابقة'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              يمكنك البدء بتسجيل تكاليف شراء الاشتراكات من المورد أو مصاريف الإعلانات لحساب الأرباح بدقة.
            </p>
            {expenses.length === 0 && (
              <button
                type="button"
                onClick={handleAddNew}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                تسجيل أول مصروف
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">الوصف</th>
                  <th className="py-3.5 px-4">التصنيف</th>
                  <th className="py-3.5 px-4">المبلغ</th>
                  <th className="py-3.5 px-4">التاريخ</th>
                  <th className="py-3.5 px-4">المنتج / الحملة</th>
                  <th className="py-3.5 px-4 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredExpenses.map((exp) => {
                  const linkedProd = products.find((p) => p.id === exp.productId);
                  const linkedCamp = campaigns.find((c) => c.id === exp.campaignId);

                  return (
                    <tr key={exp.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{exp.description}</div>
                        {exp.notes && (
                          <div className="text-[11px] text-slate-500 mt-0.5">{exp.notes}</div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px] border border-slate-200">
                          {categoryLabels[exp.category] || exp.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-rose-600 text-sm">
                        {Number(exp.amount).toLocaleString()} دج
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                        {exp.date}
                      </td>

                      <td className="py-3.5 px-4 text-[11px] text-slate-600">
                        {linkedProd && (
                          <span className="inline-block px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-100 ml-1">
                            {linkedProd.name}
                          </span>
                        )}
                        {linkedCamp && (
                          <span className="inline-block px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-100">
                            {linkedCamp.name}
                          </span>
                        )}
                        {!linkedProd && !linkedCamp && (
                          <span className="text-slate-400 italic">عام</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleEdit(exp)}
                            className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                            title="تعديل"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm('هل أنت متأكد من حذف هذا المصروف؟')) {
                                onDeleteExpense(exp.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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

      <ExpenseFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onSaveExpense}
        expenseToEdit={expenseToEdit}
        products={products}
        campaigns={campaigns}
      />
    </div>
  );
};
