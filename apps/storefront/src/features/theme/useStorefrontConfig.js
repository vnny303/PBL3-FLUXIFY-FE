import { storefrontContentFallback } from '../../shared/config/storefrontContentFallback';
import { storefrontThemeFallback } from '../../shared/config/storefrontThemeFallback';
import { useStorefrontTenant } from './useStorefrontTenant';
import { deepMerge } from '../../shared/lib/deepMerge';

export const useStorefrontConfig = () => {
  const tenantState = useStorefrontTenant();

  // Start with hardcoded fallbacks
  let finalContent = { ...storefrontContentFallback };
  let finalTheme = { ...storefrontThemeFallback };

  if (tenantState.tenant) {
    // 2. Live Mode: Overlay real Backend data on top of fallbacks
    if (tenantState.tenant.contentConfig) {
      finalContent = deepMerge(finalContent, tenantState.tenant.contentConfig);
    }
    if (tenantState.tenant.themeConfig) {
      finalTheme = deepMerge(finalTheme, tenantState.tenant.themeConfig);
    }
  }

  // 3. Dynamic overrides from Tenant metadata (Site Name)
  if (tenantState.storeName) {
    if (!finalContent.general) finalContent.general = {};
    finalContent.general.siteName = tenantState.storeName;
    
    if (finalContent.home) {
      finalContent.home.title = tenantState.storeName;
    }
  }

  return {
    content: finalContent,
    theme: finalTheme,
    ...tenantState,
  };
};
