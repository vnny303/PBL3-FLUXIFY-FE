import React, { useMemo, useState } from 'react';
import { useAppContext } from '../../../../../app/providers/useAppContext';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useStorefrontTenant } from '../../../../../features/theme/useStorefrontTenant';
import { productService } from '../../../../../shared/api/productService';
import { reviewService } from '../../../../../shared/api/reviewService';

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
  const [selectedOptions, setSelectedOptions] = useState({});

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

  // 1. Derive dynamic option groups from SKUs (e.g. { color: ['Red', 'Blue'], size: ['S', 'M'] })
  const optionGroups = useMemo(() => {
    if (!product?.skus) return [];
    const groups = {};
    product.skus.forEach(sku => {
      Object.entries(sku.attributes || {}).forEach(([key, value]) => {
        if (!groups[key]) groups[key] = new Set();
        groups[key].add(value);
      });
    });
    return Object.entries(groups).map(([key, values]) => ({
      key: key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      values: Array.from(values)
    }));
  }, [product]);

  // 2. Resolve selectedSku
  const selectedSku = useMemo(() => {
    if (!product?.skus?.length) return null;

    // Case A: Simple product (has SKUs but no variations/attributes)
    if (optionGroups.length === 0) {
      return product.skus[0];
    }
    
    // Case B: Variable product - resolve only when all keys are picked
    const isComplete = optionGroups.every(group => !!selectedOptions[group.key]);
    if (!isComplete) return null;

    return product.skus.find(sku => 
      optionGroups.every(group => sku.attributes[group.key] === selectedOptions[group.key])
    );
  }, [product, selectedOptions, optionGroups]);

  const reviewSkuId = selectedSku?.id
    || selectedSku?.productSkuId
    || selectedSku?.skuId
    || product?.skus?.[0]?.id
    || product?.skus?.[0]?.productSkuId
    || product?.skus?.[0]?.skuId;

  const { data: reviewSummary } = useQuery({
    queryKey: ['review-summary', reviewSkuId],
    queryFn: () => reviewService.getReviewSummary(tenantId, reviewSkuId),
    enabled: !!tenantId && !!reviewSkuId,
    staleTime: 30_000,
  });

  // 3. Ensure quantity doesn't exceed selected SKU stock
  React.useEffect(() => {
    if (selectedSku) {
      if (quantity > selectedSku.stock) {
        setQuantity(Math.max(1, selectedSku.stock));
      } else if (quantity < 1 && selectedSku.stock > 0) {
        setQuantity(1);
      }
    }
  }, [selectedSku, quantity]);

  // Fetch categories to resolve categoryName from ID
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => productService.getCategories(tenantId),
    enabled: !!tenantId,
  });

  const categoryName = useMemo(() => {
    if (!product?.categoryId || !categories.length) return 'Products';
    const found = categories.find(c => c.id === product.categoryId);
    return found ? found.name : 'Products';
  }, [product?.categoryId, categories]);

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
          {productError || 'Product not found'}
        </h1>
        <button onClick={() => navigate('/shop')} className="text-primary font-semibold hover:underline">
          Back to Shop
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
        <button onClick={() => navigate('/shop', { state: { categoryId: product.categoryId } })} className="hover:text-slate-900">
          {categoryName}
        </button>
        <span className="mx-2">›</span>
        <span className="text-slate-900 font-medium truncate max-w-[200px]">{product.name}</span>
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
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
            optionGroups={optionGroups}
            reviewSummary={reviewSummary}
          />
          <ProductActions
            product={product}
            selectedSku={selectedSku}
            quantity={quantity}
            setQuantity={setQuantity}
            selectedOptions={selectedOptions}
            optionGroups={optionGroups}
            addToCart={addToCart}
          />
        </div>
      </div>

      <ProductTabs product={product} selectedSku={selectedSku} />
    </main>
  );
}
