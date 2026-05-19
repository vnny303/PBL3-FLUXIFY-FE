import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addressService } from '../../../shared/api/addressService';
import { useAppContext } from '../../../app/providers/useAppContext';
import { toast } from 'sonner';

export function useAddresses() {
  const queryClient = useQueryClient();
  const { user } = useAppContext();

  // Fetch addresses
  const { data: response, isLoading, error } = useQuery({
    queryKey: ['customer-addresses', user?.userId],
    queryFn: () => addressService.getAddresses(user?.tenantId, user?.userId),
    enabled: !!user?.userId
  });

  const addresses = response?.data || [];

  // Mutations
  const saveMutation = useMutation({
    mutationFn: (data) => {
      if (data.id) {
         return addressService.updateAddress(user?.tenantId, user?.userId, data.id, data);
      }
      return addressService.createAddress(user?.tenantId, user?.userId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-addresses', user?.userId] });
      toast.success('Address saved successfully!');
    },
    onError: (err) => {
      toast.error(err?.message || 'Failed to save address');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => addressService.deleteAddress(user?.tenantId, user?.userId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-addresses', user?.userId] });
      toast.success('Address deleted successfully!');
    },
    onError: () => toast.error('Failed to delete address')
  });

  const setDefaultMutation = useMutation({
    mutationFn: (id) => addressService.updateAddress(user?.tenantId, user?.userId, id, { isDefault: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-addresses', user?.userId] });
      toast.success('Default address updated!');
    },
    onError: () => toast.error('Failed to update default address')
  });

  return {
    addresses,
    isLoading,
    error,
    saveAddress: saveMutation.mutate,
    isSaving: saveMutation.isPending,
    deleteAddress: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    setDefault: setDefaultMutation.mutate,
    isSettingDefault: setDefaultMutation.isPending
  };
}
