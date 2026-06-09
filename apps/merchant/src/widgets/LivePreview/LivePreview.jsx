import React, { useEffect } from 'react';
import { ArrowRight, ChevronDown, ChevronRight, Clock, Mail, MapPin, Package, Phone, Search, ShoppingCart, Star, User, X } from 'lucide-react';

const featuredProducts = [
  { id: 1, name: 'Classic Cotton T-Shirt', price: '$29.99', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80', badge: 'In Stock', desc: 'A timeless wardrobe essential crafted from premium cotton for all-day comfort and a relaxed fit.' },
  { id: 2, name: 'Slim Fit Jeans', price: '$59.99', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80', badge: 'In Stock', desc: 'Modern slim fit jeans with stretch fabric. Designed for both casual and semi-formal use.' },
  { id: 3, name: 'Casual Hoodie', price: '$79.99', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80', badge: 'In Stock', desc: 'A soft and warm hoodie with clean lines, minimal branding, and a practical kangaroo pocket.' },
  { id: 4, name: 'Premium Polo Shirt', price: '$39.99', image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&q=80', badge: 'In Stock', desc: 'Fine pique texture with balanced structure and softness for a polished everyday look.' },
  { id: 5, name: 'Knit Beanie Hat', price: '$19.99', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=600&q=80', badge: 'In Stock', desc: 'Warm and cozy knit beanie hat perfect for cold weather. One-size-fits-most with a ribbed design.' },
  { id: 6, name: 'Athletic Running Shorts', price: '$34.99', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80', badge: 'In Stock', desc: 'Lightweight and breathable running shorts with built-in liner. Features moisture-wicking fabric.' },
  { id: 7, name: 'Leather Crossbody Bag', price: '$89.99', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80', badge: 'In Stock', desc: 'Compact and stylish crossbody bag crafted from genuine leather with premium hardware.' },
  { id: 8, name: 'Canvas Sneakers', price: '$69.99', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80', badge: 'In Stock', desc: 'Lightweight and breathable canvas sneakers with a vulcanized rubber sole.' },
  { id: 9, name: 'Premium Polo Shirt V2', price: '$49.99', image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&q=80', badge: 'In Stock', desc: 'Updated edition with fine pique texture. Suitable for casual and business-casual settings.' },
  { id: 10, name: 'Premium Polo Shirt', price: '$39.99', image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&q=80', badge: 'In Stock', desc: 'A versatile polo shirt with fine pique texture. Available in cotton and polyester.' },
  { id: 11, name: 'Casual Hoodie V2', price: '$89.99', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80', badge: 'In Stock', desc: 'Updated edition with richer fabric blend and elevated fit for daily wear.' },
  { id: 12, name: 'Casual Hoodie', price: '$79.99', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80', badge: 'In Stock', desc: 'Cozy and stylish hoodie made from a soft cotton-polyester blend.' },
];

const categoryCards = [
  { name: 'Tops', count: '6+ Items', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=700&q=80' },
  { name: 'Bottoms', count: '3+ Items', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=700&q=80' },
  { name: 'Footwear', count: '1+ Items', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&q=80' },
  { name: 'Accessories', count: '2+ Items', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=700&q=80' },
];

const productCardClassMap = {
  shadow: 'shadow-sm',
  border: 'border',
  flat: '',
};

export default function LivePreview({ themeData, pageData, activePage, storeData }) {
  const cardClass = productCardClassMap[themeData.productCard?.style] || '';
  const priceColor = themeData.productCard?.price || themeData.colors.primary;
  const badgeColor = themeData.productCard?.badge || '#10b981';

  useEffect(() => {
    const fontId = 'live-preview-google-font';
    let link = document.getElementById(fontId);
    if (!link) {
      link = document.createElement('link');
      link.id = fontId;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    link.href = `https://fonts.googleapis.com/css2?family=${themeData.typography.fontFamily.replace(/ /g, '+')}:wght@400;500;600;700;800&display=swap`;
  }, [themeData.typography.fontFamily]);

  const renderProductGrid = (products, compact = false) => (
    <div className={`grid grid-cols-4 ${compact ? 'gap-4' : 'gap-7'}`}>
      {products.map((product) => (
        <article
          key={product.id}
          className={`group flex cursor-pointer flex-col overflow-hidden ${cardClass}`}
          style={{
            borderRadius: `${themeData.layout.borderRadius}px`,
            backgroundColor: themeData.productCard.backgroundColor,
            color: themeData.productCard.textColor,
            borderColor: themeData.productCard?.style === 'border' ? `${themeData.colors.textPrimary}20` : 'transparent',
          }}
        >
          <div className={`relative w-full overflow-hidden ${compact ? 'aspect-[4/3]' : 'aspect-[3/4]'}`} style={{ backgroundColor: `${themeData.colors.textPrimary}08` }}>
            <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute left-2.5 top-2.5 rounded px-2 py-1 text-[10px] font-bold uppercase text-white" style={{ backgroundColor: badgeColor }}>
              {product.badge}
            </div>
          </div>

          <div className={`flex flex-1 flex-col text-left ${compact ? 'p-3' : 'p-4'}`}>
            <h3 className={`mb-1 font-semibold ${compact ? 'text-sm' : 'text-[17px]'}`}>{product.name}</h3>
            <p className={`line-clamp-3 opacity-70 ${compact ? 'mb-2 text-xs leading-5' : 'mb-3 text-sm leading-5'}`}>{product.desc}</p>
            <div className="mt-auto flex items-center justify-between">
              <span className={`${compact ? 'text-[28px]' : 'text-lg'} font-bold`} style={{ color: priceColor, fontSize: compact ? '15px' : undefined }}>
                {product.price}
              </span>
              <button
                className={`flex items-center justify-center text-white transition-opacity hover:opacity-90 ${compact ? 'h-8 w-8' : 'h-10 w-10'}`}
                style={{ backgroundColor: themeData.colors.primary, borderRadius: `${Math.min(themeData.layout.borderRadius, 7)}px` }}
              >
                <ShoppingCart className={compact ? 'h-4 w-4' : 'h-5 w-5'} />
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden bg-[#e5e7eb] p-6">
      <div className="mx-auto w-full max-w-[1280px]">
        <div
          className="min-h-[800px] overflow-hidden shadow-2xl"
          style={{
            fontFamily: `"${themeData.typography.fontFamily}", sans-serif`,
            backgroundColor: themeData.colors.backgroundMain,
            color: themeData.colors.textPrimary,
          }}
        >
          <header className="sticky top-0 z-40 border-b" style={{ backgroundColor: themeData.header.backgroundColor, color: themeData.header.textColor, borderColor: `${themeData.header.textColor}15` }}>
            <div className="mx-auto flex w-full max-w-[1060px] items-center gap-10 px-4 py-3">
              <div className="flex items-center gap-2.5">
                {storeData.logoUrl ? (
                  <img src={storeData.logoUrl} alt="Store logo" className="h-6 w-6 rounded object-cover" />
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded text-white" style={{ backgroundColor: themeData.colors.primary }}>
                    <Package className="h-3.5 w-3.5" />
                  </div>
                )}
                <span className="text-sm font-bold tracking-tight uppercase" style={{ color: themeData.header.textColor }}>{storeData.storeName}</span>
              </div>

              <nav className="flex items-center gap-7 text-xs font-semibold">
                <span className={`cursor-default border-b pb-1 transition-opacity ${activePage === 'home' ? '' : 'border-transparent opacity-70'}`} style={{ borderColor: activePage === 'home' ? themeData.colors.primary : 'transparent', color: activePage === 'home' ? themeData.colors.primary : themeData.header.textColor }}>Home</span>
                <span className={`cursor-default border-b pb-1 transition-opacity ${activePage === 'products' ? '' : 'border-transparent opacity-70'}`} style={{ borderColor: activePage === 'products' ? themeData.colors.primary : 'transparent', color: activePage === 'products' ? themeData.colors.primary : themeData.header.textColor }}>Products</span>
                <span className={`cursor-default border-b pb-1 transition-opacity ${activePage === 'about' ? '' : 'border-transparent opacity-70'}`} style={{ borderColor: activePage === 'about' ? themeData.colors.primary : 'transparent', color: activePage === 'about' ? themeData.colors.primary : themeData.header.textColor }}>About Us</span>
                <span className={`cursor-default border-b pb-1 transition-opacity ${activePage === 'contact' ? '' : 'border-transparent opacity-70'}`} style={{ borderColor: activePage === 'contact' ? themeData.colors.primary : 'transparent', color: activePage === 'contact' ? themeData.colors.primary : themeData.header.textColor }}>Contact</span>
              </nav>

              <div className="ml-auto flex items-center gap-5">
                <div className="flex w-[220px] items-center rounded-xl px-3 py-2" style={{ backgroundColor: '#f1f5f9' }}>
                  <Search className="mr-2 h-4 w-4 shrink-0 text-gray-500" />
                  <input type="text" placeholder="Search products..." className="w-full border-none bg-transparent text-xs text-gray-900 outline-none placeholder:text-gray-500" />
                </div>
                <User className="h-4 w-4 opacity-80" style={{ color: themeData.header.textColor }} />
                <ShoppingCart className="h-4 w-4 opacity-80" style={{ color: themeData.header.textColor }} />
              </div>
            </div>
          </header>

          {activePage === 'home' && (
            <main className="mx-auto min-h-[600px] w-full max-w-[1060px] px-4 py-5">
              <section
                className="relative flex h-[250px] flex-col justify-center overflow-hidden rounded-xl px-10"
                style={{ backgroundImage: `url(${pageData.home.heroImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${pageData.home.heroOverlayOpacity})` }} />
                <div className="z-10 mx-auto max-w-3xl text-center text-white">
                  <h1 className="mb-4 text-[44px] font-extrabold leading-[1.08]">{pageData.home.title}</h1>
                  <p className="mx-auto mb-6 max-w-[620px] text-base opacity-90" style={{ whiteSpace: 'pre-line' }}>{pageData.home.subtitle}</p>
                  <button className="rounded-xl px-7 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90" style={{ backgroundColor: themeData.colors.primary, borderRadius: `${themeData.layout.borderRadius}px` }}>
                    Shop Now
                  </button>
                </div>
              </section>

              <section className="py-10">
                <div className="mb-5 flex items-end justify-between">
                  <div>
                    <h2 className="mb-1 text-[34px] font-bold leading-none">{pageData.home.featuredTitle}</h2>
                    <p className="text-sm opacity-60">{pageData.home.featuredSubtitle}</p>
                  </div>
                  <span className="flex items-center gap-1 text-sm font-semibold" style={{ color: themeData.colors.primary }}>
                    View all <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
                {renderProductGrid(featuredProducts.slice(0, 4), true)}
              </section>

              <section className="pb-10 pt-2">
                <h3 className="mb-4 text-[34px] font-bold leading-none">Shop by Category</h3>
                <div className="grid grid-cols-4 gap-4">
                  {categoryCards.map((item) => (
                    <article key={item.name} className="group relative h-[210px] overflow-hidden rounded-xl">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-black/10" />
                      <div className="absolute bottom-3 left-3 text-white">
                        <p className="text-lg font-bold leading-none">{item.name}</p>
                        <p className="mt-1 text-xs opacity-80">{item.count}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </main>
          )}

          {activePage === 'products' && (
            <main className="mx-auto flex min-h-[600px] w-full max-w-[1060px] gap-8 px-4 py-8">
              <aside className="w-[190px] shrink-0 space-y-7">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold" style={{ color: themeData.colors.textPrimary }}>Filters</h2>
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: themeData.colors.primary }}>Clear All</span>
                </div>

                <div className="border-b pb-7" style={{ borderColor: `${themeData.colors.textPrimary}20` }}>
                  <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-wider opacity-70">Price Range</h3>
                  <div className="px-1">
                    <div className="relative mb-5 h-1 rounded-full bg-slate-200">
                      <div className="absolute left-[8%] right-[22%] top-0 h-full rounded-full" style={{ backgroundColor: themeData.colors.primary }} />
                      <div className="absolute left-[8%] top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 bg-white shadow-sm" style={{ borderColor: themeData.colors.primary }} />
                      <div className="absolute right-[22%] top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 bg-white shadow-sm" style={{ borderColor: themeData.colors.primary }} />
                    </div>
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="flex-1 rounded border bg-white px-2 py-1.5 text-right" style={{ borderColor: `${themeData.colors.textPrimary}18` }}>0 d</span>
                      <span className="opacity-50">-</span>
                      <span className="flex-1 rounded border bg-white px-2 py-1.5 text-right" style={{ borderColor: `${themeData.colors.textPrimary}18` }}>500 d</span>
                    </div>
                  </div>
                </div>

                <div className="border-b pb-7" style={{ borderColor: `${themeData.colors.textPrimary}20` }}>
                  <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-wider opacity-70">Category</h3>
                  <div className="space-y-3">
                    {categoryCards.map((cat, index) => (
                      <label key={cat.name} className="flex items-center gap-3 text-xs">
                        <input type="checkbox" defaultChecked={index === 0} className="h-4 w-4 rounded border-slate-300" style={{ accentColor: themeData.colors.primary }} />
                        <span style={{ color: index === 0 ? themeData.colors.primary : themeData.colors.textPrimary, opacity: index === 0 ? 1 : 0.7 }}>{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-wider opacity-70">Rating</h3>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const selected = rating === 4;
                      return (
                        <button
                          key={rating}
                          className="flex w-full items-center justify-between border px-2.5 py-2 text-[11px] font-semibold"
                          style={{
                            borderColor: selected ? themeData.colors.primary : `${themeData.colors.textPrimary}20`,
                            backgroundColor: selected ? `${themeData.colors.primary}12` : '#ffffff',
                            color: selected ? themeData.colors.primary : themeData.colors.textPrimary,
                            borderRadius: `${themeData.layout.borderRadius}px`,
                          }}
                        >
                          <span className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <Star key={index} className={`h-3 w-3 ${index < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                            ))}
                          </span>
                          <span>{rating === 5 ? '5' : `${rating}+`}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </aside>

              <section className="flex-1">
                <div className="mb-6 flex items-center justify-between border-b pb-4" style={{ borderColor: `${themeData.colors.textPrimary}20` }}>
                  <div className="space-y-1">
                    <p className="text-xs opacity-70">
                      Showing <span className="font-bold opacity-100">12</span> of <span className="font-bold opacity-100">12</span> products
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] opacity-60">Search:</span>
                      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{ backgroundColor: `${themeData.colors.primary}1A`, color: themeData.colors.primary }}>
                        <Search className="h-3 w-3" />
                        essentials
                        <X className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Sort By</span>
                    <button className="flex w-[170px] items-center justify-between border bg-white px-3 py-2 text-xs font-semibold" style={{ borderColor: `${themeData.colors.textPrimary}18`, borderRadius: `${themeData.layout.borderRadius}px` }}>
                      Newest Arrivals <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                    </button>
                  </div>
                </div>
                {renderProductGrid(featuredProducts.slice(0, 12), true)}
              </section>
            </main>
          )}

          {activePage === 'about' && (
            <main className="mx-auto w-full max-w-[1060px] px-4 py-9">
              <div className="mb-6 text-center">
                <h1 className="text-[40px] font-bold leading-none">About {storeData.storeName}</h1>
                <p className="mt-2 text-sm opacity-65">Curating the best modern essentials for your lifestyle.</p>
              </div>

              <div className="mx-auto max-w-[640px]">
                <img src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&q=80" alt="About hero" className="h-[230px] w-full rounded-xl object-cover" />

                <div className="mt-6 space-y-6 text-sm leading-7 opacity-85">
                  {pageData.about.story.split('\n').filter(Boolean).map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>

                <div className="mt-7 grid grid-cols-3 gap-6 border-t pt-5" style={{ borderColor: `${themeData.colors.textPrimary}18` }}>
                  <div>
                    <h3 className="text-xl font-bold">Quality First</h3>
                    <p className="mt-1 text-xs opacity-70">We never compromise on materials or craftsmanship. Built to last.</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Modern Design</h3>
                    <p className="mt-1 text-xs opacity-70">Clean lines, functional forms, and timeless aesthetics.</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Sustainable</h3>
                    <p className="mt-1 text-xs opacity-70">Working towards a greener future with eco-friendly packaging.</p>
                  </div>
                </div>
              </div>
            </main>
          )}

          {activePage === 'contact' && (
            <main className="mx-auto w-full max-w-[1060px] px-4 py-9">
              <div className="mb-10">
                <h1 className="mb-2 text-3xl font-bold" style={{ color: themeData.colors.textPrimary }}>Contact Us</h1>
                <p className="text-sm" style={{ color: `${themeData.colors.textPrimary}b3` }}>Have a question or need help? Reach out - we typically respond within one business day.</p>
              </div>

              <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-5">
                <div className="space-y-8 lg:col-span-2">
                  <div>
                    <h2 className="mb-5 text-lg font-bold" style={{ color: themeData.colors.textPrimary }}>Get in touch</h2>
                    <div className="space-y-4">
                      {[
                        { Icon: Mail, label: 'Support Email', value: 'support@fluxify.store' },
                        { Icon: Phone, label: 'Hotline', value: '+1 (800) 123-4567' },
                        { Icon: MapPin, label: 'Address', value: '123 Commerce Ave, Suite 400\\nSan Francisco, CA 94105' },
                        { Icon: Clock, label: 'Support Hours', value: 'Mon - Fri, 9 AM - 6 PM (PST)' },
                      ].map((item) => (
                        <div key={item.label} className="flex items-start gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${themeData.colors.primary}1A` }}>
                            {React.createElement(item.Icon, { className: 'h-5 w-5', style: { color: themeData.colors.primary } })}
                          </div>
                          <div>
                            <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider opacity-70">{item.label}</p>
                            <p className="whitespace-pre-line text-sm font-medium" style={{ color: item.label === 'Support Email' ? themeData.colors.primary : themeData.colors.textPrimary }}>{item.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h2 className="mb-4 text-lg font-bold" style={{ color: themeData.colors.textPrimary }}>Frequently Asked Questions</h2>
                    <div className="space-y-2">
                      {[
                        ['How do I track my order?', 'After your order is confirmed, you can view real-time status from My Account.'],
                        ['What is your return policy?', 'We accept returns within 30 days of delivery for unused items in original condition.'],
                        ['How long does shipping take?', 'Standard shipping takes 3-5 business days.'],
                      ].map(([question, answer], index) => (
                        <div key={question} className="overflow-hidden border border-slate-100 bg-white shadow-sm" style={{ borderRadius: `${themeData.layout.borderRadius}px` }}>
                          <div className="flex items-center justify-between px-4 py-3.5 text-left">
                            <span className="pr-4 text-xs font-semibold text-slate-800">{question}</span>
                            <ChevronRight className={`h-4 w-4 shrink-0 text-slate-400 ${index === 0 ? 'rotate-90' : ''}`} />
                          </div>
                          {index === 0 && (
                            <div className="border-t border-slate-50 px-4 pb-4 pt-3 text-xs leading-relaxed text-slate-600">{answer}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-3">
                  <div className="border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50" style={{ borderRadius: `${themeData.layout.borderRadius}px` }}>
                    <h2 className="mb-1 text-lg font-bold text-slate-900">Send us a message</h2>
                    <p className="mb-6 text-sm text-slate-500">
                      Fill in the form below and click <span className="font-semibold text-slate-700">Send via Email</span> - this will open your email app with the details pre-filled.
                    </p>

                    <div className="space-y-5">
                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <label className="mb-1.5 block text-sm font-semibold text-slate-700">First Name</label>
                          <input type="text" className="w-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" style={{ borderRadius: `${themeData.layout.borderRadius}px` }} placeholder="Jane" />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm font-semibold text-slate-700">Last Name</label>
                          <input type="text" className="w-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" style={{ borderRadius: `${themeData.layout.borderRadius}px` }} placeholder="Doe" />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Your Email Address</label>
                        <input type="email" className="w-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" style={{ borderRadius: `${themeData.layout.borderRadius}px` }} placeholder="jane@example.com" />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Subject</label>
                        <button className="flex w-full items-center justify-between border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm text-slate-700" style={{ borderRadius: `${themeData.layout.borderRadius}px` }}>
                          General Inquiry
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        </button>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Message</label>
                        <textarea rows={5} className="w-full resize-none border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" style={{ borderRadius: `${themeData.layout.borderRadius}px` }} placeholder="Describe your issue or question..." />
                      </div>

                      <button className="w-full px-6 py-3.5 font-bold text-white shadow-lg" style={{ backgroundColor: themeData.colors.primary, boxShadow: `0 10px 15px -3px ${themeData.colors.primary}4D`, borderRadius: `${themeData.layout.borderRadius}px` }}>
                        Send via Email
                      </button>
                      <p className="text-center text-xs leading-relaxed text-slate-400">Clicking the button above opens your default email app with the details pre-filled. No data is sent through this website.</p>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          )}

          <footer
            className="mt-auto border-t py-8"
            style={{
              backgroundColor: themeData.footer.backgroundColor,
              color: themeData.footer.textColor,
              borderTopColor: `${themeData.colors.primary}20`,
            }}
          >
            <div className="mx-auto w-full max-w-[1060px] px-4">
              <div className="mb-6 grid grid-cols-1 items-start gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {storeData.logoUrl ? (
                      <img src={storeData.logoUrl} alt="Store logo" className="h-6 w-6 rounded object-cover" />
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded text-white" style={{ backgroundColor: themeData.colors.primary }}>
                        <Package className="h-3.5 w-3.5" />
                      </div>
                    )}
                    <span className="text-lg font-bold uppercase tracking-tight" style={{ color: themeData.footer.textColor }}>
                      {storeData.storeName}
                    </span>
                  </div>
                  <p className="max-w-sm text-sm leading-relaxed" style={{ color: themeData.footer.textColor, opacity: 0.7 }}>
                    {pageData.about.story || 'Reliable products for everyday use.'}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="mb-2 text-xs font-bold uppercase tracking-wider" style={{ color: themeData.footer.textColor, opacity: 0.5 }}>
                    Contact
                  </h4>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 shrink-0" style={{ color: themeData.footer.textColor, opacity: 0.5 }} />
                    <span style={{ color: themeData.footer.textColor, opacity: 0.85 }}>support@computer-store.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 shrink-0" style={{ color: themeData.footer.textColor, opacity: 0.5 }} />
                    <span style={{ color: themeData.footer.textColor, opacity: 0.85 }}>0123 456 789</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="mb-2 text-xs font-bold uppercase tracking-wider" style={{ color: themeData.footer.textColor, opacity: 0.5 }}>
                    Store info
                  </h4>
                  <div className="flex items-center gap-2 text-sm" style={{ color: themeData.footer.textColor, opacity: 0.85 }}>
                    <MapPin className="h-4 w-4 shrink-0" style={{ color: themeData.footer.textColor, opacity: 0.5 }} />
                    <span>Da Nang, Viet Nam</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm" style={{ color: themeData.footer.textColor, opacity: 0.85 }}>
                    <Clock className="h-4 w-4 shrink-0" style={{ color: themeData.footer.textColor, opacity: 0.5 }} />
                    <span>Mon - Sat, 8:00 - 18:00</span>
                  </div>
                </div>
              </div>

              <div
                className="flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs md:flex-row"
                style={{ borderTopColor: `${themeData.colors.primary}15` }}
              >
                <p style={{ color: themeData.footer.textColor, opacity: 0.5 }}>
                  &copy; {new Date().getFullYear()} {storeData.storeName}. All rights reserved.
                </p>
                <div className="flex gap-4">
                  <span style={{ color: themeData.footer.textColor, opacity: 0.4 }}>Fluxify Ecommerce Platform</span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
