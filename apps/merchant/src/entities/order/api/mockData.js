export const MOCK_ORDERS = [
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
        orderItems: [
            {
                id: "oi-uuid-1",
                orderId: "91111111-1111-4111-8111-111111111111",
                productSkuId: "71111111-1111-4111-8111-111111111111",
                selectedOptions: null,
                quantity: 3,
                unitPrice: 129000
            }
        ]
    },
    {
        id: "92222222-2222-4222-8222-222222222222",
        tenantId: "4f8789e6-cad6-4e2b-b60d-ccbf609e4b31",
        customerId: "5c20ba17-29de-459e-b2d2-a2736e85f75d",
        address: "88 Le Loi, Da Nang",
        status: "Paid",
        paymentMethod: "Bank Transfer",
        paymentStatus: "Paid",
        totalAmount: 198000,
        createdAt: "2026-03-30T10:20:00",
        orderItems: []
    }
];
