// Mock Data
const MOCK_PRODUCTS = [
    { id: '1', title: 'Premium Cotton T-Shirt', price: 450000, inventory: 124, status: 'Active', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&q=80', category: 'Apparel', vendor: 'Fluxify' },
    { id: '2', title: 'Minimalist Watch', price: 2500000, inventory: 45, status: 'Active', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80', category: 'Accessories', vendor: 'Timepiece Co.' },
    { id: '3', title: 'Leather Crossbody Bag', price: 1200000, inventory: 0, status: 'Draft', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100&q=80', category: 'Accessories', vendor: 'LeatherCraft' },
    { id: '4', title: 'Wireless Noise-Cancelling Headphones', price: 4500000, inventory: 12, status: 'Active', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=80', category: 'Electronics', vendor: 'AudioTech' },
    { id: '5', title: 'Ceramic Coffee Mug', price: 150000, inventory: 300, status: 'Active', image: 'https://images.unsplash.com/photo-1514066558159-fc8c737ef259?w=100&q=80', category: 'Home', vendor: 'Ceramics Studio' },
];
let MOCK_ORDERS = [
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
const MOCK_CUSTOMERS = [
    { id: '1', name: 'John Doe', email: 'john.doe@example.com', phone: '+84 901 234 567', address: '123 Le Loi, District 1', location: 'Ho Chi Minh City, VN', ordersCount: 5, totalSpent: 2500000 },
    { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', phone: '+84 902 345 678', address: '456 Tran Hung Dao, Hoan Kiem', location: 'Hanoi, VN', ordersCount: 2, totalSpent: 1200000 },
    { id: '3', name: 'Alice Johnson', email: 'alice.j@example.com', phone: '+84 903 456 789', address: '789 Nguyen Van Linh, Hai Chau', location: 'Da Nang, VN', ordersCount: 1, totalSpent: 450000 },
    { id: '4', name: 'Bob Brown', email: 'bob.b@example.com', phone: '+84 904 567 890', address: '101 30/4 Street, Ninh Kieu', location: 'Can Tho, VN', ordersCount: 8, totalSpent: 8500000 },
    { id: '5', name: 'Charlie Davis', email: 'charlie.d@example.com', phone: '+84 905 678 901', address: '202 Lach Tray, Ngo Quyen', location: 'Hai Phong, VN', ordersCount: 3, totalSpent: 1500000 },
    { id: '50d53159-3d52-4574-9aae-01d8b3a71e06', name: 'API Customer', email: 'mock@example.com', phone: '+84 999 999 999', address: '12 Nguyen Trai, Q1, TP.HCM', location: 'Ho Chi Minh City, VN', ordersCount: 0, totalSpent: 0 },
];
const MOCK_DASHBOARD_STATS = {
    totalSales: 15450000,
    ordersToFulfill: 5,
    liveViews: [20, 35, 25, 45, 60, 40, 30, 15, 50, 75],
};
const MOCK_INVENTORY = [
    { id: '1', productTitle: 'Premium Cotton T-Shirt', sku: 'TSHIRT-001', available: 124, incoming: 50 },
    { id: '2', productTitle: 'Minimalist Watch', sku: 'WATCH-001', available: 45, incoming: 0 },
    { id: '3', productTitle: 'Leather Crossbody Bag', sku: 'BAG-001', available: 0, incoming: 20 },
    { id: '4', productTitle: 'Wireless Noise-Cancelling Headphones', sku: 'AUDIO-001', available: 12, incoming: 100 },
    { id: '5', productTitle: 'Ceramic Coffee Mug', sku: 'MUG-001', available: 300, incoming: 0 },
];
const MOCK_STORE_SETTINGS = {
    storeName: 'FLUXIFY',
    subdomain: 'fluxify.fluxify.com',
    logoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop',
    supportEmail: 'support@fluxify.com',
    phoneNumber: '+84 123 456 789',
    operatingAddress: '123 Commerce St, Ho Chi Minh City, VN',
    currency: 'VND',
    plan: 'Pro Plan',
    storageUsed: 12.4,
    storageLimit: 50
};
const MOCK_ANALYTICS_DATA = {
    totalSales: 15250,
    totalSalesGrowth: 12,
    totalOrders: 345,
    totalOrdersGrowth: -5,
    avgOrderValue: 44.20,
    avgOrderValueGrowth: 0,
    topProducts: [
        { id: 1, name: 'Silk Minimalist Blouse', units: 124, width: '85%', color: 'bg-primary' },
        { id: 2, name: 'Tapered Linen Trousers', units: 98, width: '65%', color: 'bg-primary/80' },
        { id: 3, name: 'Structured Blazer', units: 72, width: '45%', color: 'bg-primary/60' },
        { id: 4, name: 'Leather Chelsea Boots', units: 54, width: '35%', color: 'bg-primary/40' },
    ],
    categorySales: [
        { id: 1, label: 'Apparel', value: '45%', color: 'bg-[#005bd3]' },
        { id: 2, label: 'Footwear', value: '30%', color: 'bg-[#00214d]' },
        { id: 3, label: 'Accessories', value: '15%', color: 'bg-[#95bf47]' },
        { id: 4, label: 'Others', value: '10%', color: 'bg-surface-container-highest' },
    ]
};
// Helper to simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
// API Functions
export const fetchProducts = async () => {
    await delay(800);
    return MOCK_PRODUCTS;
};
export const fetchOrders = async (page = 1, pageSize = 20, status) => {
    await delay(700);
    let filteredOrders = MOCK_ORDERS;
    if (status && status !== 'All') {
        filteredOrders = MOCK_ORDERS.filter(o => o.status === status);
    }
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedOrders = filteredOrders.slice(start, end);
    return {
        data: paginatedOrders,
        total: filteredOrders.length
    };
};
export const updateOrderStatus = async (id, status) => {
    await delay(500);
    if (!status) {
        throw new Error("400: Validation fail - status is required");
    }
    const orderIndex = MOCK_ORDERS.findIndex(o => o.id === id);
    if (orderIndex > -1) {
        MOCK_ORDERS[orderIndex].status = status;
        return; // 204 No Content
    }
    throw new Error('404: Order không tồn tại trong tenant');
};
export const fetchOrderDetails = async (orderId) => {
    await delay(600);
    const existingOrder = MOCK_ORDERS.find(o => o.id === orderId);
    if (existingOrder) {
        const customer = MOCK_CUSTOMERS.find(c => c.id === existingOrder.customerId);
        return {
            ...existingOrder,
            customerName: customer ? customer.name : 'Unknown Customer'
        };
    }
    throw new Error('404: Order không tồn tại hoặc không thuộc tenant');
};
export const fetchCustomers = async () => {
    await delay(600);
    return MOCK_CUSTOMERS;
};
export const fetchCustomerDetails = async (customerId) => {
    await delay(600);
    const customer = MOCK_CUSTOMERS.find(c => c.id === customerId);
    if (!customer)
        throw new Error('Customer not found');
    return customer;
};
export const fetchCustomerOrders = async (customerId) => {
    await delay(700);
    // For mock purposes, we'll just return some random orders from MOCK_ORDERS
    // In a real app, this would filter by customerId
    return MOCK_ORDERS.slice(0, 3);
};
export const fetchDashboardStats = async () => {
    await delay(500);
    return MOCK_DASHBOARD_STATS;
};
export const fetchInventory = async () => {
    await delay(750);
    return MOCK_INVENTORY;
};
export const fetchStoreSettings = async () => {
    await delay(600);
    return MOCK_STORE_SETTINGS;
};
export const fetchAnalytics = async () => {
    await delay(800);
    return MOCK_ANALYTICS_DATA;
};
export const saveProduct = async (productData) => {
    await delay(1000);
    return { success: true, id: Math.random().toString(36).substr(2, 9) };
};
export const saveCategory = async (categoryData) => {
    await delay(1000);
    return { success: true, id: Math.random().toString(36).substr(2, 9) };
};
export const saveOrder = async (orderData) => {
    await delay(1000);
    return { success: true, id: Math.random().toString(36).substr(2, 9) };
};

// Simulated direct order creation endpoint
// POST /api/tenants/{tenantId}/orders
export const createOrder = async (tenantId, request) => {
    await delay(1000);
    
    // Validation
    if (!request.address) {
        throw new Error("400: Validation fail - address is required");
    }
    if (!request.orderItems || request.orderItems.length === 0) {
        throw new Error("400: Validation fail - orderItems Required, at least 1 item");
    }
    
    request.orderItems.forEach(item => {
        if (!item.productSkuId) throw new Error("400: Validation fail - orderItems[].productSkuId Required");
        if (item.quantity === undefined || item.quantity < 1) throw new Error("400: Validation fail - orderItems[].quantity Required, >= 1");
        if (item.unitPrice === undefined || item.unitPrice < 0) throw new Error("400: Validation fail - orderItems[].unitPrice Required, >= 0");
    });

    if (request.customerId) {
        const customer = MOCK_CUSTOMERS.find(c => c.id === request.customerId);
        if (!customer) throw new Error("400: customerId không tồn tại trong tenant");
    }

    // Logic
    const totalAmount = request.orderItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    const newOrderId = "91111111-1111-4111-8111-" + Math.random().toString(36).substr(2, 9); // mock uuid
    
    const newOrder = {
        id: newOrderId,
        tenantId: tenantId,
        customerId: request.customerId || null,
        address: request.address,
        status: "Pending",
        paymentMethod: request.paymentMethod || "COD",
        paymentStatus: request.paymentStatus || "Pending",
        totalAmount: totalAmount,
        createdAt: new Date().toISOString(),
        orderItems: request.orderItems.map((item, index) => ({
            id: `oi-uuid-${index + 1}`,
            orderId: newOrderId,
            productSkuId: item.productSkuId,
            selectedOptions: null,
            quantity: item.quantity,
            unitPrice: item.unitPrice
        }))
    };

    MOCK_ORDERS.unshift(newOrder);

    return newOrder;
};
