import { storefrontContentFallback } from '../../shared/config/storefrontContentFallback';
import { storefrontThemeFallback } from '../../shared/config/storefrontThemeFallback';

export const useStorefrontConfig = () => {
  return {
    content: storefrontContentFallback,
    theme: storefrontThemeFallback,
  };
};