import React, { useState } from 'react';
import { Activity, Sliders, Package, CheckCircle2, Target, Ear, Plug, Cable, Ruler, Scale, CircleDot, Waves, Zap } from 'lucide-react';
import ReviewList from './ReviewList';

export default function ProductTabs() {
  const [activeTab, setActiveTab] = useState('DESCRIPTION');

  return (
    <div className="mt-20">
      <div className="flex border-b border-slate-200 mb-8">
        {['DESCRIPTION', 'SPECIFICATIONS', 'REVIEWS (128)'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 px-6 text-xs font-bold tracking-widest transition-colors relative ${
              activeTab === tab ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'DESCRIPTION' && (
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="w-full lg:w-2/3">
            <h2 className="text-2xl font-black text-slate-900 mb-4">Precision Audio Engineering</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              The Fluxify Studio Microphone Pro isn't just a tool; it's the center of your creative process. 
              Built with a hand-selected 34mm gold-sputtered diaphragm capsule, it delivers a warmth and 
              character usually reserved for vintage microphones costing thousands.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div className="p-6 rounded-2xl border border-slate-200 bg-white">
                <Activity className=" text-blue-600 text-3xl mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">Cardioid Pattern</h3>
                <p className="text-sm text-slate-500">Focuses on your voice while minimizing background noise from the sides and rear.</p>
              </div>
              <div className="p-6 rounded-2xl border border-slate-200 bg-white">
                <Sliders className=" text-blue-600 text-3xl mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">Internal Shock Mount</h3>
                <p className="text-sm text-slate-500">Decouples the capsule from the mic body to prevent handling noise and vibration interference.</p>
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed">
              Whether you're recording lead vocals, streaming high-stakes gaming, or producing a 
              professional podcast, the Fluxify Pro offers the dynamic range and frequency response 
              needed to make your audio stand out in any mix.
            </p>
          </div>

          <div className="w-full lg:w-1/3">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100">
              <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-6">
                <Package className=" text-blue-600" />
                What's in the box?
              </h3>
              <ul className="space-y-4">
                {[
                  'Fluxify Studio Pro Microphone',
                  'Premium XLR Cable (3m)',
                  'Custom Pop Filter',
                  'Reinforced Carry Case',
                  'Desktop Boom Stand'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className=" text-emerald-500 text-sm mt-0.5" />
                    <span className="text-sm text-slate-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'SPECIFICATIONS' && (
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="w-full lg:w-1/2 space-y-8">
            <div>
              <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-4">
                <Sliders className=" text-blue-600" />
                Acoustic Characteristics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between py-3 border-b border-slate-100">
                  <span className="text-sm text-slate-500 flex items-center gap-2"><Activity className=" text-sm" /> Frequency Response</span>
                  <span className="text-sm font-bold text-slate-900">20Hz - 20kHz</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100">
                  <span className="text-sm text-slate-500 flex items-center gap-2"><Target className=" text-sm" /> Polar Pattern</span>
                  <span className="text-sm font-bold text-slate-900">Cardioid (Unidirectional)</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100">
                  <span className="text-sm text-slate-500 flex items-center gap-2"><Ear className=" text-sm" /> Sensitivity</span>
                  <span className="text-sm font-bold text-slate-900">-32dB ± 2dB</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-4">
                <Plug className=" text-blue-600" />
                Hardware & Connectivity
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between py-3 border-b border-slate-100">
                  <span className="text-sm text-slate-500 flex items-center gap-2"><Cable className=" text-sm" /> Connectivity</span>
                  <span className="text-sm font-bold text-slate-900">Gold-plated XLR 3-pin</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100">
                  <span className="text-sm text-slate-500 flex items-center gap-2"><Ruler className=" text-sm" /> Dimensions</span>
                  <span className="text-sm font-bold text-slate-900">52mm x 190mm</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100">
                  <span className="text-sm text-slate-500 flex items-center gap-2"><Scale className=" text-sm" /> Weight</span>
                  <span className="text-sm font-bold text-slate-900">485g (Mic only)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 space-y-8">
            <div className="p-6 rounded-2xl border border-slate-200 bg-white">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Comparative Performance</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-3 font-medium text-slate-500">Metric</th>
                    <th className="text-left py-3 font-bold text-blue-600">Fluxify Pro</th>
                    <th className="text-left py-3 font-medium text-slate-500">Standard Mic</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-50">
                    <td className="py-3 text-slate-600">Self-Noise</td>
                    <td className="py-3 font-bold text-emerald-600">4dB (Ultra-low)</td>
                    <td className="py-3 text-slate-500">16dB</td>
                  </tr>
                  <tr className="border-b border-slate-50">
                    <td className="py-3 text-slate-600">Max SPL</td>
                    <td className="py-3 font-bold text-emerald-600">148dB</td>
                    <td className="py-3 text-slate-500">130dB</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-slate-600">Diaphragm</td>
                    <td className="py-3 font-bold text-emerald-600">34mm Gold</td>
                    <td className="py-3 text-slate-500">16mm Mylar</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">INTERNAL COMPONENT ARCHITECTURE</h3>
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-200">
                <img src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800" alt="Internal Architecture" className="w-full h-full object-cover opacity-50 grayscale" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <div className="flex gap-6 mb-4">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur flex items-center justify-center mb-2 shadow-sm">
                        <CircleDot className=" text-blue-600" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 uppercase">CAPSULE</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur flex items-center justify-center mb-2 shadow-sm">
                        <Waves className=" text-blue-600" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 uppercase">DAMPING</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur flex items-center justify-center mb-2 shadow-sm">
                        <Zap className=" text-blue-600" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 uppercase">CIRCUITRY</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 max-w-xs">Advanced FET circuitry and a custom-tuned transformer ensure minimal harmonic distortion across the entire spectrum.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'REVIEWS (128)' && (
        <ReviewList />
      )}
    </div>
  );
}
