export function getStorefrontSubdomain() {
  // 1. Check if we're in dev mode and have a forced subdomain in .env
  const devSubdomain = import.meta.env.VITE_STOREFRONT_SUBDOMAIN;
  if (devSubdomain) {
    return devSubdomain.trim().toLowerCase();
  }

  // 2. Parse from window.location.hostname in production
  const hostname = window.location.hostname;
  
  const parts = hostname.split('.');
  
  if (parts.length >= 2 && parts[0] !== 'www') {
    const rawSubdomain = decodeURIComponent(parts[0]);
    // Convert spaces and pluses into hyphens for database matching compatibility
    return rawSubdomain.replace(/[\s+_]+/g, '-').toLowerCase();
  }

  return '';
}
