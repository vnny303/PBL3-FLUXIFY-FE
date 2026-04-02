import React from 'react';
import { Heart } from 'lucide-react';

export default function ProductImageGallery({ product, isLoggedIn, isWishlisted, toggleWishlist, onLoginRedirect }) {
  return (
    <div className="w-full lg:w-1/2">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 mb-4">
        <img 
          src={product?.img || "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=1000"} 
          alt={product?.name || "Studio Microphone Pro"} 
          className="w-full h-full object-cover" 
        />
        <button 
          onClick={() => {
            const currentProduct = product || { id: 999, name: 'Studio Microphone Pro', price: '$299.00' };
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
      <div className="grid grid-cols-4 gap-4">
        <div className="aspect-square rounded-xl overflow-hidden border-2 border-blue-600 cursor-pointer">
          <img src={product?.img || "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=200"} alt="Thumbnail 1" className="w-full h-full object-cover" />
        </div>
        <div className="aspect-square rounded-xl overflow-hidden border border-slate-200 cursor-pointer hover:border-slate-300">
          <img src="https://images.unsplash.com/photo-1520209268518-aec60b8bb5ca?auto=format&fit=crop&q=80&w=200" alt="Thumbnail 2" className="w-full h-full object-cover" />
        </div>
        <div className="aspect-square rounded-xl overflow-hidden border border-slate-200 cursor-pointer hover:border-slate-300">
          <img src="https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200" alt="Thumbnail 3" className="w-full h-full object-cover" />
        </div>
        <div className="aspect-square rounded-xl overflow-hidden border border-slate-200 cursor-pointer hover:border-slate-300 relative">
          <img src="https://images.unsplash.com/photo-1516280440502-a2989cb51bf1?auto=format&fit=crop&q=80&w=200" alt="Thumbnail 4" className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <span className="text-white font-medium">+2</span>
          </div>
        </div>
      </div>
    </div>
  );
}
