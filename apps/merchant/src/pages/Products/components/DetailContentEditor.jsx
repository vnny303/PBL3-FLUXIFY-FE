import { Plus, X } from 'lucide-react';

// ─── helpers ─────────────────────────────────────────────────────────────────

/**
 * Normalise a raw detailSections array from the backend (supports PascalCase + camelCase).
 * @param {any} raw
 * @returns {{ title: string, content: string }[]}
 */
export function normalizeDetailSections(raw) {
    if (!Array.isArray(raw)) return [];
    return raw.map(item => ({
        title:   String(item?.title   ?? item?.Title   ?? ''),
        content: String(item?.content ?? item?.Content ?? ''),
    }));
}

/**
 * Normalise a raw specifications array from the backend (supports PascalCase + camelCase).
 * @param {any} raw
 * @returns {{ name: string, value: string }[]}
 */
export function normalizeSpecifications(raw) {
    if (!Array.isArray(raw)) return [];
    return raw.map(item => ({
        name:  String(item?.name  ?? item?.Name  ?? ''),
        value: String(item?.value ?? item?.Value ?? ''),
    }));
}

/**
 * Remove rows where every meaningful field is empty.
 */
export function cleanDetailSections(rows) {
    return rows.filter(r => r.title.trim() || r.content.trim());
}

export function cleanSpecifications(rows) {
    return rows.filter(r => r.name.trim() || r.value.trim());
}

// ─── default placeholder rows ─────────────────────────────────────────────────

export const DEFAULT_DETAIL_SECTIONS = [
    { title: 'Product Details',    content: '' },
    { title: 'Material & Comfort', content: '' },
    { title: 'Size & Fit Guide',   content: '' },
];

export const DEFAULT_SPECIFICATIONS = [
    { name: 'Brand',    value: '' },
    { name: 'Material', value: '' },
    { name: 'Fit',      value: '' },
    { name: 'Origin',   value: '' },
];

// ─── shared input style ───────────────────────────────────────────────────────

const inp = 'w-full px-3 py-2 rounded-lg border border-[#e3e3e3] focus:border-black text-sm outline-none transition-colors';
const ta  = `${inp} resize-none`;

// ─── DetailContentEditor ──────────────────────────────────────────────────────

/**
 * Props:
 *   detailSections : { title, content }[]
 *   setDetailSections
 *   specifications : { name, value }[]
 *   setSpecifications
 */
export function DetailContentEditor({ detailSections, setDetailSections, specifications, setSpecifications }) {

    // ── detailSections helpers ──
    const addSection = () => setDetailSections(prev => [...prev, { title: '', content: '' }]);
    const removeSection = (i) => setDetailSections(prev => prev.filter((_, idx) => idx !== i));
    const updateSection = (i, field, val) => setDetailSections(prev =>
        prev.map((row, idx) => idx === i ? { ...row, [field]: val } : row)
    );

    // ── specifications helpers ──
    const addSpec = () => setSpecifications(prev => [...prev, { name: '', value: '' }]);
    const removeSpec = (i) => setSpecifications(prev => prev.filter((_, idx) => idx !== i));
    const updateSpec = (i, field, val) => setSpecifications(prev =>
        prev.map((row, idx) => idx === i ? { ...row, [field]: val } : row)
    );

    return (
        <div className="space-y-6">
            {/* ── Detail Sections ── */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <p className="text-sm font-medium text-slate-700">Detail Sections</p>
                        <p className="text-xs text-slate-400 mt-0.5">Accordion items shown in the "More Information" tab on the storefront.</p>
                    </div>
                    <button
                        type="button"
                        onClick={addSection}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 transition-colors"
                    >
                        <Plus className="w-3.5 h-3.5" /> Add Section
                    </button>
                </div>

                {detailSections.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No sections yet. Click "Add Section" to add one.</p>
                ) : (
                    <div className="space-y-3">
                        {detailSections.map((row, i) => (
                            <div key={i} className="bg-slate-50 border border-[#e3e3e3] rounded-xl p-3 space-y-2">
                                <div className="flex items-center gap-2">
                                    <input
                                        value={row.title}
                                        onChange={e => updateSection(i, 'title', e.target.value)}
                                        placeholder="Section title (e.g. Material & Comfort)"
                                        className={inp}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeSection(i)}
                                        className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                <textarea
                                    value={row.content}
                                    onChange={e => updateSection(i, 'content', e.target.value)}
                                    placeholder="Section content..."
                                    rows={3}
                                    className={ta}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Specifications ── */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <p className="text-sm font-medium text-slate-700">Specifications</p>
                        <p className="text-xs text-slate-400 mt-0.5">Key–value pairs shown in the "Specifications" table on the storefront.</p>
                    </div>
                    <button
                        type="button"
                        onClick={addSpec}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 transition-colors"
                    >
                        <Plus className="w-3.5 h-3.5" /> Add Row
                    </button>
                </div>

                {specifications.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No specifications yet. Click "Add Row" to add one.</p>
                ) : (
                    <div className="border border-[#e3e3e3] rounded-xl overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-[#f8f8f8] border-b border-[#e3e3e3]">
                                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-600 w-2/5">Name</th>
                                    <th className="text-left px-3 py-2.5 text-xs font-semibold text-slate-600">Value</th>
                                    <th className="w-10" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e3e3e3]">
                                {specifications.map((row, i) => (
                                    <tr key={i} className="hover:bg-[#fafafa]">
                                        <td className="px-3 py-2">
                                            <input
                                                value={row.name}
                                                onChange={e => updateSpec(i, 'name', e.target.value)}
                                                placeholder="e.g. Material"
                                                className={inp}
                                            />
                                        </td>
                                        <td className="px-3 py-2">
                                            <input
                                                value={row.value}
                                                onChange={e => updateSpec(i, 'value', e.target.value)}
                                                placeholder="e.g. 100% Cotton"
                                                className={inp}
                                            />
                                        </td>
                                        <td className="px-2 py-2 text-center">
                                            <button
                                                type="button"
                                                onClick={() => removeSpec(i)}
                                                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
