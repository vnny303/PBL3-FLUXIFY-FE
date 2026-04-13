import React, { useState, useEffect } from 'react';
import { Upload, Download, Filter, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchInventory } from '../../shared/api/mockApi';

const PageHeader = () => (
    <div className="flex justify-between items-center mb-8">
        <div>
            <h2 className="text-2xl font-bold text-on-surface tracking-tight">Inventory</h2>
        </div>
        <div className="flex space-x-3">
            <button type="button" className="px-4 py-2 bg-surface-container-lowest border border-outline-variant/40 rounded-lg text-sm font-semibold text-on-surface shadow-sm hover:bg-surface-container-low transition-colors flex items-center">
                <Upload className="w-4 h-4 mr-2"/> Import
            </button>
            <button type="button" className="px-4 py-2 bg-surface-container-lowest border border-outline-variant/40 rounded-lg text-sm font-semibold text-on-surface shadow-sm hover:bg-surface-container-low transition-colors flex items-center">
                <Download className="w-4 h-4 mr-2"/> Export
            </button>
        </div>
    </div>
);

const InventoryTabs = () => (
    <div className="flex border-b border-outline-variant/30 px-4">
        {['All', 'Incoming', 'Committed', 'Unavailable'].map((tab, i) => (
            <button type="button" key={tab} className={`px-4 py-3 text-sm font-medium transition-colors ${i === 0 ? 'text-on-surface border-b-2 border-on-surface font-semibold' : 'text-on-surface-variant hover:text-on-surface'}`}>
                {tab}
            </button>
        ))}
    </div>
);

const FilterBar = () => (
    <div className="p-4 bg-surface-container-low/50 border-b border-outline-variant/20 flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"/>
            <input type="text" placeholder="Filter inventory..." className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg pl-10 pr-4 py-1.5 text-sm focus:ring-1 focus:ring-primary outline-none"/>
        </div>
        <button type="button" className="p-1.5 text-on-surface-variant hover:bg-surface-container-high rounded-md transition-colors">
            <ArrowUpDown className="w-5 h-5"/>
        </button>
    </div>
);

const InventoryTable = ({ inventory, isLoading }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-surface-container-low/50 text-xs font-semibold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/30">
                        <th className="px-6 py-3 w-10">
                            <input type="checkbox" className="rounded border-outline-variant/50 text-primary focus:ring-primary"/>
                        </th>
                        <th className="px-6 py-3">Product</th>
                        <th className="px-6 py-3">SKU</th>
                        <th className="px-6 py-3 text-right">Available</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, idx) => (
                            <tr key={idx} className="hover:bg-surface-container-low/50 transition-colors">
                                <td className="px-6 py-4"><div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div></td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-lg bg-gray-200 animate-pulse mr-4"></div>
                                        <div>
                                            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-1"></div>
                                            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div></td>
                                <td className="px-6 py-4 text-right"><div className="h-8 w-20 bg-gray-200 rounded animate-pulse ml-auto"></div></td>
                            </tr>
                        ))
                    ) : inventory.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="px-6 py-8 text-center text-sm text-on-surface-variant">
                                No inventory items found.
                            </td>
                        </tr>
                    ) : (
                        inventory.map((item) => (
                            <tr key={item.id} className="hover:bg-surface-container-low/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <input type="checkbox" className="rounded border-outline-variant/50 text-primary focus:ring-primary"/>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-lg bg-surface-container mr-4 overflow-hidden border border-outline-variant/30">
                                            {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover"/> : <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">Img</div>}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-on-surface">{item.productTitle || item.name}</p>
                                            <span className={`inline-block px-2 py-0.5 mt-1 text-[11px] font-medium rounded-md ${item.status === 'out-of-stock' || item.available === 0 ? 'bg-error-container text-error' : 'bg-surface-container text-on-surface-variant'}`}>
                                                {item.variant || 'Default'}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-on-surface-variant font-mono">{item.sku}</td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-end">
                                        <input type="number" defaultValue={item.available || 0} className={`w-20 px-3 py-1.5 text-right rounded-lg text-sm outline-none focus:ring-1 ${item.status === 'out-of-stock' || item.available === 0 ? 'border border-error/50 bg-error-container/20 text-error font-semibold focus:ring-error' : 'border border-outline-variant/40 focus:ring-primary focus:border-primary'}`}/>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

const Pagination = ({ totalCount }) => (
    <div className="p-4 border-t border-outline-variant/30 flex justify-between items-center bg-surface-container-low/30 mt-auto">
        <p className="text-xs text-on-surface-variant">Showing {totalCount} of {totalCount} products</p>
        <div className="flex space-x-2">
            <button type="button" disabled className="p-1 border border-outline-variant/40 rounded-md bg-surface-container-lowest opacity-50 cursor-not-allowed">
                <ChevronLeft className="w-5 h-5"/>
            </button>
            <button type="button" className="p-1 border border-outline-variant/40 rounded-md bg-surface-container-lowest hover:bg-surface-container-low">
                <ChevronRight className="w-5 h-5"/>
            </button>
        </div>
    </div>
);

export default function Inventory() {
    const [inventory, setInventory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadInventory = async () => {
            try {
                setIsLoading(true);
                const data = await fetchInventory();
                setInventory(data);
            }
            catch (err) {
                setError('Failed to load inventory');
            }
            finally {
                setIsLoading(false);
            }
        };
        loadInventory();
    }, []);

    return (
        <div className="p-8 max-w-[1400px] mx-auto pb-16 flex flex-col min-h-[calc(100vh-4rem)]">
            <PageHeader />

            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col flex-1">
                <InventoryTabs />
                <FilterBar />
                
                {error && <div className="p-4 text-red-500 bg-red-50">{error}</div>}
                
                <InventoryTable inventory={inventory} isLoading={isLoading} />
                <Pagination totalCount={inventory.length} />
            </div>
        </div>
    );
}
