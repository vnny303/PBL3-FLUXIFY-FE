import { useState, useEffect, useMemo, useRef } from 'react';
import { products } from '../../../shared/lib/data';
import { useAppContext } from '../../../app/providers/AppContext';
import { ITEMS_PER_PAGE, SORT_OPTIONS, PRICE_RANGE_MIN, PRICE_RANGE_MAX } from '../../../shared/lib/constants';

export function useShopFilters() {
  const { searchQuery } = useAppContext();

  const [sortBy, setSortBy] = useState(SORT_OPTIONS[0]);
  const [priceRange, setPriceRange] = useState([PRICE_RANGE_MIN, PRICE_RANGE_MAX]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const gridTopRef = useRef(null);

  // Reset page when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [priceRange, selectedBrands, selectedSizes, sortBy, searchQuery]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase();
    let result = products.filter((product) => {
      const inPriceRange = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const matchesSize =
        selectedSizes.length === 0 ||
        (product.sizes && product.sizes.some((s) => selectedSizes.includes(s)));
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        (product.desc && product.desc.toLowerCase().includes(q));
      return inPriceRange && matchesBrand && matchesSize && matchesSearch;
    });

    if (sortBy === 'Price: Low to High') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'Price: High to Low') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'Newest Arrivals') result.sort((a, b) => b.id - a.id);
    else if (sortBy === 'Best Selling') result.sort((a, b) => a.id - b.id);

    return result;
  }, [priceRange, selectedBrands, selectedSizes, sortBy, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

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

  const clearFilters = () => {
    setPriceRange([PRICE_RANGE_MIN, PRICE_RANGE_MAX]);
    setSelectedBrands([]);
    setSelectedSizes([]);
    setSortBy(SORT_OPTIONS[0]);
  };

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  };

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

  return {
    // Filter state
    sortBy, setSortBy,
    priceRange, setPriceRange,
    selectedBrands, toggleBrand,
    selectedSizes, toggleSize,
    clearFilters,
    // Pagination
    currentPage, totalPages, handlePageChange,
    // Derived data
    filteredProducts, currentProducts,
    // Ref
    gridTopRef,
  };
}

