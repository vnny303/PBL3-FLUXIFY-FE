import { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
    AlertCircle,
    BadgeCheck,
    Building2,
    CheckCircle2,
    CreditCard,
    Globe2,
    Loader2,
    Mail,
    Save,
    Store,
} from 'lucide-react';
import { useAuth } from '../../entities/auth/AuthContext';
import { getTenantById, updateTenant } from '../../share/api/tenantApi';
import { queryKeys } from '../../share/api/queryKeys';

const Input = (props) => (
    <input
        {...props}
        className={`w-full px-3 py-2 rounded-lg border border-[#e3e3e3] bg-white text-sm outline-none focus:border-black transition-colors ${props.className || ''}`}
    />
);

const Field = ({ label, hint, children }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        {children}
        {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
);

function Section({ icon: Icon, title, description, children }) {
    return (
        <section className="bg-white rounded-xl border border-[#e3e3e3] overflow-hidden">
            <div className="flex items-start gap-3 px-5 py-4 border-b border-[#f0f0f0]">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
                    {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
                </div>
            </div>
            <div className="p-5">{children}</div>
        </section>
    );
}

function Toggle({ checked, onChange, label, description }) {
    return (
        <button type="button" onClick={() => onChange(!checked)} className="w-full flex items-center justify-between gap-4 text-left py-3">
            <div>
                <p className="text-sm font-medium text-slate-900">{label}</p>
                {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
            </div>
            <span className={`relative w-10 h-6 rounded-full transition-colors shrink-0 ${checked ? 'bg-black' : 'bg-slate-200'}`}>
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-1'}`} />
            </span>
        </button>
    );
}

function SummaryItem({ icon: Icon, label, value, tone = 'slate' }) {
    const toneMap = {
        slate: 'bg-slate-50 text-slate-600',
        green: 'bg-green-50 text-green-700',
        blue: 'bg-blue-50 text-blue-700',
    };

    return (
        <div className="flex items-center gap-3 p-3 rounded-lg border border-[#e3e3e3]">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${toneMap[tone]}`}>
                <Icon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
                <p className="text-xs text-slate-500">{label}</p>
                <p className="text-sm font-semibold text-slate-900 truncate">{value}</p>
            </div>
        </div>
    );
}

export default function Settings() {
    const { currentTenant, user, switchTenant } = useAuth();
    const queryClient = useQueryClient();
    const tenantId = currentTenant?.tenantId || currentTenant?.id;

    const tenantQuery = useQuery({
        queryKey: queryKeys.tenants.detail(tenantId),
        queryFn: () => getTenantById(tenantId),
        enabled: !!tenantId,
    });

    const tenant = tenantQuery.data || currentTenant || {};

    const [tenantForm, setTenantForm] = useState({ storeName: '', subdomain: '', isActive: true });
    const [isSavingTenant, setIsSavingTenant] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        setTenantForm({
            storeName: tenant.storeName || tenant.storename || '',
            subdomain: tenant.subdomain || '',
            isActive: tenant.isActive !== false,
        });
    }, [tenant.storeName, tenant.storename, tenant.subdomain, tenant.isActive]);

    const storefrontUrl = useMemo(() => {
        const subdomain = tenantForm.subdomain || tenant.subdomain || 'store';
        return `${subdomain}.fluxify.local`;
    }, [tenantForm.subdomain, tenant.subdomain]);

    const handleTenantChange = (event) => {
        const { name, value } = event.target;
        setTenantForm((prev) => ({ ...prev, [name]: value }));
        setMessage('');
        setError('');
    };

    const handleSaveTenant = async (event) => {
        event.preventDefault();
        if (!tenantId) return;

        try {
            setIsSavingTenant(true);
            setError('');
            const updated = await updateTenant(tenantId, {
                storeName: tenantForm.storeName.trim(),
                subdomain: tenantForm.subdomain.trim(),
                isActive: tenantForm.isActive,
            });
            queryClient.invalidateQueries({ queryKey: queryKeys.tenants.detail(tenantId) });
            if (updated?.tenantId && switchTenant) switchTenant(updated.tenantId);
            setMessage('Store details saved.');
        } catch (err) {
            const msg = err?.response?.data?.message || err?.response?.data || 'Failed to save store details.';
            setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
        } finally {
            setIsSavingTenant(false);
        }
    };

    if (!tenantId) {
        return (
            <div className="p-8 flex items-center gap-3 text-slate-500">
                <AlertCircle className="w-5 h-5" />
                <span>Please select a store to view settings.</span>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-xl font-bold text-slate-900">Settings</h1>
                <p className="text-sm text-slate-500 mt-0.5">Manage settings currently supported by Fluxify.</p>
            </div>

            {message && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-green-200 bg-green-50 text-green-700 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    {message}
                </div>
            )}
            {error && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm font-medium">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}

            {tenantQuery.isLoading ? (
                <div className="flex items-center justify-center py-32">
                    <Loader2 className="w-7 h-7 animate-spin text-slate-400" />
                    <span className="ml-3 text-sm text-slate-500">Loading settings...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-[1.45fr_0.8fr] gap-4">
                    <form onSubmit={handleSaveTenant}>
                        <Section icon={Building2} title="Store details" description="Maps to Tenant: StoreName, Subdomain, and IsActive.">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field label="Store name">
                                    <Input name="storeName" value={tenantForm.storeName} onChange={handleTenantChange} />
                                </Field>
                                <Field label="Subdomain" hint="3-50 lowercase letters, numbers, and hyphens.">
                                    <Input name="subdomain" value={tenantForm.subdomain} onChange={handleTenantChange} />
                                </Field>
                                <div className="md:col-span-2 border-t border-[#f0f0f0] pt-1">
                                    <Toggle
                                        checked={tenantForm.isActive}
                                        onChange={(value) => setTenantForm((prev) => ({ ...prev, isActive: value }))}
                                        label="Active store"
                                        description="Controls whether the tenant is available."
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end mt-5">
                                <button type="submit" disabled={isSavingTenant} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-slate-800 disabled:opacity-60">
                                    {isSavingTenant ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Save store details
                                </button>
                            </div>
                        </Section>
                    </form>

                    <div className="space-y-4">
                        <Section icon={Store} title="Current store" description="Read-only summary from selected tenant.">
                            <div className="grid grid-cols-1 gap-3">
                                <SummaryItem icon={Store} label="Store" value={tenantForm.storeName || 'Untitled store'} />
                                <SummaryItem icon={Globe2} label="Storefront subdomain" value={storefrontUrl} tone="blue" />
                                <SummaryItem icon={BadgeCheck} label="Tenant status" value={tenantForm.isActive ? 'Active' : 'Inactive'} tone={tenantForm.isActive ? 'green' : 'slate'} />
                                <SummaryItem icon={CreditCard} label="Payment method" value="COD only" tone="green" />
                            </div>
                        </Section>

                        <Section icon={BadgeCheck} title="Account" description="Displayed from merchant auth session.">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 rounded-lg border border-[#e3e3e3]">
                                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-semibold">
                                        {(user?.email || 'M').charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-slate-900 truncate">{user?.email || 'merchant@fluxify.test'}</p>
                                        <p className="text-xs text-slate-500 capitalize">{user?.role || 'merchant'}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                    <SummaryItem icon={Mail} label="Login email" value={user?.email || 'merchant@fluxify.test'} />
                                </div>
                            </div>
                        </Section>

                        <div className="bg-slate-100 rounded-xl border border-slate-200 p-4">
                            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Scope note</p>
                            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                                Checkout currently supports COD only. Settings for other checkout, delivery, staff, or account flows need backend support before becoming editable.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
