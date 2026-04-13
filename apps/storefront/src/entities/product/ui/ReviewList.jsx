import React, { useState, useRef, useEffect } from 'react';
import { Star, StarHalf, BadgeCheck, User, ChevronDown, Pen } from 'lucide-react';

export default function ReviewList() {
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
  );
}
