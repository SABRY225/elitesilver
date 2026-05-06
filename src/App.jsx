import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import AppPromotion from "./components/AppPromotion";
import AdminDashboard from "./admin/AdminDashboard"; // تأكد من إنشاء هذا الملف
import "./App.css";
import LoginPage from "./admin/LoginPage";
import VerifyEmail from "./admin/VerifyEmail";
import CategoryPage from "./components/CategoryPage";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./ProtectedRoute";
import RefundPolicy from "./terms/RefundPolicy";
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
import PolicyPage from "./terms/PolicyPage";
import CancellationPolicy from "./terms/CancellationPolicy";
import ShippingDeliveryPage from "./terms/ShippingDeliveryPage";
import CreateOrder from "./components/CreateOrder";
import CashieSystem from "./admin/CashieSystem";
import CashierHistory from "./admin/Cashier/CashierHistory";
import OrderDetails from "./admin/Cashier/OrderDetails";
import ProtectedClientRoute from "./ProtectedClientRoute";
import ProductForm from "./admin/ProductForm";
import AdminForm from "./admin/AdminForm";

// مكون الصفحة الرئيسية لتنظيم الكود
const HomePage = () => (
  <>
    <Navbar />
    <Hero />
    <InvestmentSection />
    <Categories />
    <Testimonials />
    <AppPromotion />
    <Footer />
  </>
);

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

function AppContent() {
  const { isRTL } = useLanguage();

  return (
    <div className={isRTL ? 'font-cairo' : 'font-sans'}>
      <Router>
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

          <Route path="/custom-order" element={<CreateOrder />} />
          <Route path="/refund-policy" element={<CancellationPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/cancellation-policy" element={<CancellationPolicy />} />
          <Route path="/shipping-delivery" element={<ShippingDeliveryPage />} />
          <Route path="/terms-conditions" element={<TermsOfUse />} />


          <Route path="/admin">
            <Route path="cashier-system" element={<CashieSystem />} />
            <Route path="cashier-system/history" element={<CashierHistory />} />
            <Route path="cashier-system/orders/:orderId" element={<OrderDetails />} />
            <Route path="products/add" element={<ProductForm />} />
            <Route path="products/edit/:id" element={<ProductForm />} />
            <Route path="employees/add" element={<AdminForm />} />
            <Route path="employees/edit/:id" element={<AdminForm />} />
            <Route
              index
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* صفحة 404 */}
          <Route path="*" element={<div className="text-center py-20">404 - الصفحة غير موجودة</div>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;