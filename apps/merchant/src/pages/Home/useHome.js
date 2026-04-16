import { useState, useEffect } from 'react';
import { getCustomers } from '../../entities/customer/api/customerApi';
import { getOrders } from '../../entities/order/api/orderApi';
import { getProducts } from '../../entities/product/api/productApi';

const toNumber = (value) => (Number.isFinite(Number(value)) ? Number(value) : 0);

export function useHome() {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadStats = async () => {
            try {
                setIsLoading(true);
                const [ordersResponse, products, customers] = await Promise.all([
                    getOrders({ page: 1, limit: 200 }),
                    getProducts(),
                    getCustomers(),
                ]);

                const orders = Array.isArray(ordersResponse?.data)
                    ? ordersResponse.data
                    : [];

                const pendingOrders = orders.filter(
                    (order) => order?.status === 'Pending' || order?.status === 'Processing'
                );

                const totalSales = orders.reduce(
                    (sum, order) => sum + toNumber(order?.totalAmount),
                    0
                );

                const inventoryPressure = Math.min(100, Math.max(10, products.length * 4));
                const customerActivity = Math.min(100, Math.max(10, customers.length * 3));

                setStats({
                    ordersToFulfill: pendingOrders.length,
                    totalSales,
                    liveViews: [
                        15,
                        22,
                        18,
                        35,
                        inventoryPressure,
                        30,
                        customerActivity,
                        25,
                        42,
                        38,
                    ],
                });
            } catch (err) {
                setError(err?.response?.data?.message || 'Failed to load dashboard stats');
            } finally {
                setIsLoading(false);
            }
        };
        loadStats();
    }, []);

    return {
        state: {
            stats,
            isLoading,
            error
        }
    };
}
