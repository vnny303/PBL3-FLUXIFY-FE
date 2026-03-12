import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import About from './pages/About';
import Contact from './pages/Contact';
import ProductDetail from './pages/ProductDetail';
import SignUp from './pages/auth/SignUp';
import Login from './pages/auth/Login';
import AccountPage from './pages/account/AccountPage';
import Modal from './components/Modal';
import CartDrawer from './components/CartDrawer';
import AddToCartPopup from './components/AddToCartPopup';
import { useAppContext } from './contexts/AppContext';

// This layout wraps the main store pages with Header, Footer, and global modals
const StoreLayout = () => {
  const { showModal } = useAppContext();
  
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[var(--color-background-light)] text-slate-900">
      <Header />
      
      {/* 
        The Outlet renders the child route's element. 
        It effectively replaces the 'currentView' conditional rendering.
      */}
      <div className="flex-grow">
        <Outlet /> 
      </div>

      <Footer />

      {/* Global Modals/Drawers */}
      {showModal && <Modal />}
      <CartDrawer />
      <AddToCartPopup />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes (Standalone, without Header/Footer) */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        
        {/* Store Routes (Wrapped with Header/Footer layout) */}
        <Route path="/" element={<StoreLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="account" element={<AccountPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
