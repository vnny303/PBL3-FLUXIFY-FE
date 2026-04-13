import React, { useState } from 'react';
import { useAppContext } from '../../../../../app/providers/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';

import ProductImageGallery from '../../../../../entities/product/ui/ProductImageGallery';
import ProductInfo from '../../../../../entities/product/ui/ProductInfo';
import ProductActions from '../../../../../entities/product/ui/ProductActions';
import ProductTabs from '../../../../../entities/product/ui/ProductTabs';

export default function ProductDetail() {
  const { addToCart, selectedProduct, isLoggedIn, toggleWishlist, isWishlisted } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [quantity, setQuantity] = useState(1);
  const [selectedAttributes, setSelectedAttributes] = useState({});

  const handleLoginRedirect = () => {
    navigate('/login', { state: { from: location } });
  };

  return (
    <main className="grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-slate-500 mb-8">
        <a href="#" className="hover:text-slate-900">Store</a>
        <span className="mx-2">›</span>
        <a href="#" className="hover:text-slate-900">{selectedProduct?.categoryId || 'Products'}</a>
        <span className="mx-2">›</span>
        <span className="text-slate-900 font-medium">{selectedProduct?.name || 'Product'}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        <ProductImageGallery
          product={selectedProduct}
          isLoggedIn={isLoggedIn}
          isWishlisted={isWishlisted}
          toggleWishlist={toggleWishlist}
          onLoginRedirect={handleLoginRedirect}
        />

        {/* Right: Product Info & Actions */}
        <div className="w-full lg:w-1/2">
          <ProductInfo
            product={selectedProduct}
            selectedAttributes={selectedAttributes}
            setSelectedAttributes={setSelectedAttributes}
          />

          <ProductActions
            product={selectedProduct}
            quantity={quantity}
            setQuantity={setQuantity}
            selectedAttributes={selectedAttributes}
            addToCart={addToCart}
          />
        </div>
      </div>

      <ProductTabs />
    </main>
  );
}
