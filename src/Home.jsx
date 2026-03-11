import React from 'react';
import { useAppContext } from './AppContext';

export default function Home() {
  const { setCurrentView, setShowModal } = useAppContext();
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
            <button onClick={() => setCurrentView('shop')} className="bg-primary hover:opacity-90 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg shadow-primary/30 transition-all transform hover:scale-105">
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
          <button onClick={() => setCurrentView('shop')} className="text-primary font-semibold hover:underline flex items-center gap-1">
            View all <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { cat: 'Audio', name: 'Wireless Headphones', price: '$199.00', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDk8PcYjRqHZsivpvzkumwZJ-arFDQBjCPLtWd9fo-WLJEiE4B0r7H3qCSc1EBaYrjhX0jPRUvBZwllk6-3CO5qitpS3sTyrLHBbKQLSAlg3K05It7jf9DWH4x5o4yCz9gCPkuSzr-e5gcT-376qUbt0pBZJHdhrYOOXDz1JUWIeq4AcSzKTRY7hLlgnbIoNUUsYbOBjLiAWdIgZrANYqj796BDBuGd8KHaKxebozGBeejVHgfrRIGCGqsBuD_RZCUgoBrJGhd0jyc' },
            { cat: 'Footwear', name: 'Leather Boots', price: '$120.00', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7ZD7c-CEM3v_toRi-FNQGJjL6pxZ4uRQhoUJfrKQTbC3hdH-wuAPsDaEmjO-BzQMiYFZdjVN6q-D3PSd0KDcezDvcs5uOPSBwtyNwNIsqpTOHCJC8Co6UJAnWDbGJevGxiiel_1C_gCHJUDhp00dSKQZKO62Q2CNkWAFZa16jvyhneb1M9i2nWSq37ZvVNGV4vKXtCVrFyywjGhL-LOC38olB6K6ZrAU8lBKz-OZ-g6ToP-E25euo3p60Lw9LPxTLBjW4cZR79yY' },
            { cat: 'Accessories', name: 'Minimalist Watch', price: '$250.00', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDBh78YIKmnUbhgV6bfMn1CCLAPvwTg8qdChlDXs-hXMdWAk62MCLK07aRjO-eihUgS1Dx6CEjStEcD7zC6LuY3LyMoXNjMxIAno9yIFr_NPNqYd1RZ33k4X3-a8uxjGOBrAKC-EkYbqJ15s1HfjpzTNhuL95VCw8gP6_otuUKMXyMF06iw6SY7jfMKzITHApXxP2UHROXpMpODmgWn183KFLXwT2Mzq5BY0HqvVeKKRgswlnzUoz2gunbg1Lk8VlcLXdLfTDNAVc' },
            { cat: 'Tech', name: 'Studio Microphone', price: '$175.00', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrIeHdjuI6-2DcYWN68Vrdhdom0srfKhxyjWraAWmb4iHUXRCynpfZrzGhJB1INQnrEKKvtpWiPZ-ZawQBmi-bl9zrZKDqaDHjhShzCbsx4ioqyaLM-V-o_8bvOXQ-geH3ov1kY1ixRomTJ5gzTn4bR6IuO18MQVQkLZWe0OQ0cVFdH51sPBm0z0llWaQwU56iQaQ_6i0vqX0NNnBdR5NoESd-K41SpHurtUDXLpj1JKVjcFfxl5em_wxTUBRM4sF4IsO-DdqQYWA' }
          ].map((item, i) => (
            <div key={i} className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative aspect-square overflow-hidden bg-slate-100">
                <img alt={item.name} src={item.img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute top-3 left-3">
                  <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">In Stock</span>
                </div>
              </div>
              <div className="p-5">
                <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-1">{item.cat}</p>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.name}</h3>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xl font-bold text-primary">{item.price}</span>
                  <button onClick={() => setShowModal(true)} className="bg-slate-900 text-white p-2 rounded-lg hover:bg-primary transition-colors flex items-center justify-center">
                    <span className="material-symbols-outlined">add_shopping_cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-20">
        <h2 className="text-3xl font-bold text-slate-900 mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { name: 'Essentials', items: '120+', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7yDtP0axVRCTCnhMIoAY3qDs_oKSVwkDXHPhm93sVP04T-UqXOeuTUiNaU13iFfpQC-CpgUKQTC1hhxff3m6NpNAs96JhT6D8kg_tUXwJsleShO3Rl7HF5qHOJzozU6CBl9cXIuqLw0PGRMTLQapkYJjwp_EFZ0b3eJfOjLwcKxvBQ-UJXtodEUj8n03E4eY_uzBoxvJGbg4qpQ0ANukiZcPlwwJXBV1wfaHMfAkQ5MYWP_gtsFcwGlbFr8NJDLfNBrB1f23N5lM' },
            { name: 'Electronics', items: '85+', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsziQlv0GmmhgKxIsjhPwj74R9IMFh8ocu2f4D9GtGEZacsEfcAG9iUUaaBM8bJAKN7e7gES-jMCVLX_9Q2IZp4UbWAqZYY3fpRwRrK0KG4TkE0LO6njsI1lG8XT4JZGZJWuH7NTEV1uwXyK9plb1dkvfr5wRS-goJsGC5lE9I7mJXn1QPDYJkLdNH3LGgAZ66uPQCmcY4TiTzDDWStGcY-l3uZvwZZDloJSErd6J3IDGcZhdESXCUtRblKcdXmnBI8AbA22p3lkw' },
            { name: 'Home Decor', items: '45+', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDwG4Kk1mhLSppTyY6qku-C7AoBraCGWiiRdinKlQvmz-o9wKY7DReF77zaCrWjBgpsiI7wZ2wwWpkI1XB4t3FnROTKEBEvYbC87Tyy2tC6m-rHvtISnSR5myOPOwGHANeP7rw1UcOWEuCed3qBUxNbaSvMrvP97sXepxflvecPn7bfQnnbg92GhYgcP02mX6upfp_-47ZBpctNC3E501ey9CFQMy-A7I4eZrfUmM43fbAEqoyuIDlkjwSsexoigxg0dNAk_phHLI' },
            { name: 'Accessories', items: '210+', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAee36XJBJorTykl-wNVombv2UCwrJCW38LBEY_mGiFsz_nSMjcN-szZNUSlk12pDIeRVU-l3k3LA2_E9CY4IjMesTXMQFqXYa7tP83piEwQCskx7NQ_Cc21Mvy7LrPa1uV1sdlEMgEKbIHDe0wY8hy_a_aKHR2fJSXrwDxxbbpazhzn_K5VRQYv5mEd0DNjAx-SxcJS129lyMm9yQxYvrLQajGhB-GthyjFRPndShLoFjt1W3SNbc-htQiOqFukMOxs9AH3ZYSgP0' }
          ].map((cat, i) => (
            <a key={i} href="#" className="group relative block aspect-[4/5] overflow-hidden rounded-xl bg-slate-200">
              <img alt={cat.name} src={cat.img} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <h3 className="text-xl font-bold text-white">{cat.name}</h3>
                <p className="text-sm text-slate-300">Explore {cat.items} Items</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
