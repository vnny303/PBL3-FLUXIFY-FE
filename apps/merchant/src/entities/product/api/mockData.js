export const MOCK_PRODUCTS = [
  {
    id: "61111111-1111-4111-8111-111111111111",
    tenantId: "4f8789e6-cad6-4e2b-b60d-ccbf609e4b31",
    categoryId: "11111111-1111-4111-8111-111111111111",
    name: "PBL3 Tee Basic",
    description: "Áo thun cotton trơn, thoáng mát",
    attributes: "{\"color\":[\"black\",\"white\"],\"size\":[\"S\",\"M\",\"L\",\"XL\"]}",
    imgUrls: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"
    ],
    productSkus: [
      {
        id: "71111111-1111-4111-8111-111111111111",
        productId: "61111111-1111-4111-8111-111111111111",
        price: 129000,
        stock: 50,
        attributes: "{\"color\":\"black\",\"size\":\"M\"}",
        imgUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&q=80"
      },
      {
        id: "72111111-1111-4211-8211-121111111111",
        productId: "61111111-1111-4111-8111-111111111111",
        price: 129000,
        stock: 46,
        attributes: "{\"color\":\"white\",\"size\":\"S\"}",
        imgUrl: ""
      }
    ],
    // UI mock fields mapped for table display compatibility
    price: 129000,
    inventory: 96,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&q=80',
    category: 'Apparel',
    vendor: 'Fluxify'
  }
];
