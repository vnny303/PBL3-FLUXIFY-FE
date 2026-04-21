export function getStorefrontSubdomain() {
  // 1. Check if we're in dev mode and have a forced subdomain in .env
  const devSubdomain = import.meta.env.VITE_STOREFRONT_SUBDOMAIN;
  if (devSubdomain) {
    return devSubdomain.trim().toLowerCase();
  }

  // 2. Parse from window.location.hostname in production
  // Typically, the format is 'subdomain.fluxify.io'
  // Or 'subdomain.localhost'
  const hostname = window.location.hostname;
  
  // Note: Localhost without a subdomain (e.g. 127.0.0.1 or localhost) might be an edge case
  // If we are developing locally without VITE_STOREFRONT_SUBDOMAIN and on localhost,
  // we might want a fallback or return empty string.
  // We'll split by '.' to extract subdomain
  
  const parts = hostname.split('.');
  
  // Example logic: if parts length > 2 (subdomain.domain.com) -> return parts[0]
  // Or if we know the base domain, we can replace it.
  // For now, returning the easiest implementation for subdomains
  if (parts.length >= 2 && parts[0] !== 'www') {
    return parts[0].toLowerCase();
  }

  return '';
}
