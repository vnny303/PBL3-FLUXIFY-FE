import axiosClient from './axiosClient';

const toNumber = (value, fallback = 0) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};

const normalizeReview = (review) => {
  if (!review || typeof review !== 'object') return null;

  return {
    ...review,
    rating: toNumber(review.rating, 0),
    comment: review.comment ?? review.text ?? '',
    customerEmail: review.customerEmail ?? review.customerName ?? review.userName ?? null,
  };
};

const extractReviewList = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.items)) return response.items;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.items)) return response.data.items;
  return [];
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
    return extractReviewList(response).map(normalizeReview).filter(Boolean);
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
