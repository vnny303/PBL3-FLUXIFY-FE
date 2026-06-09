import { useState, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { useAppContext } from '../../../../../app/providers/useAppContext';
import { normalizeUserProfile, getUserAvatarUrl, getUserDisplayName } from '../../../../../shared/lib/userProfile';
import { useStorefrontConfig } from '../../../../../features/theme/useStorefrontConfig';
import { useProfile } from '../../../../../features/profile/model/useProfile';
import AvatarSection from '../../../../../features/profile/ui/AvatarSection';
import PersonalInfoForm from '../../../../../features/profile/ui/PersonalInfoForm';
import PasswordChangeForm from '../../../../../features/profile/ui/PasswordChangeForm';

export default function ProfileSettings() {
  const { theme } = useStorefrontConfig();
  const primaryColor = theme?.colors?.primary || '#1754cf';
  const borderRadius = theme?.layout?.borderRadius || 12;
  const textColor = theme?.colors?.text || '#111827';
  const sectionBg = '#f8fafc';

  const { user } = useAppContext();
  const { updateProfile, isUpdatingProfile, updatePassword, isUpdatingPassword, uploadAvatar, isUploadingAvatar } = useProfile();

  const normalizedUser = useMemo(() => normalizeUserProfile(user), [user]);
  const userDisplayName = getUserDisplayName(normalizedUser);
  const photoInitial = useMemo(() => userDisplayName.split(' ').filter(Boolean).slice(0, 2).map(p => p[0]?.toUpperCase()).join('') || 'GU', [userDisplayName]);

  // Forms State
  const [profileForm, setProfileForm] = useState({
    firstName: normalizedUser?.firstName || normalizedUser?.fullName?.split(' ')?.[0] || '',
    lastName: normalizedUser?.lastName || normalizedUser?.fullName?.split(' ')?.slice(1).join(' ') || '',
    phone: normalizedUser?.phone || ''
  });
  const [profileErrors, setProfileErrors] = useState({});

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  const [confirmAction, setConfirmAction] = useState(null);

  // Handlers
  const handleProfileChange = (name, value) => {
    setProfileForm(prev => ({ ...prev, [name]: value }));
    if (profileErrors[name]) setProfileErrors(prev => ({ ...prev, [name]: null }));
  };

  const handlePasswordChange = (name, value) => {
    setPasswordForm(prev => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) setPasswordErrors(prev => ({ ...prev, [name]: null }));
  };

  const validateProfile = () => {
    const errors = {};
    if (!profileForm.firstName.trim()) errors.firstName = "First Name is required";
    if (!profileForm.lastName.trim()) errors.lastName = "Last Name is required";
    if (!profileForm.phone.trim()) errors.phone = "Phone Number is required";
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePassword = () => {
    const errors = {};
    if (!passwordForm.currentPassword) errors.currentPassword = "Current Password is required";
    if (!passwordForm.newPassword) errors.newPassword = "New Password is required";
    else if (passwordForm.newPassword.length < 6) errors.newPassword = "Minimum 6 characters";
    if (passwordForm.newPassword !== passwordForm.confirmPassword) errors.confirmPassword = "Passwords do not match";
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onConfirm = () => {
    if (confirmAction === 'save-profile') {
      updateProfile({ ...profileForm, email: user?.email }, { onSuccess: () => setConfirmAction(null) });
    } else {
      updatePassword({ oldPass: passwordForm.currentPassword, password: passwordForm.newPassword }, { 
        onSuccess: () => {
          setConfirmAction(null);
          setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } 
      });
    }
  };

  return (
    <section className="flex-1">
      <div className="max-w-4xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: textColor }}>Profile Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Update your personal information and security settings.</p>
        </div>
        
        <div className="flex flex-col gap-8">
          <div 
            className="rounded-xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 overflow-hidden p-6"
            style={{ backgroundColor: '#ffffff', color: textColor }}
          >
            <AvatarSection 
              photoUrl={getUserAvatarUrl(normalizedUser)} 
              photoInitial={photoInitial} 
              isUploading={isUploadingAvatar} 
              onPhotoChange={uploadAvatar} 
              primaryColor={primaryColor} 
              borderRadius={borderRadius} 
            />

            <PersonalInfoForm 
              formData={profileForm} 
              errors={profileErrors} 
              onChange={handleProfileChange} 
              onSave={() => validateProfile() && setConfirmAction('save-profile')} 
              isSaving={isUpdatingProfile} 
              userEmail={user?.email} 
              primaryColor={primaryColor} 
              borderRadius={borderRadius} 
              sectionBg={sectionBg} 
            />
          </div>
          
          <PasswordChangeForm 
            formData={passwordForm} 
            errors={passwordErrors} 
            onChange={handlePasswordChange} 
            onSave={() => validatePassword() && setConfirmAction('update-password')} 
            isSaving={isUpdatingPassword} 
            primaryColor={primaryColor} 
            borderRadius={borderRadius} 
            sectionBg={sectionBg} 
          />
        </div>
      </div>

      {confirmAction && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200" style={{ borderRadius: `${borderRadius}px` }}>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {confirmAction === 'save-profile' ? 'Save Changes' : 'Update Password'}
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              {confirmAction === 'save-profile' ? 'Are you sure?' : 'Confirm password change?'}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmAction(null)} className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm font-bold">Cancel</button>
              <button 
                onClick={onConfirm} 
                disabled={isUpdatingProfile || isUpdatingPassword}
                className="flex-1 px-4 py-2 text-white text-sm font-bold shadow-sm flex items-center justify-center gap-2"
                style={{ backgroundColor: primaryColor, borderRadius: `${borderRadius}px` }}
              >
                {(isUpdatingProfile || isUpdatingPassword) && <Loader2 className="w-4 h-4 animate-spin" />}
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
