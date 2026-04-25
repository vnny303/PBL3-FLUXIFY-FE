const pickFirstString = (...values) => {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }
  return '';
};

const toTitleCase = (value) =>
  value
    .split(/[\s._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const deriveNameFromEmail = (email) => {
  if (!email || typeof email !== 'string') return '';
  const localPart = email.split('@')[0] || '';
  return toTitleCase(localPart);
};

export const normalizeUserProfile = (rawUser) => {
  if (!rawUser || typeof rawUser !== 'object') return null;

  const email = pickFirstString(rawUser.email, rawUser.userEmail, rawUser.username);
  const firstName = pickFirstString(rawUser.firstName, rawUser.givenName);
  const lastName = pickFirstString(rawUser.lastName, rawUser.surname, rawUser.familyName);
  const fullName = pickFirstString(
    rawUser.fullName,
    rawUser.displayName,
    rawUser.name,
    [firstName, lastName].filter(Boolean).join(' '),
    deriveNameFromEmail(email)
  );

  return {
    ...rawUser,
    userId: rawUser.userId || rawUser.id || rawUser.customerId || null,
    tenantId: rawUser.tenantId || rawUser.tenants?.[0]?.tenantId || null,
    email: email || null,
    role: rawUser.role || null,
    firstName: firstName || null,
    lastName: lastName || null,
    fullName: fullName || null,
    phone: pickFirstString(rawUser.phone, rawUser.phoneNumber) || null,
    avatarUrl: pickFirstString(
      rawUser.avatarUrl,
      rawUser.avatar,
      rawUser.photoUrl,
      rawUser.profileImage,
      rawUser.profileImageUrl,
      rawUser.image,
      rawUser.imgUrl
    ) || null,
  };
};

export const getUserDisplayName = (user) => {
  const normalized = normalizeUserProfile(user);
  return normalized?.fullName || 'Guest';
};

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
