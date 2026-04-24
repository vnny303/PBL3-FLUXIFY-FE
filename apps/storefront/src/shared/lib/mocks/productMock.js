/**
 * Mock data for products and categories
 * Used when VITE_ENABLE_PRODUCTS_MOCK=true
 */

export const mockCategories = [
  { id: 'cat-1', name: 'Electronics', isActive: true },
  { id: 'cat-2', name: 'Fashion', isActive: true },
  { id: 'cat-3', name: 'Home & Living', isActive: true },
  { id: 'cat-4', name: 'Accessories', isActive: true },
];

export const mockProducts = [
  {
    id: 'prod-1',
    name: 'Fluxify Premium Hoodie',
    isNew: true,
    description: 'A premium quality hoodie with a modern fit. Made from 100% organic cotton, this hoodie is perfect for any occasion.',
    // ... rest same
    categoryId: 'cat-2',
    imgUrls: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?auto=format&fit=crop&w=800&q=80'
    ],
    productSkus: [
      { id: 'sku-1-s-black', skuCode: 'HOODIE-BLK-S', price: 450000, stock: 10, imgUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80', attributes: { color: 'Black', size: 'S' } },
      { id: 'sku-1-m-black', skuCode: 'HOODIE-BLK-M', price: 450000, stock: 15, imgUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80', attributes: { color: 'Black', size: 'M' } },
      { id: 'sku-1-l-black', skuCode: 'HOODIE-BLK-L', price: 450000, stock: 8, imgUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80', attributes: { color: 'Black', size: 'L' } },
      { id: 'sku-1-s-gray', skuCode: 'HOODIE-GRY-S', price: 420000, stock: 5, imgUrl: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?auto=format&fit=crop&w=800&q=80', attributes: { color: 'Gray', size: 'S' } },
      { id: 'sku-1-m-gray', skuCode: 'HOODIE-GRY-M', price: 420000, stock: 0, imgUrl: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?auto=format&fit=crop&w=800&q=80', attributes: { color: 'Gray', size: 'M' } }
    ],
    variants: [
      { name: 'color', options: ['Black', 'Gray'] },
      { name: 'size', options: ['S', 'M', 'L'] }
    ],
    attributes: {
      colors: ['Black', 'Gray'],
      sizes: ['S', 'M', 'L']
    }
  },
  {
    id: 'prod-2',
    name: 'Wireless Noise Cancelling Headphones',
    isBestSeller: true,
    description: 'Experience pure sound with our latest noise-cancelling technology. 30-hour battery life and quick charging.',
    categoryId: 'cat-1',
    imgUrls: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'],
    productSkus: [
      { id: 'sku-2-main', skuCode: 'HEADPHONE-WRLS', price: 2500000, stock: 25, imgUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', attributes: {} }
    ],
    variants: [],
    attributes: {
        features: ['Active Noise Cancelling', '30-hour Battery', 'Quick Charge']
    }
  },
  {
    id: 'prod-3',
    name: 'Minimalist Wall Clock',
    description: 'A sleek, minimalist clock for your modern home. Silent movement and elegant design.',
    categoryId: 'cat-3',
    imgUrls: ['https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=80'],
    productSkus: [
        { id: 'sku-3-white', skuCode: 'CLOCK-WHT', price: 590000, stock: 0, imgUrl: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=80', attributes: { color: 'White' } },
        { id: 'sku-3-black', skuCode: 'CLOCK-BLK', price: 590000, stock: 0, imgUrl: 'https://images.unsplash.com/photo-1524311583145-d5593bd3502a?auto=format&fit=crop&w=800&q=80', attributes: { color: 'Black' } }
    ],
    variants: [
        { name: 'color', options: ['White', 'Black'] }
    ],
    attributes: {
        colors: ['White', 'Black']
    }
  },
  {
    id: 'prod-4',
    name: 'Leather Messenger Bag',
    isSale: true,
    discountLabel: '20% OFF',
    description: 'Handcrafted genuine leather messenger bag. Includes a padded laptop compartment and multiple pockets.',
    categoryId: 'cat-4',
    imgUrls: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80'],
    productSkus: [
      { id: 'sku-4-brown', skuCode: 'BAG-BRN', price: 1200000, stock: 12, imgUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80', attributes: { color: 'Brown' } },
      { id: 'sku-4-tan', skuCode: 'BAG-TAN', price: 1350000, stock: 4, imgUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80', attributes: { color: 'Tan' } }
    ],
    variants: [
      { name: 'color', options: ['Brown', 'Tan'] }
    ],
    attributes: {
        colors: ['Brown', 'Tan']
    }
  },
  {
    id: 'prod-5',
    name: 'Organic Cotton T-Shirt',
    description: 'Soft, breathable organic cotton T-shirt. Essential for your daily wardrobe.',
    categoryId: 'cat-2',
    imgUrls: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80'],
    productSkus: [
      { id: 'sku-5-wht-xs', skuCode: 'TSHIRT-WHT-XS', price: 299000, stock: 0, imgUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80', attributes: { color: 'White', size: 'XS' } },
      { id: 'sku-5-wht-s', skuCode: 'TSHIRT-WHT-S', price: 299000, stock: 3, imgUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80', attributes: { color: 'White', size: 'S' } }
    ],
    variants: [
      { name: 'color', options: ['White'] },
      { name: 'size', options: ['XS', 'S'] }
    ],
    attributes: {
        colors: ['White'],
        sizes: ['XS', 'S']
    }
  }
];
