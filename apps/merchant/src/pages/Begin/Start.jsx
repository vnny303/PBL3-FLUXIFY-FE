import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../../../app/providers/AppContext';
import ProductCard from '../../../../../entities/product/ui/ProductCard';
import { products, categories } from '../../../../../shared/lib/data';

// Category images for the "Shop by Category" section
const CATEGORY_IMAGES = {
  'cat-001': 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80',
  'cat-002': 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80',
  'cat-003': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
  'cat-004': 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
};

// Featured products: first 4 unique products
const featuredProducts = products.slice(0, 4);

export default function Home() {
  const { handleQuickAdd, setSelectedProduct } = useAppContext();
  const navigate = useNavigate();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section className="relative overflow-hidden rounded-xl bg-slate-900 mb-16">
        <div className="absolute inset-0 opacity-40 mix-blend-overlay">
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1600&q=80")' }}></div>
        </div>
        <div className="relative px-8 py-12 md:py-20 flex flex-col items-center text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
            Modern Shopping for Modern Stores
          </h1>
          <p className="text-base md:text-lg text-slate-300 mb-8 leading-relaxed">
            Experience high-end e-commerce with our minimal, SaaS-grade storefront solution. Curated for those who appreciate design.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={() => navigate('/shop')} className="bg-primary hover:opacity-90 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg shadow-primary/30 transition-all transform hover:scale-105">
              Shop Now
            </button>
            
          </div>
        </div>
      </section>

      <section className="mb-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Featured Products</h2>
            <p className="text-slate-500 mt-2">The latest arrivals and community favorites.</p>
          </div>
          <button onClick={() => navigate('/shop')} className="text-primary font-semibold hover:underline flex items-center gap-1">
            View all <ArrowRight className=" text-sm" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              onQuickAdd={handleQuickAdd}
              onCardClick={() => {
                setSelectedProduct(item);
                navigate(`/product/${item.id}`);
              }}
            />
          ))}
        </div>
      </section>

      <section className="mb-20">
        <h2 className="text-3xl font-bold text-slate-900 mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.filter(c => c.isActive).map((cat) => {
            const catProducts = products.filter(p => p.categoryId === cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => navigate('/shop')}
                className="group relative block aspect-[4/5] overflow-hidden rounded-xl bg-slate-200 w-full text-left"
              >
                <img
                  alt={cat.name}
                  src={CATEGORY_IMAGES[cat.id] || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&q=80'}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-xl font-bold text-white">{cat.name}</h3>
                  <p className="text-sm text-slate-300">{catProducts.length}+ Items</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}
