import React from 'react';
import { Star, StarHalf } from 'lucide-react';
import { formatVnd } from '../../../shared/lib/formatters';

export default function ProductInfo({ product, variantGroups, selectedAttributes, setSelectedAttributes }) {
  const keys = Object.keys(variantGroups || {});

  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">IN STOCK</span>
        <div className="flex items-center text-amber-400 text-sm">
          <Star className="text-sm" fill="currentColor" />
          <Star className="text-sm" fill="currentColor" />
          <Star className="text-sm" fill="currentColor" />
          <Star className="text-sm" fill="currentColor" />
          <StarHalf className="text-sm" fill="currentColor" />
          <span className="text-slate-500 text-xs ml-2">(128 reviews)</span>
        </div>
      </div>

      <h1 className="text-4xl font-black text-slate-900 leading-tight mb-2">
        {product?.name || "Studio Microphone Pro"}
      </h1>

      <div className="flex items-end gap-3 mb-6">
        <span className="text-3xl font-bold text-slate-900">{formatVnd(product?.price || 0)}</span>
      </div>

      <div className="border-l-4 border-blue-200 pl-4 py-1 mb-8">
        <p className="text-slate-600 italic">
          "{product?.desc || "Engineered for clarity. The Fluxify Pro captures every nuance of your performance with studio-grade precision and near-zero self-noise."}"
        </p>
      </div>

      {keys.map((key) => (
        <div className="mb-6" key={key}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-widest">{key}:</span>
            <span className="text-sm text-slate-500">{selectedAttributes?.[key]}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {variantGroups[key].map((option) => (
              <button
                key={option}
                onClick={() => setSelectedAttributes((prev) => ({ ...prev, [key]: option }))}
                className={`px-4 py-2 text-xs font-bold rounded-full border transition-all ${
                  selectedAttributes?.[key] === option
                    ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
