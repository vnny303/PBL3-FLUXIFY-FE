import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, DollarSign, ShoppingBag, Activity, ChevronRight } from 'lucide-react';
import { fetchAnalytics } from '../../shared/api/mockApi';
import { formatCurrency } from '../../shared/lib/formatters/formatters';

const PageHeader = () => (
    <div className="flex flex-col gap-1 mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-on-surface">Analytics Overview</h2>
        <p className="text-sm text-on-surface-variant">Real-time performance across your entire atelier ecosystem.</p>
    </div>
);

const MetricCard = ({ title, icon: Icon, value, growth, prefix = '', isLoading }) => {
    const isPositive = growth > 0;
    const isNegative = growth < 0;

    return (
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 shadow-sm transition-all hover:shadow-md group">
            <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-surface-container-low rounded-lg group-hover:bg-surface-container transition-colors">
                    <Icon className="w-5 h-5 text-primary"/>
                </div>
                {isLoading ? (
                    <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                ) : isPositive ? (
                    <span className="text-xs font-semibold px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full flex items-center gap-1">
                        <ArrowUp className="w-3 h-3"/> {growth}%
                    </span>
                ) : isNegative ? (
                    <span className="text-xs font-semibold px-2 py-1 bg-rose-50 text-rose-600 rounded-full flex items-center gap-1">
                        <ArrowDown className="w-3 h-3"/> {Math.abs(growth)}%
                    </span>
                ) : (
                    <span className="text-xs font-semibold px-2 py-1 bg-surface-container text-on-surface-variant rounded-full">
                        Stable
                    </span>
                )}
            </div>
            <p className="text-sm font-medium text-on-surface-variant">{title}</p>
            {isLoading ? (
                <div className="h-9 w-32 bg-gray-200 rounded animate-pulse mt-1"></div>
            ) : (
                <h3 className="text-3xl font-extrabold mt-1">{prefix}{value}</h3>
            )}
        </div>
    );
};

const MetricsGrid = ({ data, isLoading }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard 
            title="Total Sales" 
            icon={DollarSign} 
            value={formatCurrency(data?.totalSales || 0)} 
            growth={data?.totalSalesGrowth} 
            isLoading={isLoading} 
        />
        <MetricCard 
            title="Total Orders" 
            icon={ShoppingBag} 
            value={data?.totalOrders || 0} 
            growth={data?.totalOrdersGrowth} 
            isLoading={isLoading} 
        />
        <MetricCard 
            title="Avg Order Value" 
            icon={Activity} 
            value={formatCurrency(data?.avgOrderValue || 0)} 
            growth={data?.avgOrderValueGrowth} 
            isLoading={isLoading} 
        />
    </div>
);

const SalesChartArea = ({ isLoading }) => (
    <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/30 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-8">
            <div>
                <h4 className="text-lg font-bold">Sales over time</h4>
                <p className="text-sm text-on-surface-variant">Net sales performance for the current billing cycle.</p>
            </div>
            <div className="flex gap-2">
                <button type="button" className="px-3 py-1.5 text-xs font-semibold bg-surface-container-lowest border border-outline-variant/40 rounded-lg hover:bg-surface-container-low transition-colors">7 Days</button>
                <button type="button" className="px-3 py-1.5 text-xs font-semibold bg-primary text-white rounded-lg transition-colors">30 Days</button>
            </div>
        </div>
        
        <div className="relative w-full h-80 flex items-end justify-between gap-2 px-2">
            {isLoading ? (
                <div className="w-full h-full bg-gray-100 rounded animate-pulse"></div>
            ) : (
                <>
                    <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] text-on-surface-variant/60 pr-4">
                        <span>$20k</span><span>$15k</span><span>$10k</span><span>$5k</span><span>$0</span>
                    </div>
                    <svg className="w-full h-full pl-8" preserveAspectRatio="none" viewBox="0 0 1000 300">
                        <defs>
                            <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#005bd3" stopOpacity="0.2"></stop>
                                <stop offset="100%" stopColor="#005bd3" stopOpacity="0"></stop>
                            </linearGradient>
                        </defs>
                        <line stroke="#e3e3e3" strokeDasharray="4 4" x1="0" x2="1000" y1="0" y2="0"></line>
                        <line stroke="#e3e3e3" strokeDasharray="4 4" x1="0" x2="1000" y1="75" y2="75"></line>
                        <line stroke="#e3e3e3" strokeDasharray="4 4" x1="0" x2="1000" y1="150" y2="150"></line>
                        <line stroke="#e3e3e3" strokeDasharray="4 4" x1="0" x2="1000" y1="225" y2="225"></line>
                        <path d="M0 300 L0 250 C 100 240, 200 180, 300 200 C 400 220, 500 100, 600 120 C 700 140, 800 50, 900 80 L 1000 100 L 1000 300 Z" fill="url(#chartGradient)"></path>
                        <path d="M0 250 C 100 240, 200 180, 300 200 C 400 220, 500 100, 600 120 C 700 140, 800 50, 900 80 L 1000 100" fill="none" stroke="#005bd3" strokeLinecap="round" strokeWidth="3"></path>
                    </svg>
                </>
            )}
        </div>
        {!isLoading && (
            <div className="flex justify-between pl-14 pr-2 mt-4 text-[10px] text-on-surface-variant/60 font-medium">
                <span>Oct 01</span><span>Oct 07</span><span>Oct 14</span><span>Oct 21</span><span>Oct 28</span><span>Oct 31</span>
            </div>
        )}
    </div>
);

const TopProductsTable = ({ data, isLoading }) => (
    <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/30 shadow-sm flex flex-col">
        <div className="mb-8">
            <h4 className="text-lg font-bold">Top selling products</h4>
            <p className="text-sm text-on-surface-variant">Performance by individual item.</p>
        </div>
        <div className="space-y-6">
            {isLoading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx} className="space-y-2">
                        <div className="flex justify-between">
                            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                            <div className="bg-gray-200 h-full rounded-full animate-pulse" style={{ width: `${Math.random() * 50 + 30}%` }}></div>
                        </div>
                    </div>
                ))
            ) : (
                data?.topProducts?.map((product) => (
                    <div key={product.id} className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold">
                            <span>{product.name}</span>
                            <span className="text-on-surface-variant">{product.units} units</span>
                        </div>
                        <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                            <div className={`${product.color} h-full rounded-full`} style={{ width: product.width }}></div>
                        </div>
                    </div>
                ))
            )}
        </div>
        <button type="button" className="mt-auto pt-8 text-sm font-bold text-primary flex items-center gap-1 hover:underline w-fit">
            View all products <ChevronRight className="w-4 h-4"/>
        </button>
    </div>
);

const CategorySalesWidget = ({ data, isLoading }) => (
    <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/30 shadow-sm flex flex-col">
        <div className="mb-8">
            <h4 className="text-lg font-bold">Sales by category</h4>
            <p className="text-sm text-on-surface-variant">Distribution across product lines.</p>
        </div>
        <div className="flex-1 flex flex-col md:flex-row items-center gap-8 justify-center">
            {isLoading ? (
                <>
                    <div className="w-48 h-48 rounded-full bg-gray-200 animate-pulse"></div>
                    <div className="space-y-3 w-full md:w-auto">
                        {Array.from({ length: 4 }).map((_, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-gray-200 animate-pulse"></div>
                                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-4 w-10 bg-gray-200 rounded animate-pulse ml-auto pl-4"></div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <>
                    <div className="relative w-48 h-48">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" fill="transparent" r="40" stroke="#005bd3" strokeDasharray="251.2" strokeDashoffset="62.8" strokeWidth="12"></circle>
                            <circle className="opacity-80" cx="50" cy="50" fill="transparent" r="40" stroke="#00214d" strokeDasharray="251.2" strokeDashoffset="188.4" strokeWidth="12"></circle>
                            <circle className="opacity-90" cx="50" cy="50" fill="transparent" r="40" stroke="#95bf47" strokeDasharray="251.2" strokeDashoffset="220" strokeWidth="12"></circle>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-black">100%</span>
                            <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mt-1">Total Share</span>
                        </div>
                    </div>
                    <div className="space-y-3 w-full md:w-auto">
                        {data?.categorySales?.map((item) => (
                            <div key={item.id} className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                                <span className="text-xs font-semibold text-on-surface-variant">{item.label}</span>
                                <span className="text-xs font-bold ml-auto pl-4">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    </div>
);

export default function Analytics() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                const result = await fetchAnalytics();
                setData(result);
            }
            catch (err) {
                setError('Failed to load analytics data');
            }
            finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    return (
        <div className="p-8 max-w-[1400px] mx-auto pb-16">
            <PageHeader />
            
            {error && <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}

            <MetricsGrid data={data} isLoading={isLoading} />
            <SalesChartArea isLoading={isLoading} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <TopProductsTable data={data} isLoading={isLoading} />
                <CategorySalesWidget data={data} isLoading={isLoading} />
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-outline-variant/20 text-on-surface-variant/60 text-[11px] font-medium tracking-wide uppercase">
                <span>Last updated: Oct 28, 2026, 10:45 AM</span>
                <span>Powered by Atelier Analytics Engine</span>
            </div>
        </div>
    );
}
