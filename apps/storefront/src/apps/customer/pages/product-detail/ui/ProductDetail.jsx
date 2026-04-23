import React, { useMemo, useState } from 'react';
import { useAppContext } from '../../../../../app/providers/useAppContext';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
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

  // Dùng Redux catalog làm initialData — hiện ngay không cần loader
  const cachedProduct = useMemo(
    () => products?.find((p) => String(p.id) === String(id)) || undefined,
    [products, id]
  );

  const {
    data: product,
    isLoading: isLoadingProduct,
    error: productErrorObj,
  } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(tenantId, id),
    enabled: !!id && !!tenantId,
    initialData: cachedProduct,   // Dùng cache Redux làm placeholder khi chưa fetch xong
    staleTime: 0,                 // Luôn refetch để lấy SKU đầy đủ từ detail endpoint
  });

  const productError = productErrorObj?.response?.data?.message
    || productErrorObj?.message
    || null;

  // Derived SKU logic
  const skuAttrKeyMatch = (skuAttrs) =>
    Object.entries(skuAttrs).every(([k, v]) => selectedAttributes[k] === v);

  const selectedSku = product?.skus?.find((s) => skuAttrKeyMatch(s.attributes)) || null;

  const handleLoginRedirect = () => {
    navigate('/login', { state: { from: location } });
  };

  if (isLoadingProduct && !product) {
    return (
      <main className="grow container mx-auto px-4 sm:px-6 lg:px-8 py-20 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" style={{ borderBottomColor: 'transparent' }} />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="grow container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">
          {productError || 'Không tìm thấy sản phẩm'}
        </h1>
        <button onClick={() => navigate('/shop')} className="text-primary font-semibold hover:underline">
          Quay lại cửa hàng
        </button>
      </main>
    );
  }

  return (
    <main className="grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-slate-500 mb-8">
        <button onClick={() => navigate('/shop')} className="hover:text-slate-900">Store</button>
        <span className="mx-2">›</span>
        <button onClick={() => navigate('/shop')} className="hover:text-slate-900">
          {product.categoryId || 'Products'}
        </button>
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
