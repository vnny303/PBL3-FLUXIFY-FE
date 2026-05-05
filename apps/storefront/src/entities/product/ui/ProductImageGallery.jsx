import React, { useMemo, useState } from 'react';


export default function ProductImageGallery({ product, selectedSku }) {
  // Collect all images: product images + any extra per-sku imgUrls not already in the list
  const allImages = useMemo(() => {
    const productImgs = (product?.images?.length > 0) ? product.images : (product?.image ? [product.image] : []);
    const skuImgs = (product?.skus || [])
      .map((s) => s.image || s.imgUrl)
      .filter((url) => url && !productImgs.includes(url));
    return [...productImgs, ...skuImgs];
  }, [product]);

  const [activeIdx, setActiveIdx] = useState(0);
  const skuImageIndex = useMemo(() => {
    if (!selectedSku) return -1;
    const skuImage = selectedSku.image || selectedSku.imgUrl;
    if (!skuImage) return -1;
    return allImages.findIndex((img) => img === skuImage);
  }, [selectedSku, allImages]);

  const normalizedActiveIdx = Math.min(activeIdx, Math.max(allImages.length - 1, 0));
  const activeImageIdx = skuImageIndex >= 0 ? skuImageIndex : normalizedActiveIdx;
  const mainImage = allImages[activeImageIdx] || 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=1000';

  return (
    <div className="w-full lg:w-1/2">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 mb-4">
        <img
          src={mainImage}
          alt={product?.name || 'Product image'}
          className="w-full h-full object-cover"
        />

      </div>

      {allImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {allImages.map((url, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                activeImageIdx === i
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
