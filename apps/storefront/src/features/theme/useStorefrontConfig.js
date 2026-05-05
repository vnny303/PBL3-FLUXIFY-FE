import { storefrontContentFallback } from '../../shared/config/storefrontContentFallback';
import { storefrontThemeFallback } from '../../shared/config/storefrontThemeFallback';
import { useStorefrontTenant } from './useStorefrontTenant';
import { themeMock } from '../../shared/lib/mocks/themeMock';
import { deepMerge } from '../../shared/lib/deepMerge';

export const useStorefrontConfig = () => {
  const tenantState = useStorefrontTenant();
  const isMockEnabled = import.meta.env.VITE_ENABLE_THEME_MOCK === 'true';

  // Start with hardcoded fallbacks
  let finalContent = { ...storefrontContentFallback };
  let finalTheme = { ...storefrontThemeFallback };

  if (isMockEnabled) {
    // 1. Mock Mode: Overlay mock data on top of fallbacks
    finalContent = deepMerge(finalContent, themeMock.content);
    finalTheme = deepMerge(finalTheme, themeMock.theme);
  } else if (tenantState.tenant) {
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
