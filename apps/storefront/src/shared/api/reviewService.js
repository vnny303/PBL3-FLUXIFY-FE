import axiosClient from './axiosClient';

const toNumber = (value, fallback = 0) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};

const toTimestamp = (value) => {
  const timestamp = Date.parse(value || '');
  return Number.isFinite(timestamp) ? timestamp : 0;
};

const normalizeReview = (review) => {
  if (!review || typeof review !== 'object') return null;

  const productSkuId =
    review.productSkuId ||
    review.product_sku_id ||
    review.skuId ||
    review.sku_id ||
    null;

  return {
    ...review,
    id: review.id || review.reviewId || review.review_id || null,
    productSkuId,
    rating: toNumber(review.rating, 0),
    comment: review.comment ?? review.text ?? '',
    customerEmail: review.customerEmail ?? review.email ?? null,
    customerName: review.customerName ?? review.userName ?? review.customerFullName ?? null,
    createdAt: review.createdAt || review.created_at || null,
  };
};

const extractReviewList = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.items)) return response.items;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.items)) return response.data.items;
  return [];
};

const buildReviewKey = (review) => {
  if (review?.id) return String(review.id);
  return [
    review?.productSkuId || 'no-sku',
    review?.customerId || 'no-customer',
    review?.createdAt || 'no-date',
    review?.rating || 0,
    review?.comment || '',
  ].join('::');
};

const dedupeAndSortReviews = (reviews = []) => {
  const map = new Map();

  reviews.forEach((review) => {
    const normalized = normalizeReview(review);
    if (!normalized) return;
    map.set(buildReviewKey(normalized), normalized);
  });

  return Array.from(map.values()).sort((a, b) => toTimestamp(b.createdAt) - toTimestamp(a.createdAt));
};

const buildSummaryFromReviews = (reviews = []) => {
  const safeReviews = Array.isArray(reviews) ? reviews : [];
  const ratingBuckets = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  const totalReviews = safeReviews.length;
  const totalRating = safeReviews.reduce((sum, review) => {
    const rating = toNumber(review?.rating, 0);
    const rounded = Math.round(rating);
    if (rounded >= 1 && rounded <= 5) {
      ratingBuckets[rounded] += 1;
    }
    return sum + rating;
  }, 0);

  return {
    totalReviews,
    averageRating: totalReviews > 0 ? totalRating / totalReviews : 0,
    oneStarCount: ratingBuckets[1],
    twoStarCount: ratingBuckets[2],
    threeStarCount: ratingBuckets[3],
    fourStarCount: ratingBuckets[4],
    fiveStarCount: ratingBuckets[5],
  };
};

const toProductSkuIds = (product) => {
  const skus = product?.productSkus || product?.skus || [];
  return Array.from(
    new Set(
      skus
        .map((sku) => sku?.id || sku?.productSkuId || sku?.skuId)
        .filter(Boolean)
    )
  );
};

export const reviewService = {
  /**
   * GET /api/tenants/{tenantId}/product-skus/{productSkuId}/reviews
   * Public — Lấy danh sách reviews của một SKU
   * Query params: page, pageSize, sortBy (rating|createdAt|id), sortDir (asc|desc), rating (1-5), search
   */
  getReviews: async (tenantId, productSkuId, filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const response = await axiosClient.get(
      `/api/tenants/${tenantId}/product-skus/${productSkuId}/reviews${query ? `?${query}` : ''}`
    );
    return dedupeAndSortReviews(extractReviewList(response));
  },

  getReviewsBySkuIds: async (tenantId, skuIds = [], filters = {}) => {
    const uniqueSkuIds = Array.from(new Set((skuIds || []).filter(Boolean)));
    if (!tenantId || uniqueSkuIds.length === 0) return [];

    const results = await Promise.allSettled(
      uniqueSkuIds.map((skuId) => reviewService.getReviews(tenantId, skuId, filters))
    );

    const merged = results.flatMap((result) =>
      result.status === 'fulfilled' && Array.isArray(result.value) ? result.value : []
    );

    return dedupeAndSortReviews(merged);
  },

  getProductReviews: async ({ tenantId, productId, skuIds = [], filters = {} }) => {
    const query = new URLSearchParams(filters).toString();

    if (tenantId && productId) {
      try {
        const response = await axiosClient.get(
          `/api/tenants/${tenantId}/products/${productId}/reviews${query ? `?${query}` : ''}`
        );
        const list = dedupeAndSortReviews(extractReviewList(response));
        if (list.length > 0 || (skuIds || []).length === 0) {
          return list;
        }
      } catch {
        // Fallback to per-SKU fetching when product-level endpoint is not available.
      }
    }

    return reviewService.getReviewsBySkuIds(tenantId, skuIds, filters);
  },

  getProductReviewSummary: async ({ tenantId, productId, skuIds = [] }) => {
    const reviews = await reviewService.getProductReviews({
      tenantId,
      productId,
      skuIds,
    });

    return buildSummaryFromReviews(reviews);
  },

  getProductReviewSummariesByProducts: async ({ tenantId, products = [], concurrency = 4 }) => {
    if (!tenantId || !Array.isArray(products) || products.length === 0) {
      return {};
    }

    const tasks = products
      .map((product) => ({
        productId: product?.id,
        skuIds: toProductSkuIds(product),
        fallbackAverageRating: toNumber(product?.rating, 0),
        fallbackTotalReviews: toNumber(product?.reviewCount, 0),
      }))
      .filter((item) => item.productId);

    const safeConcurrency = Math.max(1, Math.min(Number(concurrency) || 1, 8));
    const results = {};
    let cursor = 0;

    const worker = async () => {
      while (cursor < tasks.length) {
        const currentIndex = cursor;
        cursor += 1;

        const task = tasks[currentIndex];
        const { productId, skuIds, fallbackAverageRating, fallbackTotalReviews } = task;

        if (!skuIds.length) {
          results[productId] = {
            totalReviews: fallbackTotalReviews,
            averageRating: fallbackAverageRating,
            oneStarCount: 0,
            twoStarCount: 0,
            threeStarCount: 0,
            fourStarCount: 0,
            fiveStarCount: 0,
          };
          continue;
        }

        try {
          results[productId] = await reviewService.getProductReviewSummary({
            tenantId,
            productId,
            skuIds,
          });
        } catch {
          results[productId] = {
            totalReviews: fallbackTotalReviews,
            averageRating: fallbackAverageRating,
            oneStarCount: 0,
            twoStarCount: 0,
            threeStarCount: 0,
            fourStarCount: 0,
            fiveStarCount: 0,
          };
        }
      }
    };

    await Promise.all(Array.from({ length: Math.min(safeConcurrency, tasks.length) }, () => worker()));
    return results;
  },

  /**
   * GET /api/tenants/{tenantId}/product-skus/{productSkuId}/reviews/summary
   * Public — Lấy thống kê rating của một SKU
   * Response: { productSkuId, totalReviews, averageRating, oneStarCount, ..., fiveStarCount }
   */
  getReviewSummary: async (tenantId, productSkuId) => {
    return axiosClient.get(
      `/api/tenants/${tenantId}/product-skus/${productSkuId}/reviews/summary`
    );
  },

  /**
   * POST /api/customer/reviews
   * [Authorize customer] — Customer tạo review cho một SKU đã mua
   * Body: { productSkuId, rating (1-5), comment (optional, max 2000) }
   * 409 nếu đã review SKU này rồi
   */
  createReview: async ({ productSkuId, rating, comment }) => {
    return axiosClient.post('/api/customer/reviews', {
      productSkuId,
      rating,
      comment,
    });
  },

  /**
   * PUT /api/customer/reviews/{reviewId}
   * [Authorize customer] — Customer sửa review của mình
   * Body: { rating (1-5), comment (optional) }
   */
  updateReview: async (reviewId, { rating, comment }) => {
    return axiosClient.put(`/api/customer/reviews/${reviewId}`, {
      rating,
      comment,
    });
  },

  /**
   * DELETE /api/customer/reviews/{reviewId}
   * [Authorize customer] — Customer xóa review của mình
   */
  deleteReview: async (reviewId) => {
    return axiosClient.delete(`/api/customer/reviews/${reviewId}`);
  },
};
