import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import AppPromotion from "./components/AppPromotion";
import "./App.css";

// صفحات ومكونات الإدارة
import AdminDashboard from "./admin/AdminDashboard";
import StatsOverview from "./admin/StatsOverview";
import OrdersTable from "./admin/OrdersTable";
import OrdersSilverTable from "./admin/OrdersSilverTable";
import CustomOrdersPage from "./admin/CustomOrdersPage";
import SpecialOrdersList from "./admin/SpecialOrdersList";
import ProductsList from "./admin/ProductsList";
import ProductForm from "./admin/ProductForm";
import CategoriesList from "./admin/CategoriesList";
import ClientsPage from "./admin/ClientsPage";
import ReviewsPage from "./admin/ReviwsPage";
import ShippingDelivery from "./admin/ShippingDelivery";
import PricingCalculator from "./admin/PricingCalculator";
import AdminsPage from "./admin/AdminsPage";
import AdminForm from "./admin/AdminForm";
import CashieSystem from "./admin/CashieSystem";
import CashierHistory from "./admin/Cashier/CashierHistory";
import OrderDetails from "./admin/Cashier/OrderDetails";
import LoginPage from "./admin/LoginPage";
import VerifyEmail from "./admin/VerifyEmail";

// صفحات الفروع وبوابة الموظفين وسجل الجرد
import BranchLogin from "./branch/BranchLogin";
import BranchPortal from "./branch/BranchPortal";
import BranchesManagement from "./admin/branches/BranchesManagement";
import AdminDailyRegisters from "./admin/branches/AdminDailyRegisters";
import AdminBranchInvoices from "./admin/branches/AdminBranchInvoices";
import InventoryAuditPage from "./admin/branches/InventoryAuditPage";
import AdminAdvancesPage from "./admin/branches/AdminAdvancesPage";
import AdminAttendance from "./admin/branches/AdminAttendance";

// صفحات ومكونات المتجر
import CategoryPage from "./components/CategoryPage";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./ProtectedRoute";
import PrivacyPolicy from "./terms/PrivacyPolicy";
import TermsOfUse from "./terms/TermsOfUse";
import ProductPage from "./components/ProductPage";
import CheckoutPage from "./components/CheckoutPage";
import OrderSuccess from "./components/OrderSuccess";
import SearchResults from "./components/SearchResults";
import CartPage from "./components/CartPage";
import WishlistPage from "./components/WishlistPage";
import ProfilePage from "./components/ProfilePage";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import InvestmentSection from "./components/InvestmentSection";
import SilverCheckout from "./components/SilverCheckout";
import CancellationPolicy from "./terms/CancellationPolicy";
import ShippingDeliveryPage from "./terms/ShippingDeliveryPage";
import CreateOrder from "./components/CreateOrder";
import ProtectedClientRoute from "./ProtectedClientRoute";
import NotFoundPage from "./components/NotFoundPage";
import FloatingActions from "./components/FloatingActions";

// مكون التمرير التلقائي لأعلى الصفحة عند التنقل بين المسارات
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return null;
};

// حاوية أزرار الخدمة العائمة (تظهر فقط في صفحات المتجر للعملاء وتختفي في لوحة الإدارة)
const FloatingActionsWrapper = () => {
  const { pathname } = useLocation();
  if (pathname.startsWith("/admin")) {
    return null;
  }
  return <FloatingActions />;
};

// مكون الصفحة الرئيسية بتصميم فاخر وانسيابي
const HomePage = () => (
  <main className="min-h-screen bg-[#070709] text-white flex flex-col overflow-x-hidden">
    <Navbar />
    <Hero />
    <InvestmentSection />
    <Categories />
    <Testimonials />
    <AppPromotion />
    <Footer />
  </main>
);

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

function AppContent() {
  const { isRTL, language } = useLanguage();

  return (
    <div
      className={`min-h-screen bg-[#070709] text-slate-100 selection:bg-silver-400 selection:text-black antialiased font-cairo`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Router>
        <ScrollToTop />
        <FloatingActionsWrapper />

        {/* تنبيهات النظام بتصميم فاخر يتماشى مع هوية الفضة 925 */}
        <Toaster
          position={isRTL ? "bottom-left" : "bottom-right"}
          toastOptions={{
            duration: 3500,
            style: {
              background: "rgba(15, 15, 18, 0.94)",
              color: "#f4f4f5",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(212, 212, 216, 0.2)",
              boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.7), 0 0 20px rgba(212, 212, 216, 0.1)",
              borderRadius: "16px",
              padding: "12px 20px",
              fontSize: "14px",
              fontFamily: "Cairo, sans-serif",
              fontWeight: "600",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#18181b",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#18181b",
              },
            },
          }}
        />

        <Routes>
          {/* المسارات العامة (متاحة للجميع) */}
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedClientRoute>
                <ProfilePage />
              </ProtectedClientRoute>
            }
          />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/checkout-silver" element={<SilverCheckout />} />
          <Route path="/order-success" element={<OrderSuccess />} />

          {/* مسارات بوابة موظفي الفروع */}
          <Route path="/branch-portal/login" element={<BranchLogin />} />
          <Route path="/branch/login" element={<BranchLogin />} />
          <Route path="/branch-portal" element={<BranchPortal />} />

          <Route path="/custom-order" element={<CreateOrder />} />
          <Route path="/refund-policy" element={<CancellationPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/cancellation-policy" element={<CancellationPolicy />} />
          <Route path="/shipping-delivery" element={<ShippingDeliveryPage />} />
          <Route path="/terms-conditions" element={<TermsOfUse />} />

          {/* مسارات لوحة الإدارة المتكاملة (Nested Admin Routes) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            {/* الشاشة الافتراضية والإحصائيات */}
            <Route index element={<StatsOverview />} />
            <Route path="overview" element={<StatsOverview />} />

            {/* مسارات الفروع وموظفيها وسجلات الجرد والحضور */}
            <Route path="branches" element={<BranchesManagement />} />
            <Route path="employee-attendance" element={<AdminAttendance />} />
            <Route path="employee-advances" element={<AdminAdvancesPage />} />
            <Route path="branch-daily-registers" element={<AdminDailyRegisters />} />
            <Route path="branch-invoices" element={<AdminBranchInvoices />} />
            <Route path="inventory-audits" element={<InventoryAuditPage />} />

            {/* مسارات الطلبات وإدارة العمليات */}
            <Route path="orders" element={<OrdersTable />} />
            <Route path="orders-silver" element={<OrdersSilverTable />} />
            <Route path="custom-orders" element={<CustomOrdersPage />} />
            <Route path="special-orders" element={<SpecialOrdersList />} />

            {/* مسارات المنتجات والتصنيفات */}
            <Route path="products" element={<ProductsList />} />
            <Route path="products/add" element={<ProductForm />} />
            <Route path="products/edit/:id" element={<ProductForm />} />
            <Route path="categories" element={<CategoriesList />} />

            {/* مسارات العملاء والتقييمات والشحن */}
            <Route path="clients" element={<ClientsPage />} />
            <Route path="reviews" element={<ReviewsPage />} />
            <Route path="reviws" element={<ReviewsPage />} />
            <Route path="shipping-delivery" element={<ShippingDelivery />} />
            <Route path="pricing-calculator" element={<PricingCalculator />} />

            {/* مسارات فريق العمل والصلاحيات */}
            <Route path="admins" element={<AdminsPage />} />
            <Route path="employees/add" element={<AdminForm />} />
            <Route path="employees/edit/:id" element={<AdminForm />} />

            {/* مسارات نظام الكاشير ونقاط البيع */}
            <Route path="cashier-system" element={<CashieSystem />} />
            <Route path="cashier-system/history" element={<CashierHistory />} />
            <Route path="cashier-system/orders/:orderId" element={<OrderDetails />} />
          </Route>

          {/* صفحة 404 الفاخرة المخصصة */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;