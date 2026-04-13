export const MOCK_CUSTOMERS = [
  {
    id: "50d53159-3d52-4574-9aae-01d8b3a71e06",
    tenantId: "4f8789e6-cad6-4e2b-b60d-ccbf609e4b31",
    email: "dieuhoale6406@gmail.com",
    isActive: true,
    createdAt: "2026-03-04T00:45:25",
    cart: {
      id: "096399d3-0cd8-4654-909a-25d47e8c4433",
      customerId: "50d53159-3d52-4574-9aae-01d8b3a71e06",
      tenantId: "4f8789e6-cad6-4e2b-b60d-ccbf609e4b31",
      cartItems: []
    },
    orders: [
      {
        id: "91111111-1111-4111-8111-111111111111",
        tenantId: "4f8789e6-cad6-4e2b-b60d-ccbf609e4b31",
        customerId: "50d53159-3d52-4574-9aae-01d8b3a71e06",
        address: "12 Nguyen Trai, Q1, TP.HCM",
        status: "Pending",
        paymentMethod: "COD",
        paymentStatus: "Pending",
        totalAmount: 387000,
        createdAt: "2026-03-30T09:15:00",
        orderItems: []
      }
    ],
    // UI Mock fields (not in BE spec but useful for UI table)
    name: "Dieu Hoa Le",
    location: "TP.HCM, VN",
    ordersCount: 1,
    totalSpent: 387000
  }
];
