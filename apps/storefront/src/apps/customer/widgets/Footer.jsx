import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { useStorefrontConfig } from '../../../features/theme/useStorefrontConfig';

export default function Footer() {
  const { content, theme } = useStorefrontConfig();

  const primaryColor = theme?.colors?.primary || '#1754cf';
  const footerTheme = theme?.components?.footer || {
    background: theme?.colors?.background || '#ffffff',
    text: theme?.colors?.text || '#111827',
  };

  const storeName = content?.general?.siteName || 'COMPUTER STORE';
  const description = content?.about?.story || 'Reliable tech products for everyday use.';

  return (
    <footer
      className="border-t py-8 mt-auto"
      style={{
        backgroundColor: footerTheme.background,
        borderTopColor: `${primaryColor}20`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-6">
          {/* Column 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" style={{ color: primaryColor }}>
                <path clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="currentColor" fillRule="evenodd"></path>
                <path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
              <span className="text-lg font-bold tracking-tight uppercase" style={{ color: footerTheme.text }}>
                {storeName}
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm" style={{ color: footerTheme.text, opacity: 0.7 }}>
              {description}
            </p>
          </div>

          {/* Column 2: Contact */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: footerTheme.text, opacity: 0.5 }}>Liên hệ</h4>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 shrink-0" style={{ color: footerTheme.text, opacity: 0.5 }} />
              <a href="mailto:support@computer-store.com" className="hover:opacity-75 transition-opacity" style={{ color: footerTheme.text, opacity: 0.85 }}>
                support@computer-store.com
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 shrink-0" style={{ color: footerTheme.text, opacity: 0.5 }} />
              <a href="tel:0123456789" className="hover:opacity-75 transition-opacity" style={{ color: footerTheme.text, opacity: 0.85 }}>
                0123 456 789
              </a>
            </div>
          </div>

          {/* Column 3: Store Info */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: footerTheme.text, opacity: 0.5 }}>Thông tin</h4>
            <div className="flex items-center gap-2 text-sm" style={{ color: footerTheme.text, opacity: 0.85 }}>
              <MapPin className="w-4 h-4 shrink-0" style={{ color: footerTheme.text, opacity: 0.5 }} />
              <span>Đà Nẵng, Việt Nam</span>
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: footerTheme.text, opacity: 0.85 }}>
              <Clock className="w-4 h-4 shrink-0" style={{ color: footerTheme.text, opacity: 0.5 }} />
              <span>Thứ 2 - Thứ 7, 8:00 - 18:00</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-3 text-xs" style={{ borderTopColor: `${primaryColor}15` }}>
          <p style={{ color: footerTheme.text, opacity: 0.5 }}>© 2026 {storeName}. All rights reserved.</p>
          <div className="flex gap-4">
            <span style={{ color: footerTheme.text, opacity: 0.4 }}>Fluxify Ecommerce Platform</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
