import React, { useMemo, useState, useEffect } from 'react';
import { useAppContext } from '../../../../../app/providers/AppContext';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { productService } from '../../../../../shared/api/productService';
import { getLowestPriceSku, getVariantGroups, findSkuBySelection } from '../../../../../shared/lib/product';
import { buildLoginPath, extractSubdomainFromPath, resolveActiveSubdomain, STORAGE_KEYS } from '../../../../../shared/lib/constants';

import ProductImageGallery from '../../../../../entities/product/ui/ProductImageGallery';
import ProductInfo from '../../../../../entities/product/ui/ProductInfo';
import ProductActions from '../../../../../entities/product/ui/ProductActions';
import ProductTabs from '../../../../../entities/product/ui/ProductTabs';

export default function ProductDetail() {
  const { addToCart, selectedProduct, isLoggedIn, toggleWishlist, isWishlisted, tenant } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [product, setProduct] = useState(selectedProduct);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedAttributes, setSelectedAttributes] = useState({});

  useEffect(() => {
    const loadProduct = async () => {
      if (!tenant?.id || !id) return;
      if (selectedProduct?.id === id) {
        setProduct(selectedProduct);
        return;
      }

      try {
        setLoading(true);
        const loadedProduct = await productService.getProductById(tenant.id, id, {
          subdomain: tenant.subdomain || undefined,
        });
        setProduct(loadedProduct);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [tenant?.id, id, selectedProduct]);

  const variantGroups = useMemo(() => getVariantGroups(product), [product]);

  useEffect(() => {
    const next = {};
    for (const [key, values] of Object.entries(variantGroups)) {
      if (values.length > 0) next[key] = values[0];
    }
    setSelectedAttributes(next);
  }, [variantGroups]);

  const selectedSku = useMemo(() => {
    const matched = findSkuBySelection(product, selectedAttributes);
    return matched || getLowestPriceSku(product);
  }, [product, selectedAttributes]);

  const selectedProductWithSku = useMemo(() => {
    if (!product) return null;
    return {
      ...product,
      selectedSku,
      price: selectedSku?.price || product.price,
    };
  }, [product, selectedSku]);

  const handleLoginRedirect = () => {
    const subdomain = resolveActiveSubdomain(
      extractSubdomainFromPath(location.pathname),
      tenant?.subdomain,
      localStorage.getItem(STORAGE_KEYS.SUBDOMAIN),
      import.meta.env.VITE_DEFAULT_SUBDOMAIN,
    );
    navigate(buildLoginPath(subdomain), { state: { from: location } });
  };

  if (loading) {
    return <main className="grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">Đang tải sản phẩm...</main>;
  }

  if (!selectedProductWithSku) {
    return <main className="grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">Không tìm thấy sản phẩm.</main>;
  }

  return (
    <main className="grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-slate-500 mb-8">
        <a href="#" className="hover:text-slate-900">Store</a>
        <span className="mx-2">›</span>
        <a href="#" className="hover:text-slate-900">Audio Gear</a>
        <span className="mx-2">›</span>
        <span className="text-slate-900 font-medium">Studio Microphone Pro</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        <ProductImageGallery 
          product={selectedProductWithSku}
          isLoggedIn={isLoggedIn}
          isWishlisted={isWishlisted}
          toggleWishlist={toggleWishlist}
          onLoginRedirect={handleLoginRedirect}
        />

        {/* Right: Product Info & Actions */}
        <div className="w-full lg:w-1/2">
          <ProductInfo 
            product={selectedProductWithSku}
            variantGroups={variantGroups}
            selectedAttributes={selectedAttributes}
            setSelectedAttributes={setSelectedAttributes}
          />
          
          <ProductActions 
            product={selectedProductWithSku}
            quantity={quantity}
            setQuantity={setQuantity}
            addToCart={addToCart}
          />
        </div>
      </div>

      <ProductTabs />
    </main>
  );
}
