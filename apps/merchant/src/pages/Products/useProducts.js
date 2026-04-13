import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../../entities/product/api/productApi';
import { QUERY_KEYS } from '../../shared/api/queryKeys';

export function useProducts() {
    const { data: products, isLoading, error } = useQuery({
        queryKey: QUERY_KEYS.products.all,
        queryFn: async () => {
            const data = await getProducts();
            return data.map(p => ({
                ...p,
                title: p.name,
                image: p.imgUrls && p.imgUrls.length > 0 ? p.imgUrls[0] : null,
                price: p.productSkus && p.productSkus.length > 0 ? p.productSkus[0].price : (p.price || 0),
                inventory: p.productSkus ? p.productSkus.reduce((sum, sku) => sum + sku.stock, 0) : (p.inventory || 0),
                status: p.status || 'Active',
                category: p.category || 'Uncategorized'
            }));
        }
    });

    return {
        state: {
            products: products || [],
            isLoading,
            error: error ? error.message : null
        }
    };
}
