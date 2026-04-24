import { useState, useRef, useMemo } from 'react';
import { Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { useAppContext } from '../../../../../app/providers/useAppContext';
import { authService } from '../../../../../shared/api/authService';

export default function ProfileSettings() {
  const { user } = useAppContext();
  const [confirmAction, setConfirmAction] = useState(null);
  
  const initialProfileState = useMemo(() => ({
    firstName: user?.email?.split('@')[0] || '',
    lastName: '',
    phone: '',
    email: user?.email || ''
  }), [user]);

  const [profileForm, setProfileForm] = useState(initialProfileState);
  const [profileErrors, setProfileErrors] = useState({});

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '', // API doesn't actually check current password in PUT, but we keep it for UI
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const photoUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuDwTiP1PXmP8RGuJOK4_Z_PyVhQU1M3dR1iFvEWtpsgmWaKWKyOvGKRX2_vGoESn78NR2YqGoYHq1Sw7Vy4rduWTrKc4bdwvqTm95EnWErL3O-A6_pnu94uEJWlc75OSIj1pH3EXz6hAieGJ0SPs_59hr5m6lDklRByRENzQCkkGid036Ayicyry0DWpdNLU2Zos3N82NAMhivrYi9gi0Pls6dCFcoRmQMh0HogQiDIJkTPXkfu1FIcYMd4cOddaqJd8v2LLzHCgzg";
  const fileInputRef = useRef(null);

  const updateProfileMutation = useMutation({
    mutationFn: (data) => authService.updateCustomer(user?.userId, data),
    onSuccess: () => {
      toast.success('Profile updated successfully!');
      setConfirmAction(null);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to update profile');
      setConfirmAction(null);
    }
  });

  const updatePasswordMutation = useMutation({
    mutationFn: (password) => authService.updateCustomer(user?.userId, { password }),
    onSuccess: () => {
      toast.success('Password updated successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setConfirmAction(null);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to update password');
      setConfirmAction(null);
    }
  });

  const handleSaveProfileClick = () => {
    const newErrors = {};
    if (!profileForm.firstName.trim()) newErrors.firstName = "First Name is required";
    if (!profileForm.lastName.trim()) newErrors.lastName = "Last Name is required";
    if (!profileForm.phone.trim()) newErrors.phone = "Phone Number is required";

    if (Object.keys(newErrors).length > 0) {
      setProfileErrors(newErrors);
      return;
    }
    setProfileErrors({});
    setConfirmAction('save-profile');
  };

  const handleUpdatePasswordClick = () => {
    const newErrors = {};
    if (!passwordForm.currentPassword) newErrors.currentPassword = "Current Password is required";
    
    if (!passwordForm.newPassword) {
      newErrors.newPassword = "New Password is required";
    } else if (passwordForm.newPassword.length < 6) {
      newErrors.newPassword = "New password must be at least 6 characters";
    }
    
    if (!passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setPasswordErrors(newErrors);
      return;
    }
    setPasswordErrors({});
    setConfirmAction('update-password');
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoUrl(url);
    }
  };

  return (
    <section className="flex-1">
      <div className="max-w-4xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Profile Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Update your personal information and security settings.</p>
        </div>
        
        <div className="flex flex-col gap-8">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Personal Information</h2>
            </div>
            <div className="p-6">
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                <div 
                  className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-800 bg-cover bg-center border-4 border-white dark:border-slate-800 shadow-lg" 
                  style={{ backgroundImage: `url('${photoUrl}')` }}
                ></div>
                <div className="flex flex-col items-center sm:items-start gap-2 text-center sm:text-left">
                  <button 
                    disabled
                    className="px-5 py-2 text-sm font-semibold border border-slate-200 dark:border-slate-700 rounded-lg opacity-50 cursor-not-allowed"
                  >
                    Change Photo
                  </button>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Profile photo upload is coming soon.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">First Name</label>
                  <input 
                    type="text" 
                    value={profileForm.firstName}
                    onChange={(e) => {
                      setProfileForm({...profileForm, firstName: e.target.value});
                      if (profileErrors.firstName) setProfileErrors({...profileErrors, firstName: null});
                    }}
                    className={`w-full bg-slate-50 dark:bg-slate-800/50 rounded-lg px-4 py-2.5 text-sm outline-none transition-all ${profileErrors.firstName ? 'border border-red-500 focus:ring-1 focus:ring-red-500 focus:bg-white dark:focus:bg-slate-800' : 'border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-800'}`} 
                  />
                  {profileErrors.firstName && (
                    <p className="flex items-center gap-1 mt-1 text-[13px] text-red-500">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {profileErrors.firstName}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Last Name</label>
                  <input 
                    type="text" 
                    value={profileForm.lastName}
                    onChange={(e) => {
                      setProfileForm({...profileForm, lastName: e.target.value});
                      if (profileErrors.lastName) setProfileErrors({...profileErrors, lastName: null});
                    }}
                    className={`w-full bg-slate-50 dark:bg-slate-800/50 rounded-lg px-4 py-2.5 text-sm outline-none transition-all ${profileErrors.lastName ? 'border border-red-500 focus:ring-1 focus:ring-red-500 focus:bg-white dark:focus:bg-slate-800' : 'border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-800'}`} 
                  />
                  {profileErrors.lastName && (
                    <p className="flex items-center gap-1 mt-1 text-[13px] text-red-500">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {profileErrors.lastName}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      value={user?.email || ''}
                      disabled
                      className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed outline-none" 
                    />
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 italic">Email used for login cannot be changed currently.</p>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
                  <input 
                    type="tel" 
                    value={profileForm.phone}
                    onChange={(e) => {
                      setProfileForm({...profileForm, phone: e.target.value});
                      if (profileErrors.phone) setProfileErrors({...profileErrors, phone: null});
                    }}
                    className={`w-full bg-slate-50 dark:bg-slate-800/50 rounded-lg px-4 py-2.5 text-sm outline-none transition-all ${profileErrors.phone ? 'border border-red-500 focus:ring-1 focus:ring-red-500 focus:bg-white dark:focus:bg-slate-800' : 'border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-800'}`} 
                  />
                  {profileErrors.phone && (
                    <p className="flex items-center gap-1 mt-1 text-[13px] text-red-500">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {profileErrors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
              <button 
                disabled
                className="bg-slate-300 dark:bg-slate-700 text-white font-bold py-2.5 px-6 rounded-lg text-sm cursor-not-allowed"
              >
                Save Changes (Updating...)
              </button>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mb-12">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Change Password</h2>
            </div>
            <div className="p-6 max-w-lg">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Current Password</label>
                  <div className="relative">
                    <input 
                      type={showCurrentPassword ? "text" : "password"} 
                      placeholder="••••••••"
                      value={passwordForm.currentPassword}
                      onChange={(e) => {
                        setPasswordForm({...passwordForm, currentPassword: e.target.value});
                        if (passwordErrors.currentPassword) setPasswordErrors({...passwordErrors, currentPassword: null});
                      }}
                      className={`w-full bg-slate-50 dark:bg-slate-800/50 rounded-lg px-4 py-2.5 pr-10 text-sm outline-none transition-all ${passwordErrors.currentPassword ? 'border border-red-500 focus:ring-1 focus:ring-red-500 focus:bg-white dark:focus:bg-slate-800' : 'border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-800'}`} 
                    />
                    <button 
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className="flex items-center gap-1 mt-1 text-[13px] text-red-500">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {passwordErrors.currentPassword}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">New Password</label>
                  <div className="relative">
                    <input 
                      type={showNewPassword ? "text" : "password"} 
                      placeholder="••••••••"
                      value={passwordForm.newPassword}
                      onChange={(e) => {
                        setPasswordForm({...passwordForm, newPassword: e.target.value});
                        if (passwordErrors.newPassword) setPasswordErrors({...passwordErrors, newPassword: null});
                      }}
                      className={`w-full bg-slate-50 dark:bg-slate-800/50 rounded-lg px-4 py-2.5 pr-10 text-sm outline-none transition-all ${passwordErrors.newPassword ? 'border border-red-500 focus:ring-1 focus:ring-red-500 focus:bg-white dark:focus:bg-slate-800' : 'border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-800'}`} 
                    />
                    <button 
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="flex items-center gap-1 mt-1 text-[13px] text-red-500">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {passwordErrors.newPassword}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Confirm New Password</label>
                  <div className="relative">
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      placeholder="••••••••"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => {
                        setPasswordForm({...passwordForm, confirmPassword: e.target.value});
                        if (passwordErrors.confirmPassword) setPasswordErrors({...passwordErrors, confirmPassword: null});
                      }}
                      className={`w-full bg-slate-50 dark:bg-slate-800/50 rounded-lg px-4 py-2.5 pr-10 text-sm outline-none transition-all ${passwordErrors.confirmPassword ? 'border border-red-500 focus:ring-1 focus:ring-red-500 focus:bg-white dark:focus:bg-slate-800' : 'border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-800'}`} 
                    />
                    <button 
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordErrors.confirmPassword && (
                    <p className="flex items-center gap-1 mt-1 text-[13px] text-red-500">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {passwordErrors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
              <button 
                onClick={handleUpdatePasswordClick}
                className="bg-primary hover:bg-primary-hover text-white font-bold py-2.5 px-6 rounded-lg text-sm transition-all shadow-sm"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {confirmAction && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div 
            className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {confirmAction === 'save-profile' ? 'Save Changes' : 'Update Password'}
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              {confirmAction === 'save-profile' 
                ? 'Are you sure you want to save these changes to your profile?' 
                : 'Are you sure you want to update your password?'}
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setConfirmAction(null)}
                className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (confirmAction === 'save-profile') {
                    updateProfileMutation.mutate({
                      email: user?.email // Backend only supports email/password for now
                    });
                  } else {
                    updatePasswordMutation.mutate(passwordForm.newPassword);
                  }
                }}
                disabled={updateProfileMutation.isPending || updatePasswordMutation.isPending}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-hover transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                {(updateProfileMutation.isPending || updatePasswordMutation.isPending) && <Loader2 className="w-4 h-4 animate-spin" />}
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
