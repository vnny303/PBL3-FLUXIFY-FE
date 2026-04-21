import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

export default function ProductImageGallery({ product, selectedSku, isLoggedIn, isWishlisted, toggleWishlist, onLoginRedirect }) {
  // Collect all images: product images + any extra per-sku imgUrls not already in the list
  const productImgs = product?.images || (product?.image ? [product.image] : []);
  const skuImgs = (product?.skus || [])
    .map(s => s.image || s.imgUrl)
    .filter(url => url && !productImgs.includes(url));
  const allImages = [...productImgs, ...skuImgs];

  const [activeIdx, setActiveIdx] = useState(0);

  // Default selection when product changes
  useEffect(() => { setActiveIdx(0); }, [product?.id]);

  // Jump to SKU image if selected
  useEffect(() => {
    if (selectedSku) {
      const skuImage = selectedSku.image || selectedSku.imgUrl;
      if (skuImage) {
        const targetIdx = allImages.findIndex(img => img === skuImage);
        if (targetIdx !== -1) setActiveIdx(targetIdx);
      }
    }
  }, [selectedSku, allImages]);

  const mainImage = allImages[activeIdx] || 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=1000';

  return (
    <div className="w-full lg:w-1/2">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 mb-4">
        <img
          src={mainImage}
          alt={product?.name || 'Product image'}
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => {
            const currentProduct = product || { id: 999, name: 'Product', price: 0 };
            if (!isLoggedIn) {
              onLoginRedirect();
              return;
            }
            toggleWishlist(currentProduct);
          }}
          className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-slate-50 transition-all active:scale-95"
        >
          {isWishlisted(product?.id) ? (
            <Heart className="text-red-500" fill="currentColor" />
          ) : (
            <Heart className="text-slate-400" />
          )}
        </button>
      </div>

      {allImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {allImages.map((url, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                activeIdx === i
                  ? 'border-blue-600 ring-2 ring-blue-100'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <img src={url} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
