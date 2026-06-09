import { useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAppContext } from '../../../app/providers/useAppContext';
import { useStorefrontTenant } from '../../theme/useStorefrontTenant';
import { productService } from '../../../shared/api/productService';
import {
  ITEMS_PER_PAGE,
  PRICE_RANGE_MAX,
  PRICE_RANGE_MIN,
  SORT_OPTIONS,
} from '../../../shared/lib/constants';

const getSortParams = (sortBy) => {
  switch (sortBy) {
    case 'Price: Low to High':
      return { sortBy: 'price', sortDir: 'asc' };
    case 'Price: High to Low':
      return { sortBy: 'price', sortDir: 'desc' };
    case 'Newest Arrivals':
      return { sortBy: 'id', sortDir: 'desc' };
    case 'Best Selling':
      return { sortBy: 'soldCount', sortDir: 'desc' };
    default:
      return { sortBy: 'name', sortDir: 'asc' };
  }
};

export function useShopFilters() {
  const { searchQuery } = useAppContext();
  const { tenantId } = useStorefrontTenant();
  const location = useLocation();
  const gridTopRef = useRef(null);

  const initialCategoryId = location.state?.categoryId;
  const [selectedCategories, setSelectedCategories] = useState(
    initialCategoryId ? [initialCategoryId] : [],
  );
  const [sortBy, setSortBy] = useState(SORT_OPTIONS[0]);
  const [priceRange, setPriceRange] = useState([PRICE_RANGE_MIN, PRICE_RANGE_MAX]);
  const [ratingFrom, setRatingFrom] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { sortBy: apiSortBy, sortDir: apiSortDir } = getSortParams(sortBy);

  const apiFilters = useMemo(() => {
    const params = {
      page: currentPage,
      pageSize: ITEMS_PER_PAGE,
      sortBy: apiSortBy,
      sortDir: apiSortDir,
    };

    if (selectedCategories.length === 1) {
      params.categoryId = selectedCategories[0];
    }

    if (searchQuery?.trim()) {
      params.search = searchQuery.trim();
    }

    if (priceRange[0] > PRICE_RANGE_MIN) {
      params.minPrice = priceRange[0];
      params.priceFrom = priceRange[0];
    }

    if (priceRange[1] < PRICE_RANGE_MAX) {
      params.maxPrice = priceRange[1];
      params.priceTo = priceRange[1];
    }

    if (ratingFrom) {
      params.ratingFrom = ratingFrom;
    }

    return params;
  }, [apiSortBy, apiSortDir, currentPage, priceRange, ratingFrom, searchQuery, selectedCategories]);

  const {
    data: productPage = {
      items: [],
      page: currentPage,
      pageSize: ITEMS_PER_PAGE,
      totalCount: 0,
    },
    isLoading: isLoadingProducts,
    error: productsError,
  } = useQuery({
    queryKey: ['shop-products', tenantId, apiFilters],
    queryFn: () => productService.getProductPage(tenantId, apiFilters),
    enabled: !!tenantId,
    staleTime: 30_000,
  });

  const currentProducts = productPage.items || [];
  const filteredProducts = currentProducts;
  const totalCount = productPage.totalCount ?? productPage.total ?? currentProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / (productPage.pageSize || ITEMS_PER_PAGE)));

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
    setSelectedCategories((prev) => (prev.includes(categoryId) ? [] : [categoryId]));
  };

  const clearFilters = () => {
    setCurrentPage(1);
    setPriceRange([PRICE_RANGE_MIN, PRICE_RANGE_MAX]);
    setRatingFrom(null);
    setSelectedCategories([]);
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

  const updateRatingFrom = (value) => {
    setCurrentPage(1);
    setRatingFrom((prev) => (prev === value ? null : value));
  };

  return {
    sortBy,
    setSortBy: updateSortBy,
    priceRange,
    setPriceRange: updatePriceRange,
    ratingFrom,
    setRatingFrom: updateRatingFrom,
    selectedCategories,
    toggleCategory,
    clearFilters,
    currentPage,
    totalPages,
    handlePageChange,
    filteredProducts,
    currentProducts,
    totalCount,
    isLoadingProducts,
    productsError,
    gridTopRef,
  };
}
