import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrders, updateOrderStatus } from '../../entities/order/api/orderApi';
import { QUERY_KEYS } from '../../shared/api/queryKeys';

export function useOrders() {
    const queryClient = useQueryClient();
    const [statusFilter, setStatusFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 20;

    const { data, isLoading, error } = useQuery({
        queryKey: [...QUERY_KEYS.orders.all, { page: currentPage, limit: pageSize, status: statusFilter }],
        queryFn: () => getOrders({ page: currentPage, limit: pageSize, status: statusFilter }),
    });

    const mutation = useMutation({
        mutationFn: ({ orderId, newStatus }) => updateOrderStatus({ id: orderId, status: newStatus }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all });
        },
        onError: (err) => {
            console.error('Failed to update status', err);
        }
    });

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await mutation.mutateAsync({ orderId, newStatus });
            return true;
        } catch {
            return false;
        }
    };

    return {
        state: {
            orders: data?.data || [],
            totalOrders: data?.total || 0,
            isLoading,
            error: error ? error.message : null,
            statusFilter,
            currentPage,
            pageSize
        },
        actions: {
            setStatusFilter,
            setCurrentPage,
            handleStatusChange
        }
    };
}
