import React, { useRef } from 'react';
import { toast } from 'sonner';
import { Facebook, AtSign, Globe } from 'lucide-react';
import { useStorefrontConfig } from '../../../features/theme/useStorefrontConfig';

export default function Footer() {
  const emailRef = useRef(null);
  const { content, theme } = useStorefrontConfig();

  const primaryColor = theme?.colors?.primary || '#1754cf';
  const footerTheme = theme?.components?.footer || {
    background: theme?.colors?.background || '#ffffff',
    text: theme?.colors?.text || '#111827',
  };

  const handleSubscribe = () => {
    if (emailRef.current && emailRef.current.value) {
      toast.success('Đăng ký nhận bản tin thành công!');
      emailRef.current.value = '';
    } else {
      toast.error('Vui lòng nhập email của bạn!');
    }
  };

  return (
    <footer
      className="border-t pt-16 pb-12 mt-auto"
      style={{
        backgroundColor: footerTheme.background,
        borderTopColor: `${primaryColor}1A`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center gap-2 mb-6" style={{ color: primaryColor }}>
              <svg className="w-8 h-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="currentColor" fillRule="evenodd"></path>
                <path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
              <span className="text-xl font-bold tracking-tight uppercase" style={{ color: footerTheme.text }}>{content?.general?.siteName || 'Fluxify'}</span>
            </div>
            <p className="text-slate-500 leading-relaxed mb-6 max-w-sm">
              Premium digital solutions for the modern creator. Join over 50,000+ customers building the future.
            </p>
            <div className="flex gap-4">
              <a href="#" aria-label="Facebook" className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-500 hover:bg-primary hover:text-white transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Email" className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-500 hover:bg-primary hover:text-white transition-all">
                <AtSign className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Website" className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-500 hover:bg-primary hover:text-white transition-all">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6" style={{ color: footerTheme.text }}>About Us</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Our Story</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Sustainability</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Newsroom</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6" style={{ color: footerTheme.text }}>Customer Support</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Track Order</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Returns & Exchanges</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6" style={{ color: footerTheme.text }}>Quick Links</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Sale</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Size Guide</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Gift Cards</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Store Locator</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t py-10 flex flex-col md:flex-row items-center justify-between gap-8" style={{ borderTopColor: `${primaryColor}1A` }}>
          <div className="max-w-md">
            <h4 className="font-bold mb-2" style={{ color: footerTheme.text }}>Join our Newsletter</h4>
            <p className="text-sm text-slate-500">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <input ref={emailRef} type="email" placeholder="Enter your email" className="grow md:w-64 px-4 py-2 text-sm bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" />
            <button
              onClick={handleSubscribe}
              className="hover:opacity-90 text-white px-6 py-2 text-sm font-bold rounded-lg transition-colors"
              style={{ backgroundColor: primaryColor }}
            >
              Subscribe
            </button>
          </div>
        </div>
        <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-400 uppercase tracking-widest" style={{ borderTopColor: `${primaryColor}1A` }}>
          <p>© 2024 {content?.general?.siteName || 'Fluxify'} Inc. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
