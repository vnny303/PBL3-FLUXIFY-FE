import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProduct } from '../../entities/product/api/productApi';
import { QUERY_KEYS } from '../../shared/api/queryKeys';

// --- Pure Helper Functions ---
const generateCartesianProduct = (groups) => {
    const validGroups = groups.filter(g => g.name.trim() !== '' && g.values.length > 0);
    if (validGroups.length === 0) return [];
    
    const result = [];
    const helper = (arr, i) => {
        if (i === validGroups.length) {
            const options = [...arr];
            const attributesObj = {};
            validGroups.forEach((g, idx) => {
                attributesObj[g.name] = arr[idx];
            });
            result.push({
                id: options.join('/'),
                options: options.join(' / '),
                attributes: attributesObj,
                price: '',
                stock: ''
            });
            return;
        }
        validGroups[i].values.forEach(val => {
            helper([...arr, val], i + 1);
        });
    };
    helper([], 0);
    return result;
};

// --- Custom Hook ---
export function useAddProduct() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    // --- State ---
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        compareAtPrice: '',
        sku: '',
        barcode: '',
        status: 'active',
        category: '',
        type: '',
        vendor: '',
        tags: ''
    });

    const [variantGroups, setVariantGroups] = useState([]);
    const [generatedSkus, setGeneratedSkus] = useState([]);

    // --- Side Effects ---
    // Keep generatedSkus in sync with variantGroups without losing data
    useEffect(() => {
        setGeneratedSkus(prevSkus => {
            const newSkus = generateCartesianProduct(variantGroups);
            return newSkus.map(newSku => {
                const existing = prevSkus.find(old => old.id === newSku.id);
                return existing 
                    ? { ...newSku, price: existing.price, stock: existing.stock } 
                    : newSku;
            });
        });
    }, [variantGroups]);

    // --- Handlers ---
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const addVariantGroup = useCallback(() => {
        setVariantGroups(prev => {
            if (prev.length >= 3) return prev; // Limit to 3 variant groups
            return [...prev, { id: crypto.randomUUID(), name: '', values: [] }];
        });
    }, []);

    const updateVariantGroupName = useCallback((id, newName) => {
        setVariantGroups(prev => prev.map(g => g.id === id ? { ...g, name: newName } : g));
    }, []);

    const removeVariantGroup = useCallback((id) => {
        setVariantGroups(prev => prev.filter(g => g.id !== id));
    }, []);

    const removeVariantValue = useCallback((groupId, valueToRemove) => {
        setVariantGroups(prev => prev.map(g => {
            if (g.id === groupId) {
                return { ...g, values: g.values.filter(v => v !== valueToRemove) };
            }
            return g;
        }));
    }, []);

    const handleAddVariantValue = useCallback((e, groupId) => {
        if (e.key === 'Enter' && e.target.value.trim()) {
            e.preventDefault();
            const newValue = e.target.value.trim();
            setVariantGroups(prev => prev.map(g => {
                if (g.id === groupId) {
                    if (g.values.includes(newValue)) return g;
                    return { ...g, values: [...g.values, newValue] };
                }
                return g;
            }));
            e.target.value = '';
        }
    }, []);

    const updateSkuField = useCallback((skuId, field, value) => {
        setGeneratedSkus(prev => prev.map(sku => sku.id === skuId ? { ...sku, [field]: value } : sku));
    }, []);

    // --- Data Mutation ---
    const mutation = useMutation({
        mutationFn: (payload) => createProduct({ data: payload }),
        onSuccess: () => {
             // Invalidate product queries so ProductList fetches fresh data
             queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products.all });
             navigate('/products');
        },
        onError: (error) => {
             console.error('Failed to save product', error);
        }
    });

    const handleSave = useCallback(() => {
        // Build attributes JSON string for Main Product
        const attributes = {};
        variantGroups.forEach(g => {
            const trimmedName = g.name.trim();
            if (trimmedName && g.values.length > 0) {
                attributes[trimmedName] = g.values;
            }
        });

        // Build SKUs payload
        const skus = generatedSkus.length > 0 
            ? generatedSkus.map(sku => ({
                price: parseFloat(sku.price) || parseFloat(formData.price) || 0,
                stock: parseInt(sku.stock) || 0,
                attributes: JSON.stringify(sku.attributes),
                imgUrl: ''
              }))
            : [{
                // If no variants, fallback to single base SKU
                price: parseFloat(formData.price) || 0,
                stock: 50,
                attributes: "{}",
                imgUrl: ''
              }];

        const payload = {
            name: formData.name || 'Untitled Product',
            description: formData.description,
            categoryId: "11111111-1111-4111-8111-111111111111", // Mock Category ID
            attributes: JSON.stringify(attributes),
            imgUrls: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"], // Dummy img
            skus
        };

        mutation.mutate(payload);
    }, [formData, variantGroups, generatedSkus, mutation]);

    return {
        state: { formData, isSaving: mutation.isPending, variantGroups, generatedSkus },
        actions: { 
            handleChange, 
            handleSave, 
            addVariantGroup, 
            updateVariantGroupName, 
            removeVariantGroup, 
            removeVariantValue, 
            handleAddVariantValue,
            updateSkuField
        }
    };
}
