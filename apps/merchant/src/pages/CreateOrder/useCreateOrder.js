import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrder } from '../../entities/order/api/orderApi';
import { QUERY_KEYS } from '../../shared/api/queryKeys';

export function useCreateOrder() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    // --- State ---
    const [errorMessage, setErrorMessage] = useState("");
    
    const [orderItems, setOrderItems] = useState([
        {
            productSkuId: "71111111-1111-4111-8111-111111111111",
            productName: "Product A from Doc",
            variantName: "Variant X",
            quantity: 3,
            unitPrice: 129000,
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop"
        },
        {
            productSkuId: "73111111-1111-4311-8311-131111111111",
            productName: "Product B from Doc",
            variantName: "Variant Y",
            quantity: 1,
            unitPrice: 149000,
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80"
        }
    ]);
    const [address, setAddress] = useState("12 Nguyen Trai, Q1, TP.HCM");
    const [customerId, setCustomerId] = useState("50d53159-3d52-4574-9aae-01d8b3a71e06");
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [paymentStatus, setPaymentStatus] = useState("Pending");

    // --- Computed Values ---
    const totalAmount = useMemo(() => 
        orderItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice || 0), 0)
    , [orderItems]);

    // --- Data Mutation ---
    const mutation = useMutation({
        mutationFn: (payload) => createOrder({ tenantId: '4f8789e6-cad6-4e2b-b60d-ccbf609e4b31', data: payload }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all });
            navigate('/orders');
        },
        onError: (error) => {
            console.error('Failed to save order', error);
            setErrorMessage(error.message || "Failed to create order");
        }
    });

    // --- Handlers ---
    const updateQuantity = useCallback((index, newQuantity) => {
        const value = parseInt(newQuantity, 10);
        setOrderItems(prev => {
            const newItems = [...prev];
            newItems[index].quantity = isNaN(value) ? '' : Math.max(1, value);
            return newItems;
        });
    }, []);

    const removeItem = useCallback((index) => {
        setOrderItems(prev => prev.filter((_, i) => i !== index));
    }, []);

    const handleSave = useCallback(() => {
        setErrorMessage("");
        
        const requestPayload = {
            customerId: customerId || null,
            address,
            paymentMethod,
            paymentStatus,
            orderItems: orderItems.map(item => ({
                productSkuId: item.productSkuId,
                quantity: parseInt(item.quantity, 10) || 0,
                unitPrice: item.unitPrice
            }))
        };
        
        mutation.mutate(requestPayload);
    }, [customerId, address, paymentMethod, paymentStatus, orderItems, mutation]);

    return {
        state: {
            orderItems,
            address,
            customerId,
            paymentMethod,
            paymentStatus,
            totalAmount,
            isSaving: mutation.isPending,
            errorMessage
        },
        actions: {
            setAddress,
            setCustomerId,
            setPaymentMethod,
            setPaymentStatus,
            updateQuantity,
            removeItem,
            handleSave
        }
    };
}
