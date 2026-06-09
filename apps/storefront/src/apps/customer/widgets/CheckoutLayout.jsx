import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useStorefrontConfig } from '../../../features/theme/useStorefrontConfig';

export default function CheckoutLayout() {
  const { theme, content } = useStorefrontConfig();
  const primaryColor = theme?.colors?.primary || '#1754cf';
  const headerTheme = theme?.components?.header || {
    background: theme?.colors?.background || '#ffffff',
    text: theme?.colors?.text || '#111827',
  };
  const bgColor = theme?.colors?.background || '#ffffff';
  const textColor = theme?.colors?.text || '#111827';
  const siteName = content?.general?.siteName || 'Fluxify';

  return (
    <div
      className="min-h-screen flex flex-col font-sans transition-colors duration-500"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {/* Minimal Header */}
      <header
        className="sticky top-0 z-50 w-full backdrop-blur-md"
        style={{
          backgroundColor: `${headerTheme.background}CC`,
          borderBottom: `1px solid ${primaryColor}1A`,
          fontFamily: theme?.typography?.fontFamily || 'Inter',
        }}
      >
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity" style={{ color: primaryColor }}>
              {content?.general?.logoUrl ? (
                <img src={content.general.logoUrl} alt={siteName} className="h-8 max-w-[120px] object-contain" />
              ) : (
                <>
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="currentColor" fillRule="evenodd"></path>
                    <path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="currentColor" fillRule="evenodd"></path>
                  </svg>
                  <span className="text-xl font-bold tracking-tight uppercase" style={{ color: headerTheme.text }}>{siteName}</span>
                </>
              )}
            </Link>
            <div className="flex items-center gap-2" style={{ color: headerTheme.text, opacity: 0.75 }}>
              <Lock className="w-4 h-4" />
              <span className="text-sm font-semibold uppercase tracking-wider">Secure Checkout</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="grow">
        <Outlet />
      </div>
    </div>
  );
}
