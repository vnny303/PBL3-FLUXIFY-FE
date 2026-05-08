import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { authService } from '../../../shared/api/authService';
import { useAppContext } from '../../../app/providers/useAppContext';
import { setUser as setUserAction } from '../../../app/store/slices/authSlice';

export function useProfile() {
  const { user } = useAppContext();
  const dispatch = useDispatch();

  const updateProfileMutation = useMutation({
    mutationFn: (data) => authService.updateCustomer(user?.userId, data),
    onSuccess: (updatedData) => {
      toast.success('Profile updated successfully!');
      // Update global state if the API returns the updated user or we merge it
      if (updatedData) {
         dispatch(setUserAction({ ...user, ...updatedData }));
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to update profile');
    }
  });

  const updatePasswordMutation = useMutation({
    mutationFn: (password) => authService.updateCustomer(user?.userId, { password }),
    onSuccess: () => {
      toast.success('Password updated successfully!');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to update password');
    }
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: (file) => authService.uploadAvatar(user?.userId, file),
    onSuccess: (data) => {
      toast.success('Avatar updated successfully!');
      if (data?.avatarUrl) {
        dispatch(setUserAction({ ...user, avatarUrl: data.avatarUrl }));
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to upload avatar');
    }
  });

  return {
    updateProfile: updateProfileMutation.mutate,
    isUpdatingProfile: updateProfileMutation.isPending,
    updatePassword: updatePasswordMutation.mutate,
    isUpdatingPassword: updatePasswordMutation.isPending,
    uploadAvatar: uploadAvatarMutation.mutate,
    isUploadingAvatar: uploadAvatarMutation.isPending
  };
}
