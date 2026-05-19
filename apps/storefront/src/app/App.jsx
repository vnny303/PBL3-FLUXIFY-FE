import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';

import Header from '../apps/customer/widgets/Header';
import Footer from '../apps/customer/widgets/Footer';
import CheckoutLayout from '../apps/customer/widgets/CheckoutLayout';

import Home from '../apps/customer/pages/home/ui/Home';
import Shop from '../apps/customer/pages/shop/ui/Shop';
import About from '../apps/customer/pages/about/ui/About';
import Contact from '../apps/customer/pages/contact/ui/Contact';
import ProductDetail from '../apps/customer/pages/product-detail/ui/ProductDetail';
import SignUp from '../apps/customer/pages/auth/ui/SignUp';
import Login from '../apps/customer/pages/auth/ui/Login';
import AccountPage from '../apps/customer/pages/account/ui/AccountPage';
import Checkout from '../apps/customer/pages/checkout/ui/Checkout';
import OrderConfirmation from '../apps/customer/pages/order-confirmation/ui/OrderConfirmation';


import Modal from '../shared/ui/Modal';
import CartDrawer from '../apps/customer/widgets/CartDrawer';
import AddToCartPopup from '../features/cart-actions/ui/AddToCartPopup';
import QuickAddModal from '../features/cart-actions/ui/QuickAddModal';
import { useAppContext } from './providers/useAppContext';
import { useStorefrontConfig } from '../features/theme/useStorefrontConfig';

const ThemeGlobalWrapper = ({ children }) => {
  const { theme } = useStorefrontConfig();

  useEffect(() => {
    if (!theme) return;
    
    const root = document.documentElement;
    if (theme.colors?.primary) {
      root.style.setProperty('--color-primary', theme.colors.primary);
    }
    if (theme.colors?.background) {
      root.style.setProperty('--color-background-light', theme.colors.background);
      document.body.style.backgroundColor = theme.colors.background;
    }
    if (theme.colors?.text) {
      root.style.setProperty('--color-text', theme.colors.text);
      document.body.style.color = theme.colors.text;
    }
    if (theme.typography?.fontFamily) {
      const font = theme.typography.fontFamily;
      root.style.setProperty('--font-sans', `"${font}", ui-sans-serif, system-ui, sans-serif`);
      document.body.style.fontFamily = `"${font}", ui-sans-serif, system-ui, sans-serif`;

      // Dynamically load Google Font
      const fontId = 'storefront-google-font';
      let link = document.getElementById(fontId);
      if (!link) {
        link = document.createElement('link');
        link.id = fontId;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
      link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}:wght@300;400;500;600;700;800;900&display=swap`;
    }
  }, [theme]);

  return children;
};

const MainLayout = () => {
  const { showModal } = useAppContext();
  const { theme } = useStorefrontConfig();

  const bgColor = theme?.colors?.background || '#ffffff';
  const textColor = theme?.colors?.text || '#111827';

  return (
    <div 
      className="min-h-screen flex flex-col font-sans transition-colors duration-500"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <Header />
      <div className="grow">
        <Outlet />
      </div>
      <Footer />

      {showModal && <Modal />}
      <CartDrawer />
      <AddToCartPopup />
      <QuickAddModal />
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default function App() {
  return (
    <ThemeGlobalWrapper>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="account" element={<AccountPage />} />

            <Route path="order-confirmation" element={<OrderConfirmation />} />
          </Route>

          <Route element={<CheckoutLayout />}>
            <Route path="/checkout" element={<Checkout />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeGlobalWrapper>
  );
}
