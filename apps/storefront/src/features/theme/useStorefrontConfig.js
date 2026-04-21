import { storefrontContentFallback } from '../../shared/config/storefrontContentFallback';
import { storefrontThemeFallback } from '../../shared/config/storefrontThemeFallback';
import { useStorefrontTenant } from './useStorefrontTenant';

export const useStorefrontConfig = () => {
  const tenantState = useStorefrontTenant();

  const mergedContent = { ...storefrontContentFallback };
  if (tenantState.storeName) {
    if (!mergedContent.general) mergedContent.general = {};
    mergedContent.general = {
      ...mergedContent.general,
      siteName: tenantState.storeName,
    };
    mergedContent.home = {
      ...mergedContent.home,
      title: tenantState.storeName,
    };
  }

  return {
    content: mergedContent,
    theme: storefrontThemeFallback,
    ...tenantState,
  };
};