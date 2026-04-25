import React, { useState, useMemo } from 'react';
import { Sliders, ChevronDown, List, Info, Database } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import ReviewList from './ReviewList';
import { reviewService } from '../../../shared/api/reviewService';
import { useStorefrontTenant } from '../../../features/theme/useStorefrontTenant';

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

export default function ProductTabs({ product, selectedSku }) {
  const [activeTab, setActiveTab] = useState('DETAILS');
  const [openSections, setOpenSections] = useState({ 'Product details': true });
  const { tenantId } = useStorefrontTenant();

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
      specifications: specs
    };
  }, [product]);

  // 2. Review Summary
  const productSkus = product?.productSkus || product?.skus || [];
  const skuIds = Array.from(
    new Set(
      productSkus
        .map((sku) => sku?.id || sku?.productSkuId || sku?.skuId)
        .filter(Boolean)
    )
  );
  const skuIdsKey = skuIds.join('|');
  const selectedSkuId = selectedSku?.id || selectedSku?.productSkuId || selectedSku?.skuId || null;

  const { data: mergedReviews = [] } = useQuery({
    queryKey: ['product-reviews', product?.id, skuIdsKey],
    queryFn: () => reviewService.getProductReviews({
      tenantId,
      productId: product?.id,
      skuIds,
      filters: { pageSize: 200 },
    }),
    enabled: !!tenantId && !!product?.id && skuIds.length > 0,
    staleTime: 30_000,
  });
  const reviewCount = mergedReviews.length;

  const toggleSection = (title) => {
    setOpenSections(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const hasContent = details.description || details.detailSections.length > 0 || details.specifications.length > 0;

  return (
    <div className="mt-20">
      <div className="flex border-b border-slate-200 mb-10 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setActiveTab('DETAILS')}
          className={`pb-4 px-8 text-xs font-bold tracking-widest transition-all relative shrink-0 ${
            activeTab === 'DETAILS' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          DETAILS
          {activeTab === 'DETAILS' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 animate-in fade-in slide-in-from-bottom-1" />
          )}
        </button>
        <button 
          onClick={() => setActiveTab('REVIEWS')}
          className={`pb-4 px-8 text-xs font-bold tracking-widest transition-all relative shrink-0 ${
            activeTab === 'REVIEWS' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          REVIEWS ({reviewCount})
          {activeTab === 'REVIEWS' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 animate-in fade-in slide-in-from-bottom-1" />
          )}
        </button>
      </div>

      {activeTab === 'DETAILS' && (
        <div className="animate-in fade-in duration-500">
          {!hasContent ? (
            <div className="py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <Info className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 italic">No detailed information available for this product.</p>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
              {/* Left Column: Overview + More Info */}
              <div className="flex-1 space-y-12">
                {/* 1. Overview / Description */}
                {details.description && (
                  <section>
                    <h3 className="flex items-center gap-2.5 text-slate-900 font-bold mb-6 text-xl tracking-tight">
                      <Info className="w-5 h-5 text-blue-600" />
                      Overview
                    </h3>
                    <div className="prose prose-slate max-w-none">
                      <p className="text-slate-600 leading-relaxed text-base whitespace-pre-line bg-slate-50/50 p-6 rounded-2xl border border-slate-100 italic">
                        "{details.description}"
                      </p>
                    </div>
                  </section>
                )}

                {/* 2. More Information (Sections) */}
                {details.detailSections && details.detailSections.length > 0 && (
                  <section>
                    <h3 className="flex items-center gap-2.5 text-slate-900 font-bold mb-6 text-lg tracking-tight">
                      <List className="w-5 h-5 text-blue-600" />
                      More Information
                    </h3>
                    <div className="space-y-3">
                      {details.detailSections.map((section, i) => (
                        <div 
                          key={i} 
                          className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm transition-all"
                        >
                          <button 
                            onClick={() => toggleSection(section.title)}
                            className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
                          >
                            <span className="font-bold text-slate-800 text-sm">{section.title}</span>
                            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${openSections[section.title] ? 'rotate-180' : ''}`} />
                          </button>
                          {openSections[section.title] && (
                            <div className="px-6 py-4 border-t border-slate-100 animate-in slide-in-from-top-2 duration-300">
                              <p className="text-sm text-slate-600 leading-relaxed">
                                {section.content}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              {/* Right Column: Specifications */}
              <div className="w-full lg:w-1/3 shrink-0">
                {details.specifications && details.specifications.length > 0 && (
                  <section>
                    <h3 className="flex items-center gap-2.5 text-slate-900 font-bold mb-6 text-lg tracking-tight">
                      <Database className="w-5 h-5 text-blue-600" />
                      Specifications
                    </h3>
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
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
          <ReviewList product={product} selectedSkuId={selectedSkuId} />
        </div>
      )}
    </div>
  );
}
