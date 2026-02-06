import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppFloat from './components/WhatsAppFloat';
import BackendWakeup from './components/BackendWakeup';
import PageTransition from './components/PageTransition';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ServicesPage from './pages/ServicesPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import MyOrdersPage from './pages/MyOrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ProfilePage from './pages/ProfilePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsConditionsPage from './pages/TermsConditionsPage';
import RefundPolicyPage from './pages/RefundPolicyPage';
import AboutPage from './pages/AboutPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductManagement from './pages/admin/ProductManagement';
import ServiceManagement from './pages/admin/ServiceManagement';
import OrderManagement from './pages/admin/OrderManagement';
import CustomerDatabase from './pages/admin/CustomerDatabase';
import SalesReport from './pages/admin/SalesReport';
import AdminManagement from './pages/admin/AdminManagement';
import AuditLog from './pages/admin/AuditLog';
import WhatsAppTemplates from './pages/admin/WhatsAppTemplates';
import WhatsAppCampaigns from './pages/admin/WhatsAppCampaigns';
import GalleryManagement from './pages/admin/GalleryManagement';
import Analytics from './pages/admin/Analytics';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <BackendWakeup />
          <Routes>
            {/* Admin Login Route (no layout) */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Admin Routes */}
            <Route path="/admin/*" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout>
                  <PageTransition>
                    <Routes>
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="products" element={<ProductManagement />} />
                      <Route path="services" element={<ServiceManagement />} />
                      <Route path="orders" element={<OrderManagement />} />
                      <Route path="customers" element={<CustomerDatabase />} />
                      <Route path="sales-report" element={<SalesReport />} />
                      <Route path="admin-management" element={<AdminManagement />} />
                      <Route path="audit-log" element={<AuditLog />} />
                      <Route path="whatsapp-templates" element={<WhatsAppTemplates />} />
                      <Route path="whatsapp-campaigns" element={<WhatsAppCampaigns />} />
                      <Route path="gallery" element={<GalleryManagement />} />
                      <Route path="analytics" element={<Analytics />} />
                      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                    </Routes>
                  </PageTransition>
                </AdminLayout>
              </ProtectedRoute>
            } />

            {/* Public Routes */}
            <Route path="/*" element={
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="grow">
                  <PageTransition>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/shop" element={<ShopPage />} />
                      <Route path="/shop/:category" element={<ShopPage />} />
                      <Route path="/product/:id" element={<ProductDetailPage />} />
                      <Route path="/services" element={<ServicesPage />} />
                      <Route path="/gallery" element={<GalleryPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/signup" element={<SignUpPage />} />
                      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                      <Route path="/reset-password" element={<ResetPasswordPage />} />
                      <Route path="/my-orders" element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />
                      <Route path="/order/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
                      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                      <Route path="/terms-conditions" element={<TermsConditionsPage />} />
                      <Route path="/refund-policy" element={<RefundPolicyPage />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </PageTransition>
                </main>
                <Footer />
                <WhatsAppFloat />
              </div>
            } />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
