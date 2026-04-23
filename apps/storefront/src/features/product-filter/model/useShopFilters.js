import { useState, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAppContext } from '../../../app/providers/useAppContext';
import { useStorefrontTenant } from '../../theme/useStorefrontTenant';
import { productService } from '../../../shared/api/productService';
import {
  ITEMS_PER_PAGE,
  SORT_OPTIONS,
  PRICE_RANGE_MIN,
  PRICE_RANGE_MAX,
} from '../../../shared/lib/constants';

/**
 * Map UI sort option → API query params
 * API hỗ trợ sortBy: "name" | "categoryId" | "id"  và sortDir: "asc" | "desc"
 * Price sort không có trong API → giữ client-side (clientSort)
 */
const getSortParams = (sortBy) => {
  switch (sortBy) {
    case 'Price: Low to High':
      return { apiSortBy: 'name', apiSortDir: 'asc', clientSort: 'price-asc' };
    case 'Price: High to Low':
      return { apiSortBy: 'name', apiSortDir: 'asc', clientSort: 'price-desc' };
    case 'Newest Arrivals':
      return { apiSortBy: 'id', apiSortDir: 'desc', clientSort: null };
    case 'Best Selling':
      return { apiSortBy: 'id', apiSortDir: 'asc', clientSort: null };
    default:
      return { apiSortBy: 'name', apiSortDir: 'asc', clientSort: null };
  }
};

export function useShopFilters() {
  const { searchQuery } = useAppContext();
  const { tenantId } = useStorefrontTenant();
  const location = useLocation();

  // ─── Server-side filter state ────────────────────────────────────────────────
  // Khởi tạo từ location.state nếu được navigate từ trang Home (Shop by Category)
  const initialCategoryId = location.state?.categoryId;
  const [selectedCategories, setSelectedCategories] = useState(
    initialCategoryId ? [initialCategoryId] : []
  );

  // ─── Client-side filter state ────────────────────────────────────────────────
  const [sortBy, setSortBy] = useState(SORT_OPTIONS[0]);
  const [priceRange, setPriceRange] = useState([PRICE_RANGE_MIN, PRICE_RANGE_MAX]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const gridTopRef = useRef(null);

  // ─── Build API query params ───────────────────────────────────────────────────
  const { apiSortBy, apiSortDir, clientSort } = getSortParams(sortBy);

  const apiFilters = useMemo(() => {
    const params = {};

    // categoryId: chỉ gửi lên API nếu chọn đúng 1 category
    // (API spec không hỗ trợ multi-categoryId)
    if (selectedCategories.length === 1) {
      params.categoryId = selectedCategories[0];
    }

    // search: gửi lên server để tìm theo name + description
    if (searchQuery && searchQuery.trim()) {
      params.search = searchQuery.trim();
    }

    // sortBy + sortDir: theo spec Products query params
    params.sortBy = apiSortBy;
    params.sortDir = apiSortDir;

    return params;
  }, [selectedCategories, searchQuery, apiSortBy, apiSortDir]);

  // ─── Fetch products từ API với filters ───────────────────────────────────────
  // Query key thay đổi → TanStack Query tự động refetch
  const {
    data: serverProducts = [],
    isLoading: isLoadingProducts,
    error: productsError,
  } = useQuery({
    queryKey: ['shop-products', tenantId, apiFilters],
    queryFn: () => productService.getProducts(tenantId, apiFilters),
    enabled: !!tenantId,
    staleTime: 30_000, // 30 giây
  });

  // ─── Client-side post-filter ───────────────────────────────────────────────
  // Price range và Size không được API hỗ trợ → filter trên kết quả server trả về
  // Nếu chọn nhiều hơn 1 category → cũng cần lọc client-side
  const filteredProducts = useMemo(() => {
    let result = serverProducts.filter((product) => {
      // Price range filter (client-side vì API không hỗ trợ)
      const inPriceRange =
        product.price >= priceRange[0] && product.price <= priceRange[1];

      // Multi-category filter (client-side khi chọn 2+ categories)
      const matchesCategory =
        selectedCategories.length <= 1 || // 0 hoặc 1: đã xử lý ở API
        selectedCategories.includes(product.categoryId);

      // Size filter (client-side vì API không hỗ trợ)
      const productSizes =
        product.attributes?.sizes || product.attributes?.size || [];
      const normalizedSizes = Array.isArray(productSizes)
        ? productSizes
        : [productSizes];
      const matchesSize =
        selectedSizes.length === 0 ||
        normalizedSizes.some((s) => selectedSizes.includes(s));

      return inPriceRange && matchesCategory && matchesSize;
    });

    // Price sort (client-side vì API chưa hỗ trợ sortBy=price)
    if (clientSort === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (clientSort === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [serverProducts, priceRange, selectedCategories, selectedSizes, clientSort]);

  // ─── Pagination (client-side trên kết quả đã filter) ─────────────────────
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // ─── Handlers ────────────────────────────────────────────────────────────────
  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (gridTopRef.current) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = gridTopRef.current.getBoundingClientRect().top;
      const offsetPosition = elementRect - bodyRect - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const toggleCategory = (categoryId) => {
    setCurrentPage(1);
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [...prev, categoryId],
    );
  };

  const toggleSize = (size) => {
    setCurrentPage(1);
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

  const clearFilters = () => {
    setCurrentPage(1);
    setPriceRange([PRICE_RANGE_MIN, PRICE_RANGE_MAX]);
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSortBy(SORT_OPTIONS[0]);
  };

  const updateSortBy = (value) => {
    setCurrentPage(1);
    setSortBy(value);
  };

  const updatePriceRange = (value) => {
    setCurrentPage(1);
    setPriceRange(value);
  };

  return {
    // Filter state
    sortBy, setSortBy: updateSortBy,
    priceRange, setPriceRange: updatePriceRange,
    selectedCategories, toggleCategory,
    selectedSizes, toggleSize,
    clearFilters,
    // Pagination
    currentPage, totalPages, handlePageChange,
    // Derived data
    filteredProducts, currentProducts,
    // Loading / Error
    isLoadingProducts,
    productsError,
    // Ref
    gridTopRef,
  };
}
  