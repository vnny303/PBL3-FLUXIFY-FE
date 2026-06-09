import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Star, StarHalf, User, ChevronDown, Pen, Loader2 } from 'lucide-react';
import { useAppContext } from '../../../app/providers/useAppContext';
import ConfirmationModal from '../../../shared/ui/ConfirmationModal';
import ReviewModal from '../../../features/product-review/ui/ReviewModal';
import { useStorefrontConfig } from '../../../features/theme/useStorefrontConfig';
import { reviewService } from '../../../shared/api/reviewService';

const SORT_OPTIONS = [
  { label: 'Newest', sortBy: 'createdAt', sortDir: 'desc' },
  { label: 'Highest Rating', sortBy: 'rating', sortDir: 'desc' },
  { label: 'Lowest Rating', sortBy: 'rating', sortDir: 'asc' },
];

const toTimestamp = (value) => {
  const timestamp = Date.parse(value || '');
  return Number.isFinite(timestamp) ? timestamp : 0;
};

const getSkuId = (sku) => sku?.id || sku?.productSkuId || sku?.skuId || null;

const parseAttributes = (value) => {
  if (!value) return {};
  if (typeof value === 'object') return value;
  if (typeof value !== 'string') return {};

  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const buildVariantLabel = (sku) => {
  if (!sku) return 'Unknown';
  const attributes = parseAttributes(sku.attributes);
  const values = Object.values(attributes).filter((item) => typeof item === 'string' && item.trim());

  if (values.length > 0) return values.join(' / ');
  if (sku.skuCode) return sku.skuCode;
  return 'Unknown';
};

// ─── Rating Stars Input ────────────────────────────────────────────────────────
function StarInput({ value, onChange, disabled }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="text-amber-400 transition-transform hover:scale-110 disabled:cursor-not-allowed"
        >
          <Star
            className="w-7 h-7"
            fill={(hovered || value) >= star ? 'currentColor' : 'none'}
          />
        </button>
      ))}
    </div>
  );
}

// ─── Review Card ──────────────────────────────────────────────────────────────
function ReviewCard({ review, currentUserId, onEdit, onDelete }) {
  const isOwner = review.customerId === currentUserId;
  const reviewImages = Array.isArray(review.imageUrls)
    ? review.imageUrls
    : Array.isArray(review.images)
      ? review.images
      : [];
  const formattedDate = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
      })
    : 'Recently';

  return (
    <div className="border-b border-slate-100 pb-8">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {review.avatarUrl ? (
            <img
              src={review.avatarUrl}
              alt={review.customerName || 'Customer'}
              className="w-10 h-10 rounded-full object-cover bg-slate-200"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
              <User className="w-5 h-5" />
            </div>
          )}
          <div>
            <span className="font-bold text-slate-900">{review.customerName || review.customerEmail || 'Customer'}</span>
            <div className="flex text-amber-400 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${i < review.rating ? 'text-amber-400' : 'text-slate-200'}`}
                  fill="currentColor"
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">{formattedDate}</span>
          {isOwner && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onEdit(review)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(review.id)}
                className="text-xs font-semibold text-red-500 hover:text-red-600"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      {review.comment && (
        <p className="text-slate-600 text-sm leading-relaxed">{review.comment}</p>
      )}
      {reviewImages.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-4">
          {reviewImages.map((imageUrl, index) => (
            <a
              key={`${imageUrl}-${index}`}
              href={imageUrl}
              target="_blank"
              rel="noreferrer"
              className="block w-20 h-20 rounded-xl overflow-hidden border border-slate-100 bg-slate-50 hover:opacity-90 transition-opacity"
            >
              <img
                src={imageUrl}
                alt={`Review attachment ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </a>
          ))}
        </div>
      )}
      <p className="text-xs text-slate-500 mt-2">
        Purchased Variant: {review.purchasedVariantLabel || 'Unknown'}
      </p>
    </div>
  );
}

// ─── Write Review Form ─────────────────────────────────────────────────────────
// ReviewForm removed from here as per requirements.


// ─── Main ReviewList Component ────────────────────────────────────────────────
export default function ReviewList({ 
  product, 
  selectedSkuId, 
  reviews = [], 
  isLoadingReviews = false, 
  onRefresh 
}) {
  const { user } = useAppContext();
  const { theme } = useStorefrontConfig();
  const primaryColor = theme?.colors?.primary || '#1754cf';
  const borderRadius = theme?.layout?.borderRadius || 12;

  const [sortOption, setSortOption] = useState(SORT_OPTIONS[0]);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [reviewIdToDelete, setReviewIdToDelete] = useState(null);
  const sortDropdownRef = useRef(null);

  const productSkus = useMemo(() => {
    const raw = product?.productSkus || product?.skus || [];
    return Array.isArray(raw) ? raw : [];
  }, [product]);

  const skuIds = useMemo(
    () => Array.from(new Set(productSkus.map(getSkuId).filter(Boolean))),
    [productSkus]
  );

  const skuById = useMemo(() => {
    const map = new Map();
    productSkus.forEach((sku) => {
      const skuId = getSkuId(sku);
      if (skuId) map.set(skuId, sku);
    });
    return map;
  }, [productSkus]);

  const activeWriteSkuId = selectedSkuId || skuIds[0] || null;
  const activeWriteSku = useMemo(
    () => (activeWriteSkuId ? skuById.get(activeWriteSkuId) : null),
    [activeWriteSkuId, skuById]
  );

  const reviewProduct = useMemo(
    () => ({
      name: product?.name,
      imageUrl: activeWriteSku?.imgUrl || activeWriteSku?.image || activeWriteSku?.imageUrl || product?.image || product?.imageUrl || product?.imgUrls?.[0],
      variant: buildVariantLabel(activeWriteSku),
    }),
    [product, activeWriteSku]
  );

  // ── Data is now provided via props ──
  // Removed local useQuery to comply with "fetch once in ProductDetail" requirement

  const enrichedReviews = useMemo(
    () =>
      reviews.map((review) => {
        const sku = skuById.get(review.productSkuId);
        return {
          ...review,
          purchasedVariantLabel: buildVariantLabel(sku),
        };
      }),
    [reviews, skuById]
  );

  const sortedReviews = useMemo(() => {
    const next = [...enrichedReviews];

    if (sortOption.sortBy === 'rating') {
      next.sort((a, b) =>
        sortOption.sortDir === 'asc' ? a.rating - b.rating : b.rating - a.rating
      );
      return next;
    }

    next.sort((a, b) =>
      sortOption.sortDir === 'asc'
        ? toTimestamp(a.createdAt) - toTimestamp(b.createdAt)
        : toTimestamp(b.createdAt) - toTimestamp(a.createdAt)
    );
    return next;
  }, [enrichedReviews, sortOption]);

  // Mutation removed from here


  // ── Close sort dropdown on outside click ─────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target)) {
        setShowSortDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? reviews.reduce((sum, review) => sum + (Number(review.rating) || 0), 0) / totalReviews
    : 0;

  const ratingBuckets = reviews.reduce(
    (acc, review) => {
      const rating = Number(review.rating) || 0;
      if (rating >= 1 && rating <= 5) {
        acc[rating] += 1;
      }
      return acc;
    },
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  );

  const ratingBreakdown = [
    { stars: 5, count: ratingBuckets[5] },
    { stars: 4, count: ratingBuckets[4] },
    { stars: 3, count: ratingBuckets[3] },
    { stars: 2, count: ratingBuckets[2] },
    { stars: 1, count: ratingBuckets[1] },
  ];

  const handleEdit = (review) => {
    setEditingReview(review);
    setShowForm(true);
  };
  const handleDeleteConfirm = () => {};
  const handleSubmitReview = async (data) => {
    if (!activeWriteSkuId) return;

    if (editingReview?.id) {
      await reviewService.updateReview(editingReview.id, data);
    } else {
      await reviewService.createReview({
        productSkuId: activeWriteSkuId,
        ...data,
      });
    }

    setShowForm(false);
    setEditingReview(null);
    await onRefresh?.();
  };

  if (skuIds.length === 0) {
    return (
      <div className="text-center py-12 border border-slate-100 bg-slate-50" style={{ borderRadius: `${borderRadius}px` }}>
        <p className="text-slate-500">This product has no variants to review.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-12">
      {/* ── Left: Summary ──────────────────────────────────────────────── */}
      <div className="w-full lg:w-1/3">
        <div className="lg:sticky top-24">
          <div className="text-6xl font-bold text-slate-900 mb-2">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex text-amber-400 mb-2">
            {Array.from({ length: 5 }).map((_, i) => {
              if (i < Math.floor(averageRating)) return <Star key={i} fill="currentColor" className="w-5 h-5" />;
              if (i < averageRating) return <StarHalf key={i} fill="currentColor" className="w-5 h-5" />;
              return <Star key={i} className="w-5 h-5 text-slate-200" />;
            })}
          </div>
          <p className="text-sm text-slate-500 mb-6">Based on {totalReviews} reviews</p>

          {/* Rating breakdown bars */}
          {ratingBreakdown.length > 0 && (
            <div className="space-y-2 mb-8">
              {ratingBreakdown.map(({ stars, count }) => (
                <div key={stars} className="flex items-center gap-3 text-sm">
                  <span className="w-4 text-slate-600 font-medium">{stars}</span>
                  <Star className="w-3.5 h-3.5 text-amber-400 shrink-0" fill="currentColor" />
                  <div className="flex-1 bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-amber-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: totalReviews > 0 ? `${(count / totalReviews) * 100}%` : '0%' }}
                    />
                  </div>
                  <span className="w-6 text-right text-slate-400">{count}</span>
                </div>
              ))}
            </div>
          )}

          <div className="p-6 border" style={{ borderRadius: `${borderRadius}px`, backgroundColor: `${primaryColor}0D`, borderColor: `${primaryColor}26` }}>
            <p className="text-sm font-medium leading-relaxed" style={{ color: primaryColor }}>
              Reviews can only be submitted after your order has been successfully delivered.
            </p>
          </div>
        </div>
      </div>

      {/* ── Right: Review list ─────────────────────────────────────────── */}
      <div className="w-full lg:w-2/3">
        {/* Write/Edit form */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Customer Reviews</h3>
            <p className="text-sm text-slate-500">Share your experience with this product.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-colors"
            style={{ backgroundColor: primaryColor, borderRadius: `${borderRadius}px` }}
          >
            <Pen className="w-4 h-4" />
            Write Review
          </button>
        </div>

        {/* Sort bar */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
          <span className="text-sm text-slate-500">
            {totalReviews} reviews
          </span>
          <div className="flex items-center gap-2 text-sm relative" ref={sortDropdownRef}>
            <span className="text-slate-500">Sort by:</span>
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-1 font-bold text-slate-900 hover:text-primary transition-colors"
            >
              {sortOption.label}
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showSortDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showSortDropdown && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-xl border border-slate-100 py-2 z-50" style={{ borderRadius: `${borderRadius}px` }}>
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => { setSortOption(opt); setShowSortDropdown(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${sortOption.label === opt.label ? 'font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'}`}
                    style={{
                      backgroundColor: sortOption.label === opt.label ? `${primaryColor}1A` : undefined,
                      color: sortOption.label === opt.label ? primaryColor : undefined,
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Review items */}
        <div className="space-y-8">
          {isLoadingReviews ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : sortedReviews.length === 0 ? (
            <div className="text-center py-12 border border-slate-100 bg-slate-50" style={{ borderRadius: `${borderRadius}px` }}>
              <p className="text-slate-500">No reviews yet for this product.</p>
            </div>
          ) : (
            sortedReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                currentUserId={user?.userId}
                onEdit={handleEdit}
                onDelete={(id) => setReviewIdToDelete(id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!reviewIdToDelete}
        onClose={() => setReviewIdToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Deletion"
        message="Are you sure you want to perform this action?"
        confirmText="Confirm"
        cancelText="Cancel"
        type="danger"
      />

      <ReviewModal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingReview(null);
        }}
        product={reviewProduct}
        initialReview={editingReview}
        onSubmitReview={handleSubmitReview}
      />
    </div>
  );
}
