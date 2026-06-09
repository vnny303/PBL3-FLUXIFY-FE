import React, { useState, useMemo } from 'react';
import { CheckCircle2, ClipboardList, Info, Database, PackageCheck, Target } from 'lucide-react';
import ReviewList from './ReviewList';
import { useStorefrontConfig } from '../../../features/theme/useStorefrontConfig';

const parseMaybeJson = (value, fallback) => {
  if (value === null || value === undefined) return fallback;
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const normalizeSpecifications = (raw) => {
  const parsed = parseMaybeJson(raw, raw);

  if (Array.isArray(parsed)) {
    return parsed
      .map((item) => ({
        name: item?.name || item?.Name || item?.label || item?.Label || item?.key || item?.Key || '',
        value: item?.value ?? item?.Value ?? '',
      }))
      .filter((item) => item.name && String(item.value).trim())
      .map((item) => ({
        name: String(item.name),
        value: Array.isArray(item.value) ? item.value.join(',') : String(item.value),
      }));
  }

  if (parsed && typeof parsed === 'object') {
    return Object.entries(parsed).map(([key, value]) => ({
      name: String(key),
      value: Array.isArray(value) ? value.join(',') : String(value),
    }));
  }

  return [];
};

const normalizeDetailSections = (raw) => {
  const parsed = parseMaybeJson(raw, raw);
  if (!Array.isArray(parsed)) return [];

  return parsed
    .map((section) => ({
      title: section?.title || section?.Title || section?.name || section?.Name || '',
      content: section?.content || section?.Content || section?.description || section?.Description || '',
    }))
    .filter((section) => section.title && section.content);
};

export default function ProductTabs({ 
  product, 
  selectedSku, 
  reviews = [], 
  reviewSummary = {},
  isLoadingReviews = false,
  onRefreshReviews
}) {
  const [activeTab, setActiveTab] = useState('DETAILS');
  const { theme } = useStorefrontConfig();
  const primaryColor = theme?.colors?.primary || '#1754cf';
  const borderRadius = theme?.layout?.borderRadius || 12;

  // 1. Data Merging / Fallbacks
  const details = useMemo(() => {
    const source = product || {};

    const description =
      source.overview ||
      source.Overview ||
      source.description ||
      source.Description ||
      product?.description ||
      '';

    const detailSections = normalizeDetailSections(
      source.detailSections ??
      source.DetailSections ??
      source.detailsSections ??
      source.DetailsSections ??
      source.detail_sections
    );

    let specs = normalizeSpecifications(
      source.specifications ??
      source.Specifications ??
      source.specs ??
      source.Specs ??
      source.productSpecifications ??
      source.product_specifications
    );
    
    // Specifications Fallback Strategy:
    // API specs -> product.attributes -> first SKU attributes
    if (specs.length === 0) {
      const attributes = product?.attributes || product?.skus?.[0]?.attributes || {};
      specs = Object.entries(attributes).map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value: String(value)
      }));
    }

    return {
      description,
      detailSections,
      specifications: specs,
      highlights: Array.isArray(source.highlights) ? source.highlights : [],
      includedItems: Array.isArray(source.includedItems) ? source.includedItems : [],
      bestFor: Array.isArray(source.bestFor) ? source.bestFor : [],
    };
  }, [product]);

  // 2. Review Summary
  const reviewCount = reviews.length;
  const selectedSkuId = selectedSku?.id || selectedSku?.productSkuId || selectedSku?.skuId || null;

  const hasContent = details.description || details.detailSections.length > 0 || details.specifications.length > 0 || details.highlights.length > 0 || details.includedItems.length > 0;

  return (
    <div className="mt-12">
      <div className="flex border-b border-slate-200 mb-10 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setActiveTab('DETAILS')}
          className={`pb-4 px-8 text-xs font-bold tracking-widest transition-all relative shrink-0 ${
            activeTab === 'DETAILS' ? '' : 'text-slate-400 hover:text-slate-600'
          }`}
          style={{ color: activeTab === 'DETAILS' ? primaryColor : undefined }}
        >
          DETAILS
          {activeTab === 'DETAILS' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 animate-in fade-in slide-in-from-bottom-1" style={{ backgroundColor: primaryColor }} />
          )}
        </button>
        <button 
          onClick={() => setActiveTab('REVIEWS')}
          className={`pb-4 px-8 text-xs font-bold tracking-widest transition-all relative shrink-0 ${
            activeTab === 'REVIEWS' ? '' : 'text-slate-400 hover:text-slate-600'
          }`}
          style={{ color: activeTab === 'REVIEWS' ? primaryColor : undefined }}
        >
          REVIEWS ({reviewCount})
          {activeTab === 'REVIEWS' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 animate-in fade-in slide-in-from-bottom-1" style={{ backgroundColor: primaryColor }} />
          )}
        </button>
      </div>

      {activeTab === 'DETAILS' && (
        <div className="animate-in fade-in duration-500">
          {!hasContent ? (
            <div className="py-20 text-center bg-slate-50 border-2 border-dashed border-slate-200" style={{ borderRadius: `${borderRadius}px` }}>
              <Info className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 italic">No detailed information available for this product.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-[1.25fr_0.75fr] gap-8 xl:gap-12">
              <div className="space-y-8">
                {details.description && (
                  <section>
                    <h3 className="flex items-center gap-2.5 text-slate-900 font-bold mb-6 text-xl tracking-tight">
                      <Info className="w-5 h-5" style={{ color: primaryColor }} />
                      Overview
                    </h3>
                    <div className="border border-slate-100 bg-white p-6 shadow-sm" style={{ borderRadius: `${borderRadius}px` }}>
                      <p className="text-slate-600 leading-relaxed text-base whitespace-pre-line">
                        {details.description}
                      </p>
                    </div>
                  </section>
                )}

                {details.highlights.length > 0 && (
                  <section>
                    <h3 className="flex items-center gap-2.5 text-slate-900 font-bold mb-5 text-lg tracking-tight">
                      <CheckCircle2 className="w-5 h-5" style={{ color: primaryColor }} />
                      Why students choose it
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {details.highlights.map((item) => (
                        <div key={item} className="flex items-start gap-3 border border-slate-100 bg-white p-4 shadow-sm" style={{ borderRadius: `${borderRadius}px` }}>
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                          <p className="text-sm text-slate-600 leading-relaxed">{item}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {details.detailSections && details.detailSections.length > 0 && (
                  <section>
                    <h3 className="flex items-center gap-2.5 text-slate-900 font-bold mb-6 text-lg tracking-tight">
                      <ClipboardList className="w-5 h-5" style={{ color: primaryColor }} />
                      Product guide
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {details.detailSections.map((section, i) => (
                        <div 
                          key={i} 
                          className="border border-slate-100 bg-white p-5 shadow-sm"
                          style={{ borderRadius: `${borderRadius}px` }}
                        >
                          <h4 className="font-bold text-slate-900 text-sm mb-2">{section.title}</h4>
                          <p className="text-sm text-slate-600 leading-relaxed">{section.content}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              <div className="space-y-6">
                {details.includedItems.length > 0 && (
                  <section>
                    <h3 className="flex items-center gap-2.5 text-slate-900 font-bold mb-5 text-lg tracking-tight">
                      <PackageCheck className="w-5 h-5" style={{ color: primaryColor }} />
                      What's included
                    </h3>
                    <div className="bg-white border border-slate-100 shadow-sm p-5" style={{ borderRadius: `${borderRadius}px` }}>
                      <div className="grid grid-cols-1 gap-3">
                        {details.includedItems.map((item) => (
                          <div key={item} className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: primaryColor }} />
                            <span className="text-sm font-medium text-slate-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                {details.bestFor.length > 0 && (
                  <section>
                    <h3 className="flex items-center gap-2.5 text-slate-900 font-bold mb-5 text-lg tracking-tight">
                      <Target className="w-5 h-5" style={{ color: primaryColor }} />
                      Best for
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {details.bestFor.map((item) => (
                        <span key={item} className="px-3 py-2 text-sm font-semibold" style={{ borderRadius: `${borderRadius}px`, backgroundColor: `${primaryColor}1A`, color: primaryColor }}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                {details.specifications && details.specifications.length > 0 && (
                  <section>
                    <h3 className="flex items-center gap-2.5 text-slate-900 font-bold mb-6 text-lg tracking-tight">
                      <Database className="w-5 h-5" style={{ color: primaryColor }} />
                      Specifications
                    </h3>
                    <div className="bg-white border border-slate-100 shadow-sm overflow-hidden" style={{ borderRadius: `${borderRadius}px` }}>
                      <table className="w-full text-sm text-left">
                        <tbody className="divide-y divide-slate-50">
                          {details.specifications.map((spec, i) => (
                            <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                              <td className="px-6 py-4 text-slate-500 font-medium w-1/2 group-hover:text-slate-900 transition-colors">
                                {spec.name}
                              </td>
                              <td className="px-6 py-4 text-slate-900 font-bold">
                                {spec.value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'REVIEWS' && (
        <div className="animate-in fade-in duration-500">
          <ReviewList 
            product={product} 
            selectedSkuId={selectedSkuId} 
            reviews={reviews}
            isLoadingReviews={isLoadingReviews}
            onRefresh={onRefreshReviews}
          />
        </div>
      )}
    </div>
  );
}
