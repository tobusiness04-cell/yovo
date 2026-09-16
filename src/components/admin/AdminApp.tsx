import React, { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminLogin } from './AdminLogin';
import { AdminLayout } from './AdminLayout';
import { AdminDashboardHome } from './AdminDashboardHome';
import { AdminProducts } from './AdminProducts';
import { AdminCategories } from './AdminCategories';
import { AdminSettings } from './AdminSettings';
import { ProductFormModal } from './ProductFormModal';
import { Product, Category, StoreConfig } from '../../types';
import {
  saveProduct,
  deleteProduct,
  toggleProductStatus,
  duplicateProduct,
  saveCategory,
  deleteCategory,
  saveStoreSettings,
} from '../../services/storeService';
import { Loader2 } from 'lucide-react';

interface AdminAppProps {
  products: Product[];
  categories: Category[];
  settings: StoreConfig;
  onViewStore: () => void;
}

export const AdminApp: React.FC<AdminAppProps> = ({
  products,
  categories,
  settings,
  onViewStore,
}) => {
  const { isAuthenticated, isLoading, isFirebaseConfigured } = useAdminAuth();
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'products' | 'categories' | 'settings'>('dashboard');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white" dir="rtl">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
          <span className="text-xs text-slate-400 font-medium">جارٍ التحقق من صلاحيات الدخول...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onBackToStore={onViewStore} />;
  }

  const handleSaveProductFromGlobal = async (payload: Partial<Product>) => {
    await saveProduct(payload);
  };

  return (
    <AdminLayout
      currentTab={currentTab}
      onSelectTab={setCurrentTab}
      onViewStore={onViewStore}
    >
      {currentTab === 'dashboard' && (
        <AdminDashboardHome
          products={products}
          categories={categories}
          onNavigateTab={setCurrentTab}
          onOpenAddProduct={() => setIsAddProductModalOpen(true)}
          onViewStore={onViewStore}
          isFirebaseConfigured={isFirebaseConfigured}
        />
      )}

      {currentTab === 'products' && (
        <AdminProducts
          products={products}
          categories={categories}
          onSaveProduct={saveProduct}
          onDeleteProduct={deleteProduct}
          onToggleStatus={toggleProductStatus}
          onDuplicateProduct={duplicateProduct}
        />
      )}

      {currentTab === 'categories' && (
        <AdminCategories
          categories={categories}
          onSaveCategory={saveCategory}
          onDeleteCategory={deleteCategory}
        />
      )}

      {currentTab === 'settings' && (
        <AdminSettings
          settings={settings}
          onSaveSettings={saveStoreSettings}
        />
      )}

      {/* Global Quick Add Product Modal */}
      <ProductFormModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onSave={handleSaveProductFromGlobal}
        categories={categories}
      />
    </AdminLayout>
  );
};
