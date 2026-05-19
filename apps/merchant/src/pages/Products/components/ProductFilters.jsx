import { Search } from 'lucide-react';
import { Select } from '../../../share/ui/Select';

export function ProductFilters({
    searchInput, setSearchInput, handleSearch,
    categoryId, setCategoryId,
    sortBy, sortDir, setSortBy, setSortDir, setPage,
    pageSize, handlePageSizeChange,
    categories,
}) {
    const sortOptions = [
        { value: 'id-asc', label: 'ID A–Z' },
        { value: 'id-desc', label: 'ID Z–A' },
        { value: 'categoryId-desc', label: 'Category A–Z' },
        { value: 'categoryId-asc', label: 'Category Z–A' },
        { value: 'name-asc', label: 'Name A–Z' },
        { value: 'name-desc', label: 'Name Z–A' },
    ];

    const pageSizeOptions = [
        { value: '5', label: '5 / page' },
        { value: '10', label: '10 / page' },
        { value: '20', label: '20 / page' },
        { value: '50', label: '50 / page' },
    ];

    return (
        <div className="bg-white rounded-xl border border-[#e3e3e3] p-4 flex flex-wrap gap-3 items-center">
            <form onSubmit={handleSearch}
                className="flex items-center gap-2 bg-[#f8f8f8] rounded-lg px-3 py-2 border border-transparent focus-within:border-[#e3e3e3] flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
            </form>

            <div className="w-48">
                <Select
                    value={categoryId}
                    onChange={e => { setCategoryId(e.target.value); setPage(1); }}
                    options={[{ value: '', label: 'All Categories' }, ...categories]}
                    placeholder="All Categories"
                />
            </div>

            <div className="w-44">
                <Select
                    value={`${sortBy}-${sortDir}`}
                    onChange={e => {
                        const [sb, sd] = e.target.value.split('-');
                        setSortBy(sb); setSortDir(sd); setPage(1);
                    }}
                    options={sortOptions}
                />
            </div>

            <div className="w-32">
                <Select
                    value={String(pageSize)}
                    onChange={e => handlePageSizeChange(e.target.value)}
                    options={pageSizeOptions}
                />
            </div>
        </div>
    );
}