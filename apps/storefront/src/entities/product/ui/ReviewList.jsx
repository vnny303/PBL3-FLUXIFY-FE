import React, { useState, useRef, useEffect } from 'react';
import { Star, StarHalf, BadgeCheck, User, ChevronDown, Pen } from 'lucide-react';

export default function ReviewList({ product }) {
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

  const reviews = product?.reviews || [];
  const averageRating = product?.averageRating || 0;
  const numReviews = product?.numReviews || 0;

  return (
    <div className="flex flex-col lg:flex-row gap-12">
      <div className="w-full lg:w-1/3">
        <div className="sticky top-24">
          <div className="text-6xl font-black text-slate-900 mb-2">{averageRating.toFixed(1)}</div>
          <div className="flex text-amber-400 mb-2">
            {Array.from({ length: 5 }).map((_, i) => {
              if (i < Math.floor(averageRating)) return <Star key={i} fill="currentColor" />;
              if (i < averageRating) return <StarHalf key={i} fill="currentColor" />;
              return <Star key={i} className="text-slate-200" />;
            })}
          </div>
          <p className="text-sm text-slate-500 mb-8">Based on {numReviews} reviews</p>

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
          {reviews.length === 0 ? (
            <div className="text-center py-12 border border-slate-100 rounded-xl bg-slate-50">
              <p className="text-slate-500">There are no reviews for this product yet.</p>
              <p className="text-slate-900 font-bold mt-2">Be the first to share your thoughts!</p>
            </div>
          ) : (
            reviews.map((review, idx) => (
              <div key={idx} className="border-b border-slate-100 pb-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 overflow-hidden">
                      {review.userAvatar ? (
                        <img src={review.userAvatar} alt={review.userName} className="w-full h-full object-cover" />
                      ) : (
                        <User />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{review.userName || 'Anonymous'}</span>
                      </div>
                      <div className="flex text-amber-400 text-sm mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`text-xs ${i < (review.rating || 5) ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">{review.date || 'Recently'}</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  {review.comment}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
