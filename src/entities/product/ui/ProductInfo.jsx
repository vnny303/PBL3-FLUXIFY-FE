import React from 'react';
import { Star, StarHalf } from 'lucide-react';

export default function ProductInfo({ product, selectedColor, setSelectedColor, selectedSize, setSelectedSize }) {
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
        {product?.name || "Studio Microphone Pro"}<br />
        <span className="text-blue-600">2024 Edition</span>
      </h1>

      <div className="flex items-end gap-3 mb-6">
        <span className="text-3xl font-bold text-slate-900">{product?.price || "$299.00"}</span>
        <span className="text-lg text-slate-400 line-through mb-1">$349.00</span>
      </div>

      <div className="border-l-4 border-blue-200 pl-4 py-1 mb-8">
        <p className="text-slate-600 italic">
          "{product?.desc || "Engineered for clarity. The Fluxify Pro captures every nuance of your performance with studio-grade precision and near-zero self-noise."}"
        </p>
      </div>

      {/* Color Selection */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-widest">COLOR:</span>
          <span className="text-sm text-slate-500">{selectedColor}</span>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setSelectedColor('Deep Black')} className={`w-8 h-8 rounded-full bg-[#1A1C29] border-2 ${selectedColor === 'Deep Black' ? 'border-blue-600 ring-2 ring-blue-100' : 'border-transparent'} transition-all`}></button>
          <button onClick={() => setSelectedColor('Silver')} className={`w-8 h-8 rounded-full bg-[#E2E8F0] border-2 ${selectedColor === 'Silver' ? 'border-blue-600 ring-2 ring-blue-100' : 'border-transparent'} transition-all`}></button>
          <button onClick={() => setSelectedColor('White')} className={`w-8 h-8 rounded-full bg-[#F8FAFC] border-2 ${selectedColor === 'White' ? 'border-blue-600 ring-2 ring-blue-100' : 'border-transparent'} transition-all`}></button>
        </div>
      </div>

      {/* Size Selection */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-widest">SIZE</span>
          <button className="text-xs text-blue-600 font-medium hover:underline">Size Guide</button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {['COMPACT', 'STANDARD', 'EXTENDED'].map(size => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`py-3 text-xs font-bold rounded-full border transition-all ${
                selectedSize === size
                  ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
