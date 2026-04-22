import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../../../app/providers/AppContext';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useStorefrontTenant } from '../../../../../features/theme/useStorefrontTenant';
import { productService } from '../../../../../shared/api/productService';

import ProductImageGallery from '../../../../../entities/product/ui/ProductImageGallery';
import ProductInfo from '../../../../../entities/product/ui/ProductInfo';
import ProductActions from '../../../../../entities/product/ui/ProductActions';
import ProductTabs from '../../../../../entities/product/ui/ProductTabs';

export default function ProductDetail() {
  const { addToCart, products, isLoggedIn, toggleWishlist, isWishlisted } = useAppContext();
  const { tenantId } = useStorefrontTenant();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [quantity, setQuantity] = useState(1);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  
  const [product, setProduct] = useState(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [productError, setProductError] = useState(null);

  useEffect(() => {
    if (!id || !tenantId) return;

    // Cache-first checkout
    const cachedProduct = products?.find(p => String(p.id) === String(id));
    if (cachedProduct) {
      setProduct(cachedProduct);
      setIsLoadingProduct(false);

      // Silent fetch for deeper details (if backend omits skus on listing)
      productService.getProductById(tenantId, id)
        .then(res => setProduct(res))
        .catch(err => console.error("Silent refetch failed:", err));
      return;
    }

    // Explicit fetch if no cache
    setIsLoadingProduct(true);
    setProductError(null);

    productService.getProductById(tenantId, id)
      .then(res => {
        setProduct(res);
      })
      .catch(err => {
        setProductError(err?.response?.data?.message || 'Không tìm thấy sản phẩm');
      })
      .finally(() => {
        setIsLoadingProduct(false);
      });
  }, [id, tenantId, products]);

  // Derived SKU logic
  const skuAttrKeyMatch = (skuAttrs) => {
    return Object.entries(skuAttrs).every(([k, v]) => selectedAttributes[k] === v);
  };
  const selectedSku = product?.skus?.find(s => skuAttrKeyMatch(s.attributes)) || null;

  const handleLoginRedirect = () => {
    navigate('/login', { state: { from: location } });
  };

  if (isLoadingProduct && !product) {
    return (
      <main className="grow container mx-auto px-4 sm:px-6 lg:px-8 py-20 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" style={{ borderBottomColor: 'transparent' }}></div>
      </main>
    );
  }

  if (productError || !product) {
    return (
      <main className="grow container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">{productError || 'Không tìm thấy sản phẩm'}</h1>
        <button onClick={() => navigate('/shop')} className="text-primary font-semibold hover:underline">Quay lại cửa hàng</button>
      </main>
    );
  }

  return (
    <main className="grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-slate-500 mb-8">
        <button onClick={() => navigate('/shop')} className="hover:text-slate-900">Store</button>
        <span className="mx-2">›</span>
        <button onClick={() => navigate('/shop')} className="hover:text-slate-900">{product.categoryId || 'Products'}</button>
        <span className="mx-2">›</span>
        <span className="text-slate-900 font-medium">{product.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        <ProductImageGallery
          product={product}
          selectedSku={selectedSku}
          isLoggedIn={isLoggedIn}
          isWishlisted={isWishlisted}
          toggleWishlist={toggleWishlist}
          onLoginRedirect={handleLoginRedirect}
        />

        {/* Right: Product Info & Actions */}
        <div className="w-full lg:w-1/2">
          <ProductInfo
            product={product}
            selectedSku={selectedSku}
            selectedAttributes={selectedAttributes}
            setSelectedAttributes={setSelectedAttributes}
          />

          <ProductActions
            product={product}
            selectedSku={selectedSku}
            quantity={quantity}
            setQuantity={setQuantity}
            selectedAttributes={selectedAttributes}
            addToCart={addToCart}
          />
        </div>
      </div>

      <ProductTabs product={product} />
    </main>
  );
}
