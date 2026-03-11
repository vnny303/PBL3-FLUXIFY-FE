import React from 'react';

export default function About() {
  return (
    <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-slate-900 mb-4">About Fluxify</h1>
        <p className="text-lg text-slate-500">Curating the best modern essentials for your lifestyle.</p>
      </div>
      
      <div className="rounded-2xl overflow-hidden mb-12 h-64 sm:h-96 bg-slate-200">
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCD1nr2Cxk4t1J3IiDJcLO2g44qpP1Dy27wYvBRR-2wiNIS28bjCqfwkcvMFaHU6d6yFNQmPdJneUWNfTtaJAU_zxdvlhtq84IjFV5DndWxLXEXUsRaHgkQ_S_bct2BAfYDiDrlJ0nTl9pxJHROlJsrtZVkSpc0Ulhgsng9VNsGca5VJ5uSJHvujonozsm5bfoti4oG-xB1QpmJussZkhNDWjFDacU9nv14-toP_NfL5nVbZd8FPULWfkvch2CUCfUh9C8uzdtaNK4" 
          alt="Our Store" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="space-y-8 text-slate-700 leading-relaxed">
        <p>
          Founded in 2024, Fluxify Storefront was born out of a simple idea: shopping for high-quality, modern essentials should be an effortless and beautiful experience. We believe that the objects we surround ourselves with should not only serve a purpose but also inspire us.
        </p>
        <p>
          Our team scours the globe to partner with independent designers, sustainable brands, and innovative creators. Every product in our catalog is carefully vetted for quality, design, and durability. Whether you're looking for the perfect pair of headphones, a minimalist watch, or home decor that speaks to your aesthetic, we've got you covered.
        </p>
        <div className="grid sm:grid-cols-3 gap-8 pt-8 border-t border-slate-200 mt-12">
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Quality First</h3>
            <p className="text-sm text-slate-500">We never compromise on materials or craftsmanship. Built to last.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Modern Design</h3>
            <p className="text-sm text-slate-500">Clean lines, functional forms, and timeless aesthetics.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Sustainable</h3>
            <p className="text-sm text-slate-500">Working towards a greener future with eco-friendly packaging.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
