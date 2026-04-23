import React from 'react';
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
import Wishlist from '../apps/customer/pages/wishlist/ui/Wishlist';

import Modal from '../shared/ui/Modal';
import CartDrawer from '../apps/customer/widgets/CartDrawer';
import AddToCartPopup from '../features/cart-actions/ui/AddToCartPopup';
import QuickAddModal from '../features/cart-actions/ui/QuickAddModal';
import { useAppContext } from './providers/useAppContext';

const MainLayout = () => {
  const { showModal } = useAppContext();

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[var(--color-background-light)] text-slate-900">
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
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="order-confirmation" element={<OrderConfirmation />} />
        </Route>

        <Route element={<CheckoutLayout />}>
          <Route path="/checkout" element={<Checkout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
