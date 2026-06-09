import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    AlertCircle,
    ArrowRight,
    CheckCircle2,
    Clock3,
    ExternalLink,
    Loader2,
    Package,
    Palette,
    Plus,
    Settings,
    ShoppingCart,
    Store,
    Users,
} from 'lucide-react';
import { useAuth } from '../../entities/auth/AuthContext';
import { getOrders } from '../../share/api/orderApi';
import { getProducts } from '../../share/api/productApi';
import { getCustomers } from '../../share/api/customerApi';
import { getCategories } from '../../share/api/categoryApi';
import { queryKeys } from '../../share/api/queryKeys';

const fmtDateTime = (value) =>
    value ? new Date(value).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—';

const getList = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.data)) return data.data;
    return [];
};

const getOrderId = (order) => order?.orderId || order?.id || 'order';

function Panel({ children, className = '' }) {
    return (
        <section className={`bg-white rounded-xl border border-[#e3e3e3] ${className}`}>
            {children}
        </section>
    );
}

function PanelHeader({ title, description, actionLabel, to }) {
    return (
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-[#f0f0f0]">
            <div>
                <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
                {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
            </div>
            {to && (
                <Link to={to} className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 shrink-0">
                    {actionLabel}
                    <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            )}
        </div>
    );
}

function SetupStep({ done, title, description, to }) {
    return (
        <Link to={to} className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#f8f8f8] transition-colors">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${done ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                {done ? <CheckCircle2 className="w-4 h-4" /> : <span className="w-2 h-2 rounded-full bg-current" />}
            </div>
            <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900">{title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{description}</p>
            </div>
        </Link>
    );
}

function ActionCard({ icon: Icon, title, description, to, label }) {
    return (
        <Link to={to} className="block p-4 rounded-xl border border-[#e3e3e3] hover:bg-[#f8f8f8] transition-colors">
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                    <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900">{title}</p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{description}</p>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-900 mt-3">
                        {label}
                        <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                </div>
            </div>
        </Link>
    );
}

function ActivityItem({ icon: Icon, title, description, time }) {
    return (
        <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                <Icon className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-900">{title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{description}</p>
            </div>
            <span className="text-xs text-slate-400 shrink-0">{time}</span>
        </div>
    );
}

export default function Home() {
    const { currentTenant } = useAuth();
    const tenantId = currentTenant?.tenantId;

    const productsQuery = useQuery({
        queryKey: queryKeys.products.list(tenantId, { page: 1, pageSize: 100, source: 'home' }),
        queryFn: () => getProducts(tenantId, { page: 1, pageSize: 100 }),
        enabled: !!tenantId,
    });

    const categoriesQuery = useQuery({
        queryKey: queryKeys.categories.list(tenantId),
        queryFn: () => getCategories(tenantId),
        enabled: !!tenantId,
    });

    const ordersQuery = useQuery({
        queryKey: queryKeys.orders.list(tenantId, { page: 1, pageSize: 8, source: 'home' }),
        queryFn: () => getOrders(tenantId, { page: 1, pageSize: 8, sortBy: 'createdAt', sortDir: 'desc' }),
        enabled: !!tenantId,
    });

    const customersQuery = useQuery({
        queryKey: queryKeys.customers.list(tenantId, { source: 'home' }),
        queryFn: () => getCustomers(tenantId, {}),
        enabled: !!tenantId,
        staleTime: 5 * 60 * 1000,
    });

    const products = useMemo(() => getList(productsQuery.data), [productsQuery.data]);
    const categories = useMemo(() => getList(categoriesQuery.data), [categoriesQuery.data]);
    const orders = useMemo(() => getList(ordersQuery.data), [ordersQuery.data]);
    const customers = useMemo(() => getList(customersQuery.data), [customersQuery.data]);

    const pendingOrders = orders.filter((order) => ['Pending', 'Confirmed', 'Processing'].includes(order.status));
    const lowStockCount = products.reduce((count, product) => {
        const skus = product.productSkus || product.skus || [];
        return count + skus.filter((sku) => Number(sku.stock ?? sku.stockQuantity ?? 0) <= 12).length;
    }, 0);

    const setupSteps = [
        {
            title: 'Add products',
            description: `${products.length} products are available in your catalog.`,
            done: products.length > 0,
            to: '/home/products',
        },
        {
            title: 'Organize categories',
            description: `${categories.length} categories help customers browse faster.`,
            done: categories.length > 0,
            to: '/home/products/categories',
        },
        {
            title: 'Customize storefront',
            description: 'Update theme, homepage content, colors, and preview your shop.',
            done: true,
            to: '/home/admin/themes',
        },
        {
            title: 'Review customer activity',
            description: `${customers.length} customer profiles are ready for follow-up.`,
            done: customers.length > 0,
            to: '/home/customers',
        },
    ];

    const completedSteps = setupSteps.filter((step) => step.done).length;
    const progress = Math.round((completedSteps / setupSteps.length) * 100);
    const isLoading = productsQuery.isLoading || categoriesQuery.isLoading || ordersQuery.isLoading || customersQuery.isLoading;
    const isError = productsQuery.isError || categoriesQuery.isError || ordersQuery.isError || customersQuery.isError;

    if (!tenantId) {
        return (
            <div className="p-8 flex items-center gap-3 text-slate-500">
                <AlertCircle className="w-5 h-5" />
                <span>Please select a store to view Home.</span>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Home</h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Tasks and next steps for {currentTenant?.storeName || currentTenant?.storename || currentTenant?.subdomain || 'your store'}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Link to="/home/admin/themes" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#e3e3e3] bg-white text-sm font-medium text-slate-700 hover:bg-[#f8f8f8]">
                        <ExternalLink className="w-4 h-4" />
                        Preview store
                    </Link>
                    <Link to="/home/products" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-slate-800">
                        <Plus className="w-4 h-4" />
                        Add product
                    </Link>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-32">
                    <Loader2 className="w-7 h-7 animate-spin text-slate-400" />
                    <span className="ml-3 text-sm text-slate-500">Loading home...</span>
                </div>
            ) : isError ? (
                <div className="flex items-center justify-center gap-2 py-24 text-red-500">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm">Failed to load Home.</span>
                </div>
            ) : (
                <>
                    <Panel className="overflow-hidden">
                        <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr]">
                            <div className="p-5 border-b xl:border-b-0 xl:border-r border-[#f0f0f0]">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Setup guide</p>
                                        <h2 className="text-lg font-bold text-slate-900 mt-1">Get your store ready to sell</h2>
                                        <p className="text-sm text-slate-500 mt-1">Complete the core tasks that make the storefront useful for customers.</p>
                                    </div>
                                    <span className="text-sm font-semibold text-slate-900 shrink-0">{completedSteps}/{setupSteps.length}</span>
                                </div>
                                <div className="mt-5">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-slate-500">Progress</span>
                                        <span className="text-xs font-semibold text-slate-900">{progress}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-slate-900 rounded-full" style={{ width: `${progress}%` }} />
                                    </div>
                                </div>
                                <div className="mt-4 space-y-1">
                                    {setupSteps.map((step) => (
                                        <SetupStep key={step.title} {...step} />
                                    ))}
                                </div>
                            </div>

                            <div className="p-5">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Needs attention</p>
                                <div className="mt-4 space-y-3">
                                    <Link to="/home/orders" className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100 hover:bg-blue-100/60 transition-colors">
                                        <ShoppingCart className="w-5 h-5 text-blue-700" />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold text-slate-900">{pendingOrders.length} orders to review</p>
                                            <p className="text-xs text-slate-500">Confirm, process, or ship customer orders.</p>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-blue-700" />
                                    </Link>
                                    <Link to="/home/products" className="flex items-center gap-3 p-3 rounded-lg bg-rose-50 border border-rose-100 hover:bg-rose-100/60 transition-colors">
                                        <Package className="w-5 h-5 text-rose-700" />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold text-slate-900">{lowStockCount} low-stock variants</p>
                                            <p className="text-xs text-slate-500">Update inventory before products sell out.</p>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-rose-700" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </Panel>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                        <Panel className="xl:col-span-2">
                            <PanelHeader title="Recommended next steps" description="Use these cards to move through the admin without duplicating Analytics." />
                            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                                <ActionCard icon={Package} title="Merchandise catalog" description="Review product names, images, variants, and stock so storefront screenshots look complete." to="/home/products" label="Open products" />
                                <ActionCard icon={Palette} title="Polish storefront theme" description="Tune hero content, colors, typography, and homepage sections in the theme editor." to="/home/admin/themes" label="Edit theme" />
                                <ActionCard icon={ShoppingCart} title="Prepare order workflow" description="Check order statuses and payment states so operation screens have realistic data." to="/home/orders" label="Review orders" />
                                <ActionCard icon={Users} title="Check customer records" description="Scan recent customer profiles and purchase history for customer management screenshots." to="/home/customers" label="View customers" />
                            </div>
                        </Panel>

                        <Panel>
                            <PanelHeader title="Order tasks" actionLabel="Open orders" to="/home/orders" />
                            <div className="p-5 space-y-3">
                                {pendingOrders.length > 0 ? (
                                    pendingOrders.slice(0, 5).map((order) => (
                                        <Link key={getOrderId(order)} to="/home/orders" className="flex items-center gap-3 p-3 rounded-lg border border-[#e3e3e3] hover:bg-[#f8f8f8] transition-colors">
                                            <Clock3 className="w-4 h-4 text-blue-600 shrink-0" />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-slate-900">#{String(getOrderId(order)).slice(-8).toUpperCase()}</p>
                                                <p className="text-xs text-slate-500">{order.status} · {fmtDateTime(order.createdAt)}</p>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-slate-400" />
                                        </Link>
                                    ))
                                ) : (
                                    <div className="py-8 text-center">
                                        <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                        <p className="text-sm text-slate-500">No order tasks right now.</p>
                                    </div>
                                )}
                            </div>
                        </Panel>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                        <Panel className="xl:col-span-2">
                            <PanelHeader title="Recent activity" description="A simple feed of store changes and customer activity." />
                            <div className="p-5 space-y-4">
                                {orders.slice(0, 3).map((order) => (
                                    <ActivityItem
                                        key={getOrderId(order)}
                                        icon={ShoppingCart}
                                        title={`Order #${String(getOrderId(order)).slice(-8).toUpperCase()} was ${String(order.status || 'updated').toLowerCase()}`}
                                        description={`${order.paymentMethod || 'Payment'} · ${order.paymentStatus || 'Unknown payment status'}`}
                                        time={fmtDateTime(order.createdAt)}
                                    />
                                ))}
                                {products.slice(0, 2).map((product) => (
                                    <ActivityItem
                                        key={product.id || product.productId}
                                        icon={Package}
                                        title={`${product.name} is available in the catalog`}
                                        description={`${(product.productSkus || product.skus || []).length} variants configured`}
                                        time="Catalog"
                                    />
                                ))}
                            </div>
                        </Panel>

                        <Panel>
                            <PanelHeader title="Discover more of Fluxify" />
                            <div className="p-5 space-y-3">
                                <ActionCard icon={Store} title="Storefront review" description="Open the visual editor and check the customer-facing pages before screenshots." to="/home/admin/themes" label="Review store" />
                                <ActionCard icon={Settings} title="Operational settings" description="Keep this area reserved for payments, shipping, and store metadata when those screens are added." to="/home/settings" label="Open settings" />
                            </div>
                        </Panel>
                    </div>
                </>
            )}
        </div>
    );
}
