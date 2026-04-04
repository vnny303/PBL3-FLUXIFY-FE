import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../../../app/providers/AppContext';
import ProductCard from '../../../../../entities/product/ui/ProductCard';
import { STORAGE_KEYS, buildShopPath, resolveActiveSubdomain } from '../../../../../shared/lib/constants';

export default function Home() {
  const { handleQuickAdd, products, categories, session } = useAppContext();
  const navigate = useNavigate();
  const activeSubdomain = resolveActiveSubdomain(
    localStorage.getItem(STORAGE_KEYS.SUBDOMAIN),
    session?.subdomain,
    import.meta.env.VITE_DEFAULT_SUBDOMAIN,
  );
  const shopPath = buildShopPath(activeSubdomain);

  const featuredProducts = products.slice(0, 4);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section className="relative overflow-hidden rounded-xl bg-slate-900 mb-16">
        <div className="absolute inset-0 opacity-40 mix-blend-overlay">
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCD1nr2Cxk4t1J3IiDJcLO2g44qpP1Dy27wYvBRR-2wiNIS28bjCqfwkcvMFaHU6d6yFNQmPdJneUWNfTtaJAU_zxdvlhtq84IjFV5DndWxLXEXUsRaHgkQ_S_bct2BAfYDiDrlJ0nTl9pxJHROlJsrtZVkSpc0Ulhgsng9VNsGca5VJ5uSJHvujonozsm5bfoti4oG-xB1QpmJussZkhNDWjFDacU9nv14-toP_NfL5nVbZd8FPULWfkvch2CUCfUh9C8uzdtaNK4")' }}></div>
        </div>
        <div className="relative px-8 py-12 md:py-20 flex flex-col items-center text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
            Modern Shopping for Modern Stores
          </h1>
          <p className="text-base md:text-lg text-slate-300 mb-8 leading-relaxed">
            Experience high-end e-commerce with our minimal, SaaS-grade storefront solution. Curated for those who appreciate design.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={() => navigate(shopPath)} className="bg-primary hover:opacity-90 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg shadow-primary/30 transition-all transform hover:scale-105">
              Shop Now
            </button>
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 px-8 py-3 rounded-xl font-bold text-lg transition-all">
              View Collection
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
          <button onClick={() => navigate(shopPath)} className="text-primary font-semibold hover:underline flex items-center gap-1">
            View all <ArrowRight className=" text-sm" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((item, i) => (
            <ProductCard key={item.id || i} product={item} onQuickAdd={handleQuickAdd} />
          ))}
        </div>
      </section>

      <section className="mb-20">
        <h2 className="text-3xl font-bold text-slate-900 mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.slice(0, 4).map((cat, i) => (
            <a key={i} href="#" className="group relative block aspect-[4/5] overflow-hidden rounded-xl bg-slate-200">
              <img alt={cat.name} src={`https://picsum.photos/seed/category-${cat.id}/600/800`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <h3 className="text-xl font-bold text-white">{cat.name}</h3>
                <p className="text-sm text-slate-300">Explore collection</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

