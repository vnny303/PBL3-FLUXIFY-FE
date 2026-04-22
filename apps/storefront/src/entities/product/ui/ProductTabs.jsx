import React, { useState } from 'react';
import { Activity, Sliders, Package, CheckCircle2, Target, Ear, Plug, Cable, Ruler, Scale, CircleDot, Waves, Zap } from 'lucide-react';
import ReviewList from './ReviewList';

export default function ProductTabs({ product }) {
  const [activeTab, setActiveTab] = useState('DESCRIPTION');
  const reviewCount = product?.numReviews || 0;

  return (
    <div className="mt-20">
      <div className="flex border-b border-slate-200 mb-8">
        {['DESCRIPTION', 'SPECIFICATIONS', `REVIEWS (${reviewCount})`].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 px-6 text-xs font-bold tracking-widest transition-colors relative ${
              activeTab === tab ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'DESCRIPTION' && (
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="w-full lg:w-2/3">
            <h2 className="text-2xl font-black text-slate-900 mb-4">{product?.name || 'Product Details'}</h2>
            <p className="text-slate-600 mb-8 leading-relaxed whitespace-pre-line">
              {product?.description || 'No detailed description is available for this product at this time.'}
            </p>
          </div>
        </div>
      )}

      {activeTab === 'SPECIFICATIONS' && (
        <div className="flex flex-col gap-12">
          <div className="w-full">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-4">
              <Sliders className="text-blue-600" />
              Technical Specifications
            </h3>
            {product?.specifications && product.specifications.length > 0 ? (
              <div className="space-y-3 max-w-2xl">
                {product.specifications.map((spec, i) => (
                  <div key={i} className="flex justify-between py-3 border-b border-slate-100">
                    <span className="text-sm text-slate-500">{spec.name}</span>
                    <span className="text-sm font-bold text-slate-900">{spec.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-600 italic">No technical specifications available for this product.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === `REVIEWS (${reviewCount})` && (
        <ReviewList product={product} />
      )}
    </div>
  );
}
