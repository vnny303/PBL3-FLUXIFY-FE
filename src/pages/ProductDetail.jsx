import React, { useState, useRef, useEffect } from 'react';
import { Heart, Star, StarHalf, Minus, Plus, ShoppingBag, Truck, ShieldCheck, Activity, Sliders, Package, CheckCircle2, Target, Ear, Plug, Cable, Ruler, Scale, CircleDot, Waves, Zap, Pen, ChevronDown, BadgeCheck, User } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

export default function ProductDetail() {
  const { addToCart, selectedProduct } = useAppContext();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('Deep Black');
  const [selectedSize, setSelectedSize] = useState('STANDARD');
  const [activeTab, setActiveTab] = useState('DESCRIPTION');
  const [reviewSortBy, setReviewSortBy] = useState('Newest');
  const [showReviewSort, setShowReviewSort] = useState(false);
  const reviewSortRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (reviewSortRef.current && !reviewSortRef.current.contains(event.target)) {
        setShowReviewSort(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-slate-500 mb-8">
        <a href="#" className="hover:text-slate-900">Store</a>
        <span className="mx-2">›</span>
        <a href="#" className="hover:text-slate-900">Audio Gear</a>
        <span className="mx-2">›</span>
        <span className="text-slate-900 font-medium">Studio Microphone Pro</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        {/* Left: Images */}
        <div className="w-full lg:w-1/2">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 mb-4">
            <img src={selectedProduct?.img || "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=1000"} alt={selectedProduct?.name || "Studio Microphone Pro"} className="w-full h-full object-cover" />
            <button className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-slate-50 transition-colors">
              <Heart className=" text-slate-400" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="aspect-square rounded-xl overflow-hidden border-2 border-blue-600 cursor-pointer">
              <img src={selectedProduct?.img || "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=200"} alt="Thumbnail 1" className="w-full h-full object-cover" />
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

        {/* Right: Product Info */}
        <div className="w-full lg:w-1/2">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">IN STOCK</span>
            <div className="flex items-center text-amber-400 text-sm">
              <Star className=" text-sm" fill="currentColor" />
              <Star className=" text-sm" fill="currentColor" />
              <Star className=" text-sm" fill="currentColor" />
              <Star className=" text-sm" fill="currentColor" />
              <StarHalf className=" text-sm" fill="currentColor" />
              <span className="text-slate-500 text-xs ml-2">(128 reviews)</span>
            </div>
          </div>

          <h1 className="text-4xl font-black text-slate-900 leading-tight mb-2">
            {selectedProduct?.name || "Studio Microphone Pro"}<br/>
            <span className="text-blue-600">2024 Edition</span>
          </h1>

          <div className="flex items-end gap-3 mb-6">
            <span className="text-3xl font-bold text-slate-900">{selectedProduct?.price || "$299.00"}</span>
            <span className="text-lg text-slate-400 line-through mb-1">$349.00</span>
          </div>

          <div className="border-l-4 border-blue-200 pl-4 py-1 mb-8">
            <p className="text-slate-600 italic">
              "{selectedProduct?.desc || "Engineered for clarity. The Fluxify Pro captures every nuance of your performance with studio-grade precision and near-zero self-noise."}"
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

          {/* Actions */}
          <div className="flex gap-4 mb-8">
            <div className="flex items-center border border-slate-200 rounded-full bg-white">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors">
                <Minus className=" text-sm" />
              </button>
              <span className="w-8 text-center font-bold text-slate-900">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors">
                <Plus className=" text-sm" />
              </button>
            </div>
            <button onClick={() => {
              addToCart(selectedProduct || { id: 999, name: "Studio Microphone Pro", price: "$299.00", img: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=1000" }, quantity, selectedColor, selectedSize);
            }} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-600/20">
              <ShoppingBag className=" text-sm" />
              Add to Cart
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100">
            <div className="flex items-start gap-3">
              <Truck className=" text-blue-600 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-900">FREE DELIVERY</p>
                <p className="text-xs text-slate-500">Orders over $150</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className=" text-blue-600 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-900">2 YEAR WARRANTY</p>
                <p className="text-xs text-slate-500">Full replacement</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-20">
        <div className="flex border-b border-slate-200 mb-8">
          {['DESCRIPTION', 'SPECIFICATIONS', 'REVIEWS (128)'].map(tab => (
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
              <h2 className="text-2xl font-black text-slate-900 mb-4">Precision Audio Engineering</h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                The Fluxify Studio Microphone Pro isn't just a tool; it's the center of your creative process. 
                Built with a hand-selected 34mm gold-sputtered diaphragm capsule, it delivers a warmth and 
                character usually reserved for vintage microphones costing thousands.
              </p>

              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="p-6 rounded-2xl border border-slate-200 bg-white">
                  <Activity className=" text-blue-600 text-3xl mb-4" />
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Cardioid Pattern</h3>
                  <p className="text-sm text-slate-500">Focuses on your voice while minimizing background noise from the sides and rear.</p>
                </div>
                <div className="p-6 rounded-2xl border border-slate-200 bg-white">
                  <Sliders className=" text-blue-600 text-3xl mb-4" />
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Internal Shock Mount</h3>
                  <p className="text-sm text-slate-500">Decouples the capsule from the mic body to prevent handling noise and vibration interference.</p>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed">
                Whether you're recording lead vocals, streaming high-stakes gaming, or producing a 
                professional podcast, the Fluxify Pro offers the dynamic range and frequency response 
                needed to make your audio stand out in any mix.
              </p>
            </div>

            <div className="w-full lg:w-1/3">
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100">
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-6">
                  <Package className=" text-blue-600" />
                  What's in the box?
                </h3>
                <ul className="space-y-4">
                  {[
                    'Fluxify Studio Pro Microphone',
                    'Premium XLR Cable (3m)',
                    'Custom Pop Filter',
                    'Reinforced Carry Case',
                    'Desktop Boom Stand'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className=" text-emerald-500 text-sm mt-0.5" />
                      <span className="text-sm text-slate-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'SPECIFICATIONS' && (
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="w-full lg:w-1/2 space-y-8">
              <div>
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-4">
                  <Sliders className=" text-blue-600" />
                  Acoustic Characteristics
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-3 border-b border-slate-100">
                    <span className="text-sm text-slate-500 flex items-center gap-2"><Activity className=" text-sm" /> Frequency Response</span>
                    <span className="text-sm font-bold text-slate-900">20Hz - 20kHz</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-slate-100">
                    <span className="text-sm text-slate-500 flex items-center gap-2"><Target className=" text-sm" /> Polar Pattern</span>
                    <span className="text-sm font-bold text-slate-900">Cardioid (Unidirectional)</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-slate-100">
                    <span className="text-sm text-slate-500 flex items-center gap-2"><Ear className=" text-sm" /> Sensitivity</span>
                    <span className="text-sm font-bold text-slate-900">-32dB ± 2dB</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-4">
                  <Plug className=" text-blue-600" />
                  Hardware & Connectivity
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-3 border-b border-slate-100">
                    <span className="text-sm text-slate-500 flex items-center gap-2"><Cable className=" text-sm" /> Connectivity</span>
                    <span className="text-sm font-bold text-slate-900">Gold-plated XLR 3-pin</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-slate-100">
                    <span className="text-sm text-slate-500 flex items-center gap-2"><Ruler className=" text-sm" /> Dimensions</span>
                    <span className="text-sm font-bold text-slate-900">52mm x 190mm</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-slate-100">
                    <span className="text-sm text-slate-500 flex items-center gap-2"><Scale className=" text-sm" /> Weight</span>
                    <span className="text-sm font-bold text-slate-900">485g (Mic only)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 space-y-8">
              <div className="p-6 rounded-2xl border border-slate-200 bg-white">
                <h3 className="text-sm font-bold text-slate-900 mb-4">Comparative Performance</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left py-3 font-medium text-slate-500">Metric</th>
                      <th className="text-left py-3 font-bold text-blue-600">Fluxify Pro</th>
                      <th className="text-left py-3 font-medium text-slate-500">Standard Mic</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-50">
                      <td className="py-3 text-slate-600">Self-Noise</td>
                      <td className="py-3 font-bold text-emerald-600">4dB (Ultra-low)</td>
                      <td className="py-3 text-slate-500">16dB</td>
                    </tr>
                    <tr className="border-b border-slate-50">
                      <td className="py-3 text-slate-600">Max SPL</td>
                      <td className="py-3 font-bold text-emerald-600">148dB</td>
                      <td className="py-3 text-slate-500">130dB</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-slate-600">Diaphragm</td>
                      <td className="py-3 font-bold text-emerald-600">34mm Gold</td>
                      <td className="py-3 text-slate-500">16mm Mylar</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">INTERNAL COMPONENT ARCHITECTURE</h3>
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-200">
                  <img src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800" alt="Internal Architecture" className="w-full h-full object-cover opacity-50 grayscale" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <div className="flex gap-6 mb-4">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur flex items-center justify-center mb-2 shadow-sm">
                          <CircleDot className=" text-blue-600" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-700 uppercase">CAPSULE</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur flex items-center justify-center mb-2 shadow-sm">
                          <Waves className=" text-blue-600" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-700 uppercase">DAMPING</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur flex items-center justify-center mb-2 shadow-sm">
                          <Zap className=" text-blue-600" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-700 uppercase">CIRCUITRY</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 max-w-xs">Advanced FET circuitry and a custom-tuned transformer ensure minimal harmonic distortion across the entire spectrum.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'REVIEWS (128)' && (
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="w-full lg:w-1/3">
              <div className="sticky top-24">
                <div className="text-6xl font-black text-slate-900 mb-2">4.8</div>
                <div className="flex text-amber-400 mb-2">
                  <Star fill="currentColor" />
                  <Star fill="currentColor" />
                  <Star fill="currentColor" />
                  <Star fill="currentColor" />
                  <StarHalf fill="currentColor" />
                </div>
                <p className="text-sm text-slate-500 mb-8">Based on 124 reviews</p>

                <div className="space-y-3 mb-8">
                  {[
                    { stars: 5, count: 98, percent: 80 },
                    { stars: 4, count: 18, percent: 15 },
                    { stars: 3, count: 5, percent: 4 },
                    { stars: 2, count: 2, percent: 1 },
                    { stars: 1, count: 1, percent: 0.5 }
                  ].map(row => (
                    <div key={row.stars} className="flex items-center gap-3 text-sm">
                      <span className="w-12 text-slate-600 font-medium">{row.stars} Stars</span>
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${row.percent}%` }}></div>
                      </div>
                      <span className="w-8 text-right text-slate-500">{row.count}</span>
                    </div>
                  ))}
                </div>

                <button className="w-full py-3 rounded-full border-2 border-blue-600 text-blue-600 font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                  <Pen className=" text-sm" />
                  WRITE A REVIEW
                </button>
              </div>
            </div>

            <div className="w-full lg:w-2/3">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600/20" />
                  <span className="text-sm text-slate-600">Only show reviews with images</span>
                </label>
                <div className="flex items-center gap-2 text-sm relative" ref={reviewSortRef}>
                  <span className="text-slate-500">Sort by:</span>
                  <button 
                    onClick={() => setShowReviewSort(!showReviewSort)}
                    className="flex items-center gap-1 font-bold text-slate-900 hover:text-blue-600 transition-colors"
                  >
                    {reviewSortBy}
                    <ChevronDown className={` text-sm transition-transform duration-300 ${showReviewSort ? 'rotate-180' : ''}`} />
                  </button>

                  {showReviewSort && (
                    <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 py-2 z-50">
                      {['Newest', 'Highest Rated', 'Lowest Rated'].map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setReviewSortBy(option);
                            setShowReviewSort(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                            reviewSortBy === option 
                              ? 'bg-blue-50/80 text-blue-600 font-bold' 
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-8">
                {/* Review 1 */}
                <div className="border-b border-slate-100 pb-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                        <img src="https://i.pravatar.cc/150?img=11" alt="Alex Johnson" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">Alex Johnson</span>
                          <span className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded uppercase">
                            <BadgeCheck className=" text-[10px]" /> Verified Purchase
                          </span>
                        </div>
                        <div className="flex text-amber-400 text-sm mt-1">
                          <Star className=" text-xs" fill="currentColor" />
                          <Star className=" text-xs" fill="currentColor" />
                          <Star className=" text-xs" fill="currentColor" />
                          <Star className=" text-xs" fill="currentColor" />
                          <Star className=" text-xs" fill="currentColor" />
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">2 days ago</span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    I've been using this microphone for about a week now for my podcast, and the sound quality is absolutely stunning. It has a very low noise floor and the cardioid pattern does a great job of isolating my voice. Highly recommend for any serious creator!
                  </p>
                  <div className="flex gap-2">
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200 cursor-pointer">
                      <img src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=100" alt="Review image 1" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200 cursor-pointer">
                      <img src="https://images.unsplash.com/photo-1520209268518-aec60b8bb5ca?auto=format&fit=crop&q=80&w=100" alt="Review image 2" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                {/* Review 2 */}
                <div className="border-b border-slate-100 pb-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <User />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">Sarah M.</span>
                          <span className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded uppercase">
                            <BadgeCheck className=" text-[10px]" /> Verified Purchase
                          </span>
                        </div>
                        <div className="flex text-amber-400 text-sm mt-1">
                          <Star className=" text-xs" fill="currentColor" />
                          <Star className=" text-xs" fill="currentColor" />
                          <Star className=" text-xs" fill="currentColor" />
                          <Star className=" text-xs" fill="currentColor" />
                          <Star className=" text-xs text-slate-200" fill="currentColor" />
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">1 week ago</span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Solid build quality. The included shock mount is much better than I expected. The only reason I'm giving 4 stars instead of 5 is that the shipping took a bit longer than advertised, but the product itself is flawless.
                  </p>
                </div>

                {/* Review 3 */}
                <div className="border-b border-slate-100 pb-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold">
                        MT
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">Mark T.</span>
                        </div>
                        <div className="flex text-amber-400 text-sm mt-1">
                          <Star className=" text-xs" fill="currentColor" />
                          <Star className=" text-xs" fill="currentColor" />
                          <Star className=" text-xs" fill="currentColor" />
                          <Star className=" text-xs" fill="currentColor" />
                          <Star className=" text-xs" fill="currentColor" />
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">2 weeks ago</span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    Unbelievable price to performance ratio. I compared this to mics twice its price and this held its own perfectly. The warm tone it adds to vocals is exactly what I was looking for.
                  </p>
                  <div className="flex gap-2">
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200 cursor-pointer">
                      <img src="https://images.unsplash.com/photo-1516280440502-a2989cb51bf1?auto=format&fit=crop&q=80&w=100" alt="Review image 3" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <button className="px-8 py-3 rounded-full border border-slate-200 text-sm font-bold text-blue-600 hover:border-blue-600 hover:bg-blue-50 transition-colors">
                    LOAD MORE REVIEWS
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}