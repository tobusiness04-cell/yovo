import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminLogin } from './AdminLogin';
import { AdminLayout, AdminTab } from './AdminLayout';
import { AdminDashboardHome } from './AdminDashboardHome';
import { AdminOrders } from './AdminOrders';
import { AdminProducts } from './AdminProducts';
import { AdminCategories } from './AdminCategories';
import { AdminExpenses } from './AdminExpenses';
import { AdminAdvertising } from './AdminAdvertising';
import { AdminPriceCalculator } from './AdminPriceCalculator';
import { AdminLandingPages } from './AdminLandingPages';
import { AdminAnalytics } from './AdminAnalytics';
import { AdminSettings } from './AdminSettings';
import { ProductFormModal } from './ProductFormModal';
import {
  Product,
  Category,
  StoreConfig,
  Order,
  Expense,
  AdCampaign,
  LandingPage,
  OrderStatus,
} from '../../types';
import {
  saveProduct,
  deleteProduct,
  toggleProductStatus,
  duplicateProduct,
  saveCategory,
  deleteCategory,
  saveStoreSettings,
  subscribeToOrders,
  updateOrderStatus,
  updateOrderDetails,
  deleteOrder,
  subscribeToExpenses,
  saveExpense,
  deleteExpense,
  subscribeToCampaigns,
  saveCampaign,
  deleteCampaign,
  subscribeToLandingPages,
  saveLandingPage,
  deleteLandingPage,
  toggleLandingPageStatus,
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
  const { isAuthenticated, isAdmin, isLoading, isFirebaseConfigured } = useAdminAuth();
  const [currentTab, setCurrentTab] = useState<AdminTab>('dashboard');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  // Real-time collections for store manager
  const [orders, setOrders] = useState<Order[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);

  useEffect(() => {
    // Only subscribe to protected admin collections once Firebase Auth has completely resolved
    // and confirmed the user is authenticated and authorized in admins/{uid}
    if (isLoading || !isAuthenticated || !isAdmin) return;

    const unsubOrders = subscribeToOrders(setOrders);
    const unsubExpenses = subscribeToExpenses(setExpenses);
    const unsubCampaigns = subscribeToCampaigns(setCampaigns);
    const unsubLandingPages = subscribeToLandingPages(setLandingPages);

    return () => {
      unsubOrders();
      unsubExpenses();
      unsubCampaigns();
      unsubLandingPages();
    };
  }, [isLoading, isAuthenticated, isAdmin]);

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

  if (!isAuthenticated || !isAdmin) {
    return <AdminLogin onBackToStore={onViewStore} />;
  }

  const handleSaveProductFromGlobal = async (payload: Partial<Product>) => {
    await saveProduct(payload);
  };

  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;

  return (
    <AdminLayout
      currentTab={currentTab}
      onSelectTab={setCurrentTab}
      onViewStore={onViewStore}
      pendingOrdersCount={pendingOrdersCount}
    >
      {currentTab === 'dashboard' && (
        <AdminDashboardHome
          products={products}
          categories={categories}
          orders={orders}
          expenses={expenses}
          campaigns={campaigns}
          onNavigateTab={setCurrentTab}
          onOpenAddProduct={() => setIsAddProductModalOpen(true)}
          onViewStore={onViewStore}
          onUpdateOrderStatus={(id, status) => updateOrderStatus(id, status)}
          isFirebaseConfigured={isFirebaseConfigured}
        />
      )}

      {currentTab === 'orders' && (
        <AdminOrders
          orders={orders}
          products={products}
          onUpdateStatus={updateOrderStatus}
          onUpdateDetails={updateOrderDetails}
          onDeleteOrder={deleteOrder}
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

      {currentTab === 'costs' && (
        <AdminExpenses
          expenses={expenses}
          products={products}
          campaigns={campaigns}
          onSaveExpense={saveExpense}
          onDeleteExpense={deleteExpense}
        />
      )}

      {currentTab === 'advertising' && (
        <AdminAdvertising
          campaigns={campaigns}
          products={products}
          orders={orders}
          onSaveCampaign={saveCampaign}
          onDeleteCampaign={deleteCampaign}
        />
      )}

      {currentTab === 'calculator' && (
        <AdminPriceCalculator
          products={products}
          onSaveProduct={saveProduct}
        />
      )}

      {currentTab === 'landing_pages' && (
        <AdminLandingPages
          landingPages={landingPages}
          products={products}
          onSaveLandingPage={saveLandingPage}
          onDeleteLandingPage={deleteLandingPage}
          onToggleStatus={toggleLandingPageStatus}
        />
      )}

      {currentTab === 'analytics' && (
        <AdminAnalytics
          orders={orders}
          expenses={expenses}
          campaigns={campaigns}
          products={products}
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
