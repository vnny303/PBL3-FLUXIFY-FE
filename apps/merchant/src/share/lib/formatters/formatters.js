import { formatCurrency, formatDate as sharedFormatDate } from '@fluxify/shared';

export { formatCurrency };

export const formatDate = (dateString) => sharedFormatDate(dateString);

export const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    switch (status.toLowerCase()) {
        case 'active':
        case 'paid':
        case 'delivered':
        case 'fulfilled':
            return 'bg-green-100 text-green-800';
        case 'pending':
        case 'unfulfilled':
        case 'draft':
            return 'bg-yellow-100 text-yellow-800';
        case 'confirmed':
            return 'bg-blue-100 text-blue-800';
        case 'shipping':
            return 'bg-purple-100 text-purple-800';
        case 'cancelled':
            return 'bg-red-100 text-red-800';
        case 'archived':
        case 'refunded':
        case 'partially fulfilled':
            return 'bg-gray-100 text-gray-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};
