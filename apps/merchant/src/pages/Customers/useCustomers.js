import { useQuery } from '@tanstack/react-query';
import { getCustomers } from '../../entities/customer/api/customerApi';
import { QUERY_KEYS } from '../../shared/api/queryKeys';

export function useCustomers() {
    const { data: customers, isLoading, error } = useQuery({
        queryKey: QUERY_KEYS.customers.all,
        queryFn: () => getCustomers()
    });

    return {
        state: {
            customers: customers || [],
            isLoading,
            error: error ? error.message : null
        }
    };
}
