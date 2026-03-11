/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Home from './Home';
import Shop from './Shop';
import About from './About';
import Contact from './Contact';
import Modal from './Modal';
import ProductDetail from './ProductDetail';
import CartDrawer from './CartDrawer';
import AddToCartPopup from './AddToCartPopup';
import { useAppContext } from './AppContext';

export default function App() {
  const { currentView, showModal, showCart, showAddToCartPopup } = useAppContext();

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[var(--color-background-light)] text-slate-900">
      <Header />
      
      {currentView === 'home' && <Home />}
      {currentView === 'shop' && <Shop />}
      {currentView === 'product' && <ProductDetail />}
      {currentView === 'about' && <About />}
      {currentView === 'contact' && <Contact />}

      <Footer />

      {showModal && <Modal />}
      <CartDrawer />
      <AddToCartPopup />
    </div>
  );
}



