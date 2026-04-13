export const TENANT_ID = 'tenant-demo';

// ─── Categories (matches GET /api/tenants/{tenantId}/categories) ──────────────
export const categories = [
  {
    id: 'cat-001',
    tenantId: TENANT_ID,
    name: 'Tops',
    description: 'T-shirts, shirts, and casual tops',
    isActive: true,
  },
  {
    id: 'cat-002',
    tenantId: TENANT_ID,
    name: 'Bottoms',
    description: 'Jeans, pants, and bottoms',
    isActive: true,
  },
  {
    id: 'cat-003',
    tenantId: TENANT_ID,
    name: 'Footwear',
    description: 'Shoes, sneakers, and boots',
    isActive: true,
  },
  {
    id: 'cat-004',
    tenantId: TENANT_ID,
    name: 'Accessories',
    description: 'Bags, hats, and accessories',
    isActive: true,
  },
];

// ─── Products (matches GET /api/tenants/{tenantId}/products) ─────────────────
// Structure: id, tenantId, categoryId, name, description, attributes, imgUrls[], skus[]
// attributes (product-level): plural keys — colors[], sizes[], fabrics[], etc.
// attributes (sku-level):     singular keys — color, size, fabric, etc.
const baseProducts = [
  {
    id: 'prod-001',
    tenantId: TENANT_ID,
    categoryId: 'cat-001',
    name: 'Classic Cotton T-Shirt',
    description: 'A timeless wardrobe essential crafted from 100% premium cotton for all-day comfort and a relaxed fit.',
    attributes: {
      colors: ['White', 'Black', 'Gray'],
      sizes: ['S', 'M', 'L', 'XL'],
    },
    imgUrls: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
    ],
    skus: [
      { id: 'sku-001-1', productId: 'prod-001', price: 29.99, stock: 10, attributes: { color: 'White', size: 'S' }, imgUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=300&q=80' },
      { id: 'sku-001-2', productId: 'prod-001', price: 29.99, stock: 12, attributes: { color: 'White', size: 'M' }, imgUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=300&q=80' },
      { id: 'sku-001-3', productId: 'prod-001', price: 29.99, stock: 8,  attributes: { color: 'Black', size: 'M' }, imgUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=300&q=80' },
      { id: 'sku-001-4', productId: 'prod-001', price: 29.99, stock: 6,  attributes: { color: 'Black', size: 'L' }, imgUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=300&q=80' },
      { id: 'sku-001-5', productId: 'prod-001', price: 29.99, stock: 9,  attributes: { color: 'Gray',  size: 'M' }, imgUrl: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=300&q=80' },
      { id: 'sku-001-6', productId: 'prod-001', price: 34.99, stock: 5,  attributes: { color: 'Gray',  size: 'XL'}, imgUrl: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=300&q=80' },
    ],
  },
  {
    id: 'prod-002',
    tenantId: TENANT_ID,
    categoryId: 'cat-002',
    name: 'Slim Fit Jeans',
    description: 'Modern slim fit jeans with a comfortable stretch fabric. Perfect for casual and semi-formal occasions.',
    attributes: {
      sizes: ['30', '32', '34', '36'],
    },
    imgUrls: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1475178626620-a4d074967452?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=800&q=80',
    ],
    skus: [
      { id: 'sku-002-1', productId: 'prod-002', price: 59.99, stock: 8,  attributes: { size: '30' }, imgUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=300&q=80' },
      { id: 'sku-002-2', productId: 'prod-002', price: 59.99, stock: 12, attributes: { size: '32' }, imgUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=300&q=80' },
      { id: 'sku-002-3', productId: 'prod-002', price: 59.99, stock: 10, attributes: { size: '34' }, imgUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=300&q=80' },
      { id: 'sku-002-4', productId: 'prod-002', price: 64.99, stock: 6,  attributes: { size: '36' }, imgUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=300&q=80' },
    ],
  },
  {
    id: 'prod-003',
    tenantId: TENANT_ID,
    categoryId: 'cat-001',
    name: 'Casual Hoodie',
    description: 'Cozy and stylish hoodie made from a soft cotton-polyester blend. Features a kangaroo pocket and adjustable drawstrings.',
    attributes: {
      colors: ['Navy', 'Gray', 'Black'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    },
    imgUrls: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
    ],
    skus: [
      { id: 'sku-003-1', productId: 'prod-003', price: 79.99, stock: 10, attributes: { color: 'Navy',  size: 'M'   }, imgUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80' },
      { id: 'sku-003-2', productId: 'prod-003', price: 79.99, stock: 8,  attributes: { color: 'Navy',  size: 'L'   }, imgUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80' },
      { id: 'sku-003-3', productId: 'prod-003', price: 79.99, stock: 6,  attributes: { color: 'Gray',  size: 'M'   }, imgUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80' },
      { id: 'sku-003-4', productId: 'prod-003', price: 84.99, stock: 5,  attributes: { color: 'Gray',  size: 'XL'  }, imgUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80' },
      { id: 'sku-003-5', productId: 'prod-003', price: 79.99, stock: 9,  attributes: { color: 'Black', size: 'M'   }, imgUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=300&q=80' },
      { id: 'sku-003-6', productId: 'prod-003', price: 84.99, stock: 4,  attributes: { color: 'Black', size: 'XXL' }, imgUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=300&q=80' },
    ],
  },
  {
    id: 'prod-004',
    tenantId: TENANT_ID,
    categoryId: 'cat-001',
    name: 'Premium Polo Shirt',
    description: 'A versatile polo shirt with fine piqué texture. Suitable for both casual and business-casual settings. Available in cotton and polyester.',
    attributes: {
      colors: ['White', 'Navy', 'Green'],
      sizes: ['S', 'M', 'L', 'XL'],
      fabrics: ['Cotton', 'Polyester'],
    },
    imgUrls: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80',
    ],
    skus: [
      { id: 'sku-004-1', productId: 'prod-004', price: 45.99, stock: 8, attributes: { color: 'White', size: 'M', fabric: 'Cotton'    }, imgUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=300&q=80' },
      { id: 'sku-004-2', productId: 'prod-004', price: 45.99, stock: 6, attributes: { color: 'Navy',  size: 'M', fabric: 'Cotton'    }, imgUrl: 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&w=300&q=80' },
      { id: 'sku-004-3', productId: 'prod-004', price: 39.99, stock: 7, attributes: { color: 'White', size: 'L', fabric: 'Polyester' }, imgUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=300&q=80' },
      { id: 'sku-004-4', productId: 'prod-004', price: 45.99, stock: 5, attributes: { color: 'Green', size: 'M', fabric: 'Cotton'    }, imgUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=300&q=80' },
    ],
  },
  {
    id: 'prod-005',
    tenantId: TENANT_ID,
    categoryId: 'cat-003',
    name: 'Canvas Sneakers',
    description: 'Lightweight and breathable canvas sneakers with a vulcanized rubber sole. Classic design for everyday wear.',
    attributes: {
      colors: ['White', 'Black'],
      sizes: ['39', '40', '41', '42', '43'],
    },
    imgUrls: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
    ],
    skus: [
      { id: 'sku-005-1', productId: 'prod-005', price: 69.99, stock: 5, attributes: { color: 'White', size: '40' }, imgUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80' },
      { id: 'sku-005-2', productId: 'prod-005', price: 69.99, stock: 8, attributes: { color: 'White', size: '41' }, imgUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80' },
      { id: 'sku-005-3', productId: 'prod-005', price: 69.99, stock: 6, attributes: { color: 'White', size: '42' }, imgUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80' },
      { id: 'sku-005-4', productId: 'prod-005', price: 69.99, stock: 7, attributes: { color: 'Black', size: '40' }, imgUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=300&q=80' },
      { id: 'sku-005-5', productId: 'prod-005', price: 74.99, stock: 4, attributes: { color: 'Black', size: '42' }, imgUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=300&q=80' },
    ],
  },
  {
    id: 'prod-006',
    tenantId: TENANT_ID,
    categoryId: 'cat-004',
    name: 'Leather Crossbody Bag',
    description: 'Compact and stylish crossbody bag crafted from genuine leather. Features multiple compartments and an adjustable strap.',
    attributes: {
      colors: ['Brown', 'Black', 'Tan'],
    },
    imgUrls: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    ],
    skus: [
      { id: 'sku-006-1', productId: 'prod-006', price: 89.99, stock: 5, attributes: { color: 'Brown' }, imgUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=300&q=80' },
      { id: 'sku-006-2', productId: 'prod-006', price: 89.99, stock: 7, attributes: { color: 'Black' }, imgUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=300&q=80' },
      { id: 'sku-006-3', productId: 'prod-006', price: 94.99, stock: 3, attributes: { color: 'Tan'   }, imgUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=80' },
    ],
  },
  {
    id: 'prod-007',
    tenantId: TENANT_ID,
    categoryId: 'cat-002',
    name: 'Athletic Running Shorts',
    description: 'Lightweight and breathable running shorts with built-in liner. Features moisture-wicking fabric and zippered back pocket.',
    attributes: {
      sizes: ['S', 'M', 'L', 'XL'],
    },
    imgUrls: [
      'https://images.unsplash.com/photo-1508766206392-8bd5cf550d1c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508766206392-8bd5cf550d1c?auto=format&fit=crop&w=800&q=80',
    ],
    skus: [
      { id: 'sku-007-1', productId: 'prod-007', price: 34.99, stock: 15, attributes: { size: 'S'  }, imgUrl: 'https://images.unsplash.com/photo-1508766206392-8bd5cf550d1c?auto=format&fit=crop&w=800&q=80' },
      { id: 'sku-007-2', productId: 'prod-007', price: 34.99, stock: 18, attributes: { size: 'M'  }, imgUrl: 'https://images.unsplash.com/photo-1508766206392-8bd5cf550d1c?auto=format&fit=crop&w=800&q=80' },
      { id: 'sku-007-3', productId: 'prod-007', price: 34.99, stock: 12, attributes: { size: 'L'  }, imgUrl: 'https://images.unsplash.com/photo-1508766206392-8bd5cf550d1c?auto=format&fit=crop&w=800&q=80' },
      { id: 'sku-007-4', productId: 'prod-007', price: 34.99, stock: 8,  attributes: { size: 'XL' }, imgUrl: 'https://images.unsplash.com/photo-1508766206392-8bd5cf550d1c?auto=format&fit=crop&w=800&q=80' },
    ],
  },
  {
    id: 'prod-008',
    tenantId: TENANT_ID,
    categoryId: 'cat-004',
    name: 'Knit Beanie Hat',
    description: 'Warm and cozy knit beanie hat perfect for cold weather. One-size-fits-most with a ribbed design.',
    attributes: {
      colors: ['Charcoal', 'Burgundy', 'Forest Green', 'Camel'],
    },
    imgUrls: [
      'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511915807427-0e8d2c8f5f0b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1487956382158-bb926046304a?auto=format&fit=crop&w=800&q=80',
    ],
    skus: [
      { id: 'sku-008-1', productId: 'prod-008', price: 19.99, stock: 20, attributes: { color: 'Charcoal'     }, imgUrl: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=300&q=80' },
      { id: 'sku-008-2', productId: 'prod-008', price: 19.99, stock: 15, attributes: { color: 'Burgundy'     }, imgUrl: 'https://images.unsplash.com/photo-1511915807427-0e8d2c8f5f0b?auto=format&fit=crop&w=300&q=80' },
      { id: 'sku-008-3', productId: 'prod-008', price: 19.99, stock: 12, attributes: { color: 'Forest Green' }, imgUrl: 'https://images.unsplash.com/photo-1487956382158-bb926046304a?auto=format&fit=crop&w=300&q=80' },
      { id: 'sku-008-4', productId: 'prod-008', price: 22.99, stock: 8,  attributes: { color: 'Camel'        }, imgUrl: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=300&q=80' },
    ],
  },
];

// Add more products for pagination demo (v2 variants)
const v2Products = baseProducts.slice(0, 4).map(p => ({
  ...p,
  id: `${p.id}-v2`,
  name: `${p.name} V2`,
  description: `Updated edition: ${p.description}`,
  skus: p.skus.map(s => ({
    ...s,
    id: `${s.id}-v2`,
    productId: `${p.id}-v2`,
    price: parseFloat((s.price + 10).toFixed(2)),
  })),
}));

// Compute a display price (min SKU price) for each product
const addDisplayPrice = (p) => ({ ...p, price: Math.min(...p.skus.map(s => s.price)) });

export const products = [...baseProducts, ...v2Products].map(addDisplayPrice);
