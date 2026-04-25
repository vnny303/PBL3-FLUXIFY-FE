import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Star, StarHalf, User, ChevronDown, Pen, Send, Loader2, Trash2, Pencil } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { reviewService } from '../../../shared/api/reviewService';
import { useStorefrontTenant } from '../../../features/theme/useStorefrontTenant';
import { useAppContext } from '../../../app/providers/useAppContext';
import ConfirmationModal from '../../../shared/ui/ConfirmationModal';

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
  if (!sku) return 'Không rõ';
  const attributes = parseAttributes(sku.attributes);
  const values = Object.values(attributes).filter((item) => typeof item === 'string' && item.trim());

  if (values.length > 0) return values.join(' / ');
  if (sku.skuCode) return sku.skuCode;
  return 'Không rõ';
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
  const formattedDate = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString('vi-VN', {
        year: 'numeric', month: 'short', day: 'numeric',
      })
    : 'Recently';

  return (
    <div className="border-b border-slate-100 pb-8">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
            <User className="w-5 h-5" />
          </div>
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
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(review)}
                className="text-slate-400 hover:text-primary transition-colors"
                title="Edit"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(review.id)}
                className="text-slate-400 hover:text-red-500 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
      {review.comment && (
        <p className="text-slate-600 text-sm leading-relaxed">{review.comment}</p>
      )}
      <p className="text-xs text-slate-500 mt-2">
        Phân loại đã mua: {review.purchasedVariantLabel || 'Không rõ'}
      </p>
    </div>
  );
}

// ─── Write Review Form ─────────────────────────────────────────────────────────
function ReviewForm({ productSkuId, productId, editingReview, onDone }) {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(editingReview?.rating || 0);
  const [comment, setComment] = useState(editingReview?.comment || '');

  const createMutation = useMutation({
    mutationFn: () => reviewService.createReview({ productSkuId, rating, comment }),
    onSuccess: () => {
      toast.success('Message sent successfully! We will get back to you soon.');
      queryClient.invalidateQueries({ queryKey: ['product-reviews', productId] });
      onDone();
    },
    onError: (err) => {
      if (err?.response?.status === 409) {
        toast.error('You have already reviewed this product.');
      } else {
        toast.error(err?.response?.data?.message || 'Failed to submit review');
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: () => reviewService.updateReview(editingReview.id, { rating, comment }),
    onSuccess: () => {
      toast.success('Review updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['product-reviews', productId] });
      onDone();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to update review');
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!productSkuId) {
      toast.error('Không xác định được biến thể SKU để gửi đánh giá.');
      return;
    }
    if (rating === 0) {
      toast.error('Please select a rating star.');
      return;
    }
    if (editingReview) {
      updateMutation.mutate();
    } else {
      createMutation.mutate();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-50 rounded-xl p-5 mb-8 border border-slate-200">
      <h4 className="font-bold text-slate-900 mb-4">
        {editingReview ? 'Edit Review' : 'Write a Review'}
      </h4>
      <div className="mb-4">
        <label className="text-sm text-slate-600 mb-2 block">Rating *</label>
        <StarInput value={rating} onChange={setRating} disabled={isPending} />
      </div>
      <div className="mb-4">
        <label className="text-sm text-slate-600 mb-2 block">Comment (optional)</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={2000}
          rows={3}
          disabled={isPending}
          placeholder="Share your experience here..."
          className="w-full px-4 py-3 text-sm bg-white border border-slate-200 rounded-lg resize-none outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50"
        />
        <p className="text-xs text-slate-400 text-right mt-1">{comment.length}/2000</p>
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold text-sm rounded-lg hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-60"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {editingReview ? 'Update' : 'Submit Review'}
        </button>
        <button
          type="button"
          onClick={onDone}
          disabled={isPending}
          className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// ─── Main ReviewList Component ────────────────────────────────────────────────
export default function ReviewList({ product, selectedSkuId }) {
  const { tenantId } = useStorefrontTenant();
  const { isLoggedIn, user } = useAppContext();
  const queryClient = useQueryClient();

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
  const skuIdsKey = useMemo(() => skuIds.join('|'), [skuIds]);

  // ── Fetch review list ──────────────────────────────────────────────────────
  const {
    data: reviews = [],
    isLoading: isLoadingReviews,
  } = useQuery({
    queryKey: ['product-reviews', product?.id, skuIdsKey],
    queryFn: () => reviewService.getProductReviews({
      tenantId,
      productId: product?.id,
      skuIds,
      filters: {
        pageSize: 200,
      },
    }),
    enabled: !!tenantId && skuIds.length > 0,
    staleTime: 30_000,
  });

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

  // ── Delete review ──────────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (reviewId) => reviewService.deleteReview(reviewId),
    onSuccess: () => {
      toast.success('Review deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['product-reviews', product?.id] });
      setReviewIdToDelete(null);
    },
    onError: () => {
      toast.error('Failed to delete review');
      setReviewIdToDelete(null);
    },
  });

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

  const handleFormDone = () => {
    setShowForm(false);
    setEditingReview(null);
  };

  const handleDeleteConfirm = () => {
    if (reviewIdToDelete) {
      deleteMutation.mutate(reviewIdToDelete);
    }
  };

  if (skuIds.length === 0) {
    return (
      <div className="text-center py-12 border border-slate-100 rounded-xl bg-slate-50">
        <p className="text-slate-500">This product has no variants to review.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-12">
      {/* ── Left: Summary ──────────────────────────────────────────────── */}
      <div className="w-full lg:w-1/3">
        <div className="lg:sticky top-24">
          <div className="text-6xl font-black text-slate-900 mb-2">
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

          {isLoggedIn ? (
            <button
              onClick={() => { setEditingReview(null); setShowForm(true); }}
              className="w-full py-3 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Pen className="w-4 h-4" />
              WRITE A REVIEW
            </button>
          ) : (
            <p className="text-sm text-slate-500 text-center italic">
              Please login to write a review
            </p>
          )}
        </div>
      </div>

      {/* ── Right: Review list ─────────────────────────────────────────── */}
      <div className="w-full lg:w-2/3">
        {/* Write/Edit form */}
        {showForm && (
          <ReviewForm
            productSkuId={activeWriteSkuId}
            productId={product?.id}
            editingReview={editingReview}
            onDone={handleFormDone}
          />
        )}

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
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => { setSortOption(opt); setShowSortDropdown(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      sortOption.label === opt.label
                        ? 'bg-blue-50/80 text-blue-600 font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                    }`}
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
            <div className="text-center py-12 border border-slate-100 rounded-xl bg-slate-50">
              <p className="text-slate-500">No reviews yet for this product.</p>
              <p className="text-slate-900 font-bold mt-2">Be the first to share your thoughts!</p>
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
    </div>
  );
}
