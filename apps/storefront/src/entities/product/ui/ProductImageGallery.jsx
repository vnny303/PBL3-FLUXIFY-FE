import React, { useMemo, useState } from 'react';
import { useStorefrontConfig } from '../../../features/theme/useStorefrontConfig';


export default function ProductImageGallery({ product, selectedSku }) {
  const { theme } = useStorefrontConfig();
  const primaryColor = theme?.colors?.primary || '#1754cf';
  const borderRadius = theme?.layout?.borderRadius || 12;

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
  const mainImage = allImages[activeImageIdx] || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?auto=format&fit=crop&q=80&w=800';

  return (
    <div className="w-full">
      <div className="relative aspect-[4/3] max-h-[520px] w-full overflow-hidden border border-slate-200 bg-slate-50 mb-4 flex items-center justify-center" style={{ borderRadius: `${borderRadius}px` }}>
        <img
          src={mainImage}
          alt={product?.name || 'Product image'}
          className="w-full h-full object-contain"
        />
      </div>

      {allImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {allImages.map((url, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`w-[72px] h-[72px] sm:w-[88px] sm:h-[88px] shrink-0 overflow-hidden border-2 transition-all ${
                activeImageIdx === i
                  ? 'ring-2'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              style={{
                borderRadius: `${borderRadius}px`,
                borderColor: activeImageIdx === i ? primaryColor : undefined,
                '--tw-ring-color': activeImageIdx === i ? `${primaryColor}26` : undefined,
              }}
            >
              <img src={url} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
