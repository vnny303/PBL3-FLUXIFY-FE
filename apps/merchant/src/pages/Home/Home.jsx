import React, { useState } from 'react';
import { Circle, CheckCircle2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHome } from './useHome';
import { formatCurrency } from '../../shared/lib/formatters/formatters';

const stepsData = [
    {
        id: 1,
        title: 'Add your first product',
        description: 'Write a description, add photos, and set pricing for the products you plan to sell.',
        buttonText: 'Add product',
        path: '/products/add'
    },
    {
        id: 2,
        title: 'Customize your online store',
        description: 'Choose a theme and add your logo, colors, and images to reflect your brand.',
        buttonText: 'Customize theme',
        path: '/online-store'
    },
    {
        id: 3,
        title: 'Name your store',
        description: 'Your store name will appear in your admin and your online store.',
        buttonText: 'Name store',
        path: '/settings'
    }
];

export default function Home() {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(1);
    const [completedSteps, setCompletedSteps] = useState([]);
    const [isDismissed, setIsDismissed] = useState(false);
    
    const { state } = useHome();
    const { stats, isLoading, error } = state;
    const toggleCompletion = (id, e) => {
        e.stopPropagation();
        setCompletedSteps(prev => {
            const isCurrentlyCompleted = prev.includes(id);
            const newCompleted = isCurrentlyCompleted
                ? prev.filter(stepId => stepId !== id)
                : [...prev, id];
            // Auto-advance to next incomplete step
            if (!isCurrentlyCompleted) {
                const nextIncomplete = stepsData.find(s => !newCompleted.includes(s.id));
                if (nextIncomplete) {
                    setActiveStep(nextIncomplete.id);
                }
                else {
                    setActiveStep(null); // All completed, collapse all
                }
            }
            return newCompleted;
        });
    };
    const progressPercentage = (completedSteps.length / stepsData.length) * 100;
    const isFullyCompleted = completedSteps.length === stepsData.length;
    return (<div className="bg-[#f1f2f4] min-h-screen text-[#1a1a1a]">
      <div className="max-w-[1400px] mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Customize your store</h1>

        {/* Setup Guide */}
        {!isDismissed && (<div className="bg-white rounded-xl shadow-sm p-5 mb-6 transition-all">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">
                {isFullyCompleted ? 'Setup complete' : 'Setup guide'}
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">{completedSteps.length} / {stepsData.length} completed</span>
                <div className="bg-[#e3e3e3] h-1.5 w-16 rounded-full overflow-hidden">
                  <div className="bg-black h-1.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }}></div>
                </div>
              </div>
            </div>

            {isFullyCompleted && (<div className="mb-4 p-4 bg-[#f8f8f8] rounded-lg border border-[#e3e3e3] flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-500">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle2 className="w-5 h-5 text-green-600"/>
                  </div>
                  <div>
                    <p className="font-medium text-sm">You're all set!</p>
                    <p className="text-xs text-gray-500">Your store is ready to launch.</p>
                  </div>
                </div>
                <button onClick={() => setIsDismissed(true)} className="text-sm font-medium text-gray-600 hover:text-black transition-colors flex items-center gap-1">
                  <X className="w-4 h-4"/>
                  Dismiss
                </button>
              </div>)}

            <div className="space-y-2">
              {stepsData.map((step) => {
                const isCompleted = completedSteps.includes(step.id);
                const isActive = activeStep === step.id;
                return (<div key={step.id} className="rounded-lg">
                    <div className="flex items-start gap-3 p-2 cursor-pointer rounded-lg hover:bg-[#f8f8f8] transition-colors" onClick={() => setActiveStep(isActive ? null : step.id)}>
                      <button onClick={(e) => toggleCompletion(step.id, e)} className="mt-0.5 shrink-0 focus:outline-none">
                        {isCompleted ? (<CheckCircle2 className="w-5 h-5 text-black fill-black/10"/>) : (<Circle className="w-5 h-5 text-gray-400 hover:text-black transition-colors"/>)}
                      </button>
                      <div className="flex-1">
                        <h3 className={`font-medium text-sm transition-colors ${isCompleted ? 'text-gray-500 line-through' : 'text-[#1a1a1a]'}`}>
                          {step.title}
                        </h3>
                        
                        {isActive && (<div className="mt-2 pr-4 pb-2 animate-in fade-in slide-in-from-top-1 duration-200">
                            <p className="text-sm text-gray-600 mb-3">
                              {step.description}
                            </p>
                            <button onClick={(e) => {
                            e.stopPropagation();
                            navigate(step.path);
                        }} className="bg-black text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                              {step.buttonText}
                            </button>
                          </div>)}
                      </div>
                    </div>
                  </div>);
            })}
            </div>
          </div>)}

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 hover:bg-[#f8f8f8] cursor-pointer transition-colors">
            <p className="text-xs font-semibold text-gray-500 mb-1">ORDERS TO FULFILL</p>
            {isLoading ? (<div className="h-8 w-16 bg-gray-200 rounded animate-pulse mt-1"></div>) : (<p className="text-2xl font-bold">{stats?.ordersToFulfill || 0}</p>)}
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 hover:bg-[#f8f8f8] cursor-pointer transition-colors">
            <p className="text-xs font-semibold text-gray-500 mb-1">TOTAL SALES TODAY</p>
            {isLoading ? (<div className="h-8 w-32 bg-gray-200 rounded animate-pulse mt-1"></div>) : (<p className="text-2xl font-bold">{formatCurrency(stats?.totalSales || 0)}</p>)}
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-3 gap-4">
          {/* Live Views Chart */}
          <div className="col-span-2 bg-white rounded-xl shadow-sm p-5 flex flex-col justify-between min-h-[200px]">
            <div>
              <h3 className="font-semibold text-sm">Live views</h3>
              <p className="text-xs text-gray-500">Visitors in the last 30 minutes</p>
            </div>
            
            <div className="flex items-end gap-1 h-24 mt-4">
              {isLoading ? (Array.from({ length: 10 }).map((_, i) => (<div key={i} className="flex-1 bg-gray-200 rounded-t-sm animate-pulse" style={{ height: `${Math.random() * 60 + 20}%` }}></div>))) : ((stats?.liveViews || []).map((height, i) => (<div key={i} className="flex-1 bg-[#e3e3e3] rounded-t-sm hover:bg-gray-400 transition-colors" style={{ height: `${height}%` }}></div>)))}
            </div>
          </div>

          {/* Promotional Card */}
          <div className="col-span-1 bg-[#1a1a1a] text-white rounded-xl p-5 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg mb-2">Fluxify Plus</h3>
              <p className="text-sm text-gray-300">
                Upgrade to unlock automation features and advanced reporting.
              </p>
            </div>
            <button className="bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors mt-4">
              Learn more
            </button>
          </div>
        </div>
      </div>
    </div>);
}
