import React from 'react';
import { Search, Upload, Download, ChevronDown, Plus, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProducts } from './useProducts';
import { formatCurrency, getStatusColor } from '../../shared/lib/formatters/formatters';

// --- Subcomponents ---

const PageHeader = () => (
    <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-on-surface">Products</h2>
        <div className="flex gap-3">
            <button type="button" className="bg-surface-container-lowest border border-outline-variant/40 text-on-surface shadow-sm font-medium hover:bg-surface-container-low rounded-md px-3 py-1.5 text-sm flex items-center gap-2 transition-colors">
                <Upload className="w-4 h-4"/> Export
            </button>
            <button type="button" className="bg-surface-container-lowest border border-outline-variant/40 text-on-surface shadow-sm font-medium hover:bg-surface-container-low rounded-md px-3 py-1.5 text-sm flex items-center gap-2 transition-colors">
                <Download className="w-4 h-4"/> Import
            </button>
            <button type="button" className="bg-surface-container-lowest border border-outline-variant/40 text-on-surface shadow-sm font-medium hover:bg-surface-container-low rounded-md px-3 py-1.5 text-sm flex items-center gap-2 transition-colors">
                More actions <ChevronDown className="w-4 h-4"/>
            </button>
            <Link to="/products/add" className="bg-primary text-white hover:bg-primary-fixed font-medium shadow-sm rounded-lg px-3 py-1.5 text-sm transition-colors flex items-center">
                Add product
            </Link>
        </div>
    </div>
);

const FilterBar = () => (
    <>
        <div className="p-3 flex items-center gap-3 border-b border-outline-variant/30">
            <div className="flex-1 flex items-center gap-2 px-2">
                <Search className="w-4 h-4 text-on-surface-variant"/>
                <input type="text" placeholder="Searching all products" className="bg-transparent border-none outline-none text-sm w-full p-0 focus:ring-0 placeholder:text-on-surface-variant"/>
            </div>
            <div className="flex items-center gap-3">
                <button type="button" className="text-on-surface-variant hover:text-on-surface text-sm font-medium transition-colors">Cancel</button>
                <button type="button" className="bg-surface-container-lowest border border-outline-variant/40 text-on-surface shadow-sm font-medium hover:bg-surface-container-low rounded-md px-3 py-1.5 text-sm flex items-center gap-2">
                    Save as
                </button>
            </div>
        </div>

        <div className="p-3 flex items-center gap-3 border-b border-outline-variant/30 bg-surface-container-lowest">
            <button type="button" className="bg-surface-container-lowest border border-outline-variant/40 text-on-surface shadow-sm font-medium hover:bg-surface-container-low rounded-md px-3 py-1.5 text-sm flex items-center gap-2 transition-colors">
                Category <ChevronDown className="w-4 h-4"/>
            </button>
            <button type="button" className="bg-surface-container-lowest border border-outline-variant/40 text-on-surface shadow-sm font-medium hover:bg-surface-container-low rounded-md px-3 py-1.5 text-sm flex items-center gap-2 transition-colors">
                Status <ChevronDown className="w-4 h-4"/>
            </button>
            <button type="button" className="bg-surface-container-lowest border border-outline-variant/40 border-dashed text-on-surface shadow-sm font-medium hover:bg-surface-container-low rounded-md px-3 py-1.5 text-sm flex items-center gap-2 transition-colors">
                <Plus className="w-4 h-4"/> Add filter
            </button>
        </div>
    </>
);

const ProductTable = ({ products, isLoading }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
                <thead className="bg-surface-container-low/50 border-b border-outline-variant/30 text-on-surface-variant font-semibold">
                    <tr>
                        <th className="w-10 py-3 px-4">
                            <input type="checkbox" className="rounded border-outline-variant/50 text-primary focus:ring-primary"/>
                        </th>
                        <th className="py-3 px-4">Product</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Inventory</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Price</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                    {isLoading ? (
                        Array.from({ length: 5 }).map((_, idx) => (
                            <tr key={idx} className="hover:bg-surface-container-low/50">
                                <td className="py-3 px-4"><div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div></td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-200 rounded-md animate-pulse shrink-0"></div>
                                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                </td>
                                <td className="py-3 px-4"><div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse"></div></td>
                                <td className="py-3 px-4"><div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div></td>
                                <td className="py-3 px-4"><div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div></td>
                                <td className="py-3 px-4"><div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div></td>
                            </tr>
                        ))
                    ) : products.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="py-8 text-center text-on-surface-variant">No products found.</td>
                        </tr>
                    ) : (
                        products.map((product) => (
                            <tr key={product.id} className="hover:bg-surface-container-low/50 cursor-pointer transition-colors">
                                <td className="py-3 px-4">
                                    <input type="checkbox" className="rounded border-outline-variant/50 text-primary focus:ring-primary"/>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 border border-outline-variant/30 rounded-md bg-surface-container-low flex items-center justify-center shrink-0 overflow-hidden">
                                            {product.image ? (
                                                <img src={product.image} alt={product.title} className="w-full h-full object-cover"/>
                                            ) : (
                                                <ImageIcon className="w-5 h-5 text-on-surface-variant"/>
                                            )}
                                        </div>
                                        <span className="font-medium text-on-surface">{product.title}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                                        {product.status}
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    <span className={`${product.inventory === 0 ? 'text-error' : 'text-on-surface'} font-medium`}>
                                        {product.inventory} in stock
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-on-surface-variant">{product.category}</td>
                                <td className="py-3 px-4 text-on-surface-variant">{formatCurrency(product.price)}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

const Pagination = ({ productsCount }) => (
    <div className="px-4 py-3 flex items-center justify-between border-t border-outline-variant/30 bg-surface-container-lowest">
        <div className="flex items-center gap-2">
            <span className="text-on-surface-variant text-xs">Rows per page:</span>
            <div className="relative">
                <select className="appearance-none bg-surface-container-lowest border border-outline-variant/40 rounded px-2 pr-6 py-1 text-xs font-medium focus:ring-1 focus:ring-primary outline-none">
                    <option>20</option>
                    <option>50</option>
                    <option>100</option>
                </select>
                <ChevronDown className="w-3 h-3 absolute right-1.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"/>
            </div>
        </div>
        <div className="flex items-center gap-6">
            <span className="text-xs text-on-surface-variant font-medium">1-20 of {productsCount} products</span>
            <div className="flex items-center gap-1">
                <button type="button" disabled className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container-low disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-sm">
                    <ChevronLeft className="w-4 h-4"/>
                </button>
                <button type="button" className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant/40 text-on-surface hover:bg-surface-container-low transition-colors text-sm">
                    <ChevronRight className="w-4 h-4"/>
                </button>
            </div>
        </div>
    </div>
);

// --- Main Page Component ---

export default function Products() {
    const { state } = useProducts();
    const { products, isLoading, error } = state;
    
    return (
        <div className="p-8 max-w-[1400px] mx-auto pb-16">
            <PageHeader />

            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col">
                <FilterBar />
                <ProductTable products={products} isLoading={isLoading} />
                <Pagination productsCount={products.length} />
            </div>
        </div>
    );
}
