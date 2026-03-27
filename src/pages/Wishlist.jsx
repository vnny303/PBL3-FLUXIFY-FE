import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ShoppingBag } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

export default function Wishlist() {
  const { wishlistItems, toggleWishlist, addToCart } = useAppContext();
  const navigate = useNavigate();

  if (wishlistItems.length === 0) {
    return (
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center text-center gap-6 min-h-[60vh]">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center">
          <Heart className="w-12 h-12 text-red-300" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Your wishlist is empty</h2>
          <p className="text-slate-500">Save items you love by clicking the ♡ icon on any product.</p>
        </div>
        <button
          onClick={() => navigate('/shop')}
          className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-sm flex items-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          Browse Products
        </button>
      </main>
    );
  }

  return (
    <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">My Wishlist</h1>
          <p className="text-slate-500 mt-1">{wishlistItems.length} saved item{wishlistItems.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => wishlistItems.forEach(item => toggleWishlist(item))}
          className="text-sm font-semibold text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1.5"
        >
          <Trash2 className="w-4 h-4" />
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map(item => (
          <div
            key={item.id}
            className="group bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div
              className="relative aspect-square overflow-hidden bg-slate-100 cursor-pointer"
              onClick={() => navigate(`/product/${item.id}`)}
            >
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(item);
                }}
                className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow hover:bg-white transition-all active:scale-95"
              >
                <Heart className="w-4 h-4 text-red-500" fill="currentColor" />
              </button>
            </div>

            <div className="p-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{item.brand}</p>
              <h3
                className="font-bold text-slate-900 mb-1 cursor-pointer hover:text-primary transition-colors truncate"
                onClick={() => navigate(`/product/${item.id}`)}
              >
                {item.name}
              </h3>
              <p className="text-sm text-slate-500 mb-4 line-clamp-1">{item.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">
                  ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                </span>
                <button
                  onClick={() => {
                    addToCart(item);
                    toggleWishlist(item);
                  }}
                  className="flex items-center gap-1.5 bg-slate-900 hover:bg-primary text-white text-xs font-bold py-2 px-3 rounded-lg transition-colors"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
