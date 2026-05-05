import React from 'react';
import { useStorefrontConfig } from '../../../../../features/theme/useStorefrontConfig';

export default function About() {
  const { content } = useStorefrontConfig();
  const siteName = content?.general?.siteName || 'Fluxify';
  const story = content?.about?.story;

  return (
    <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">About {siteName}</h1>
        <p className="text-lg text-slate-500">{content?.home?.subtitle || 'Curating the best modern essentials for your lifestyle.'}</p>
      </div>
      
      <div className="rounded-2xl overflow-hidden mb-12 h-64 sm:h-96 bg-slate-200">
        <img 
          src="https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=1200&q=80" 
          alt="Our Store" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed">
        {story ? (
          <div className="whitespace-pre-line">
            {story}
          </div>
        ) : (
          <>
            <p>
              Founded in 2024, {siteName} was born out of a simple idea: shopping for high-quality, modern essentials should be an effortless and beautiful experience. We believe that the objects we surround ourselves with should not only serve a purpose but also inspire us.
            </p>
            <p>
              Our team scours the globe to partner with independent designers, sustainable brands, and innovative creators. Every product in our catalog is carefully vetted for quality, design, and durability.
            </p>
          </>
        )}
        <div className="grid sm:grid-cols-3 gap-8 pt-8 border-t border-slate-200 dark:border-slate-800 mt-12">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Quality First</h3>
            <p className="text-sm text-slate-500">We never compromise on materials or craftsmanship. Built to last.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Modern Design</h3>
            <p className="text-sm text-slate-500">Clean lines, functional forms, and timeless aesthetics.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Sustainable</h3>
            <p className="text-sm text-slate-500">Working towards a greener future with eco-friendly packaging.</p>
          </div>
        </div>
      </div>
    </main>
  );
}

