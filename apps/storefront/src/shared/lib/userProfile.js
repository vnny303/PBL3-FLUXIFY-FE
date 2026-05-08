import { 
  normalizeUserProfile as sharedNormalize,
  getUserDisplayName as sharedGetDisplayName 
} from '@fluxify/shared';

export const normalizeUserProfile = (rawUser) => sharedNormalize(rawUser);

export const getUserDisplayName = (user) => sharedGetDisplayName(user);

export const getUserDisplayEmail = (user) => {
  const normalized = normalizeUserProfile(user);
  return normalized?.email || 'No email';
};

export const getUserInitials = (user) => {
  const name = getUserDisplayName(user);
  if (!name || name === 'Guest') return 'GU';

  const parts = name
    .split(' ')
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] || ''}${parts[parts.length - 1][0] || ''}`.toUpperCase();
};

export const getUserAvatarUrl = (user) => {
  const normalized = normalizeUserProfile(user);
  return normalized?.avatarUrl || '';
};
