import React from 'react';
import { ArrowLeft, Bold, Italic, Link as LinkIcon, Code, UploadCloud, X, Plus, Search, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAddProduct } from './useAddProduct';

// --- Subcomponents ---

const PageHeader = ({ isSaving, onSave }) => (
  <header className="flex justify-between items-center mb-8">
    <div className="flex items-center gap-4">
      <Link to="/products" className="p-2 hover:bg-surface-container-low rounded-md transition-colors">
        <ArrowLeft className="w-5 h-5 text-on-surface-variant"/>
      </Link>
      <h1 className="font-semibold text-xl tracking-tight text-on-surface">Add Product</h1>
    </div>
    <div className="flex items-center gap-3">
      <Link to="/products" className="px-4 py-2 text-sm font-semibold text-on-surface hover:bg-surface-container-low rounded-lg transition-colors">
        Discard
      </Link>
      <button 
        type="button"
        onClick={onSave} 
        disabled={isSaving} 
        className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg shadow-sm hover:bg-primary-fixed transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isSaving ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
            Saving...
          </>
        ) : ('Save')}
      </button>
    </div>
  </header>
);

const BasicInfoSection = ({ name, description, onChange }) => (
  <section className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 shadow-sm">
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium tracking-wide text-on-surface-variant mb-1.5">Title</label>
        <input 
          name="name" 
          value={name || ''} 
          onChange={onChange} 
          type="text" 
          placeholder="Short sleeve t-shirt" 
          className="w-full bg-surface-container-lowest border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-sm p-3 transition-all placeholder:text-outline-variant"
        />
      </div>
      <div>
        <label className="block text-xs font-medium tracking-wide text-on-surface-variant mb-1.5">Description</label>
        <div className="border border-outline-variant/40 rounded-lg overflow-hidden">
          <div className="flex gap-2 p-2 border-b border-outline-variant/40 bg-surface-container-low/50">
            <button type="button" className="p-1 hover:bg-surface-container-lowest rounded text-on-surface-variant"><Bold className="w-4 h-4"/></button>
            <button type="button" className="p-1 hover:bg-surface-container-lowest rounded text-on-surface-variant"><Italic className="w-4 h-4"/></button>
            <button type="button" className="p-1 hover:bg-surface-container-lowest rounded text-on-surface-variant"><LinkIcon className="w-4 h-4"/></button>
            <button type="button" className="p-1 hover:bg-surface-container-lowest rounded text-on-surface-variant ml-auto"><Code className="w-4 h-4"/></button>
          </div>
          <textarea 
            name="description" 
            value={description || ''} 
            onChange={onChange} 
            placeholder="Enter product description..." 
            rows={6} 
            className="w-full bg-transparent border-none focus:ring-0 text-sm p-3 resize-none placeholder:text-outline-variant"
          />
        </div>
      </div>
    </div>
  </section>
);

const MediaSection = () => (
  <section className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 shadow-sm">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-sm font-semibold text-on-surface">Media</h3>
      <button type="button" className="text-xs text-primary font-medium hover:underline">Add from URL</button>
    </div>
    <div className="border-2 border-dashed border-outline-variant/40 rounded-lg p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-surface-container-low/50 transition-colors group">
      <div className="w-12 h-12 bg-surface-container-low border border-outline-variant/30 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <UploadCloud className="w-6 h-6 text-on-surface-variant"/>
      </div>
      <p className="text-sm font-medium text-on-surface">Add files</p>
      <p className="text-xs text-on-surface-variant mt-1">or drop files to upload</p>
    </div>
  </section>
);

const PricingSection = ({ price, onChange }) => (
  <section className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 shadow-sm">
    <h3 className="text-sm font-semibold mb-4 text-on-surface">Pricing</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-xs font-medium tracking-wide text-on-surface-variant mb-1.5">Price</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant">$</span>
          <input 
            name="price" 
            value={price || ''} 
            onChange={onChange} 
            type="number" 
            placeholder="0.00" 
            className="w-full bg-surface-container-lowest border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-sm p-3 pl-7 transition-all"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium tracking-wide text-on-surface-variant mb-1.5">Compare at price</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant">$</span>
          <input type="number" placeholder="0.00" className="w-full bg-surface-container-lowest border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-sm p-3 pl-7 transition-all"/>
        </div>
      </div>
    </div>
    <div className="mt-4 pt-4 border-t border-outline-variant/30 flex items-center gap-3">
      <input type="checkbox" id="tax" className="w-4 h-4 rounded border-outline-variant/50 text-primary focus:ring-primary"/>
      <label htmlFor="tax" className="text-sm text-on-surface">Charge tax on this product</label>
    </div>
  </section>
);

const InventorySection = () => (
  <section className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 shadow-sm">
    <h3 className="text-sm font-semibold mb-4 text-on-surface">Inventory</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div>
        <label className="block text-xs font-medium tracking-wide text-on-surface-variant mb-1.5">SKU (Stock Keeping Unit)</label>
        <input type="text" className="w-full bg-surface-container-lowest border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-sm p-3 transition-all"/>
      </div>
      <div>
        <label className="block text-xs font-medium tracking-wide text-on-surface-variant mb-1.5">Barcode (ISBN, UPC, GTIN, etc.)</label>
        <input type="text" className="w-full bg-surface-container-lowest border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-sm p-3 transition-all"/>
      </div>
    </div>
    <div className="flex items-center justify-between py-3 border-t border-outline-variant/30">
      <div>
        <p className="text-sm font-medium text-on-surface">Track quantity</p>
        <p className="text-xs text-on-surface-variant">Shopify tracks this product's inventory</p>
      </div>
      <div className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" defaultChecked/>
        <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
      </div>
    </div>
  </section>
);

const VariantsSection = ({ 
  variantGroups, 
  onAddGroup, 
  onUpdateGroupName, 
  onRemoveGroup, 
  onRemoveValue, 
  onAddValue 
}) => {
  if (!variantGroups) return null;

  return (
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-6">
      <h3 className="text-sm font-semibold mb-4 text-on-surface">Variants</h3>
      <div className="space-y-4">
        {variantGroups.map((group) => (
          <div key={group.id} className="p-4 border border-outline-variant/40 rounded-lg bg-surface-container-highest/20 mb-4 relative">
            <button 
              type="button" 
              onClick={() => onRemoveGroup(group.id)} 
              className="absolute top-4 right-4 text-on-surface-variant hover:text-error transition-colors"
              title="Remove variant group"
            >
              <X className="w-4 h-4"/>
            </button>
            <label className="block text-sm font-medium text-on-surface mb-2">Option name</label>
            <input 
              type="text" 
              value={group.name || ''} 
              onChange={(e) => onUpdateGroupName(group.id, e.target.value)} 
              placeholder="e.g. Size, Color, Material" 
              className="w-full md:w-1/2 bg-surface-container-lowest border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-sm p-2 transition-all placeholder:text-outline-variant mb-4"
            />
            
            <label className="block text-sm font-medium text-on-surface mb-2">Option values</label>
            <div className="flex flex-wrap gap-2 items-center bg-surface-container-lowest border border-outline-variant/40 rounded-lg p-2 min-h-[42px]">
              {(group.values || []).map(val => (
                <span key={val} className="bg-surface-container-high text-on-surface px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  {val} 
                  <button 
                    type="button" 
                    onClick={() => onRemoveValue(group.id, val)} 
                    className="hover:text-error transition-colors"
                    title="Remove value"
                  >
                    <X className="w-3 h-3"/>
                  </button>
                </span>
              ))}
              <input 
                onKeyDown={(e) => onAddValue(e, group.id)} 
                type="text" 
                placeholder="Add value... (Press Enter)" 
                className="border-none bg-transparent outline-none text-sm placeholder:text-on-surface-variant flex-1 min-w-[150px] focus:ring-0 p-1"
              />
            </div>
          </div>
        ))}
        
        <button 
          type="button" 
          onClick={onAddGroup} 
          className="text-sm font-medium text-primary hover:underline mt-2 flex items-center gap-1"
        >
          <Plus className="w-4 h-4"/> Add another option
        </button>
      </div>
    </section>
  );
};

const SkusPreviewSection = ({ generatedSkus, basePrice, onUpdateSku }) => {
  if (!generatedSkus || generatedSkus.length === 0) return null;

  return (
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-6">
      <h3 className="text-sm font-semibold mb-4 text-on-surface">Variant Preview (SKUs)</h3>
      <div className="overflow-x-auto border border-outline-variant/30 rounded-lg">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-surface-container-low/50">
            <tr>
              <th className="py-2 px-3 border-b border-outline-variant/30 font-medium text-on-surface-variant">Variant</th>
              <th className="py-2 px-3 border-b border-outline-variant/30 font-medium text-on-surface-variant">Price</th>
              <th className="py-2 px-3 border-b border-outline-variant/30 font-medium text-on-surface-variant">Stock</th>
            </tr>
          </thead>
          <tbody>
            {generatedSkus.map((sku) => (
              <tr key={sku.id} className="border-b border-outline-variant/20 last:border-0 hover:bg-surface-container-high/20 transition-colors">
                <td className="py-2 px-3 font-medium text-on-surface whitespace-nowrap">{sku.options}</td>
                <td className="py-2 px-3">
                  <input 
                    type="number" 
                    placeholder={basePrice || "0.00"}
                    value={sku.price || ''}
                    onChange={(e) => onUpdateSku(sku.id, 'price', e.target.value)}
                    className="w-full min-w-[90px] bg-transparent border border-outline-variant/40 rounded p-1.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </td>
                <td className="py-2 px-3">
                  <input 
                    type="number" 
                    placeholder="0"
                    value={sku.stock || ''}
                    onChange={(e) => onUpdateSku(sku.id, 'stock', e.target.value)}
                    className="w-full min-w-[70px] bg-transparent border border-outline-variant/40 rounded p-1.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const ProductSidebar = () => (
  <div className="space-y-6">
    <section className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 shadow-sm">
      <h3 className="text-sm font-semibold mb-4 text-on-surface">Status</h3>
      <select className="w-full bg-surface-container-lowest border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-sm p-3 transition-all">
        <option value="active">Active</option>
        <option value="draft">Draft</option>
      </select>
      <p className="text-xs text-on-surface-variant mt-3 leading-relaxed">
        This product will be available to all sales channels when set to active.
      </p>
    </section>

    <section className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 shadow-sm">
      <h3 className="text-sm font-semibold mb-4 text-on-surface">Product organization</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium tracking-wide text-on-surface-variant mb-1.5">Category</label>
          <input type="text" placeholder="e.g. Apparel > Tops" className="w-full bg-surface-container-lowest border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-sm p-3 transition-all"/>
        </div>
        <div>
          <label className="block text-xs font-medium tracking-wide text-on-surface-variant mb-1.5">Type</label>
          <input type="text" placeholder="T-shirt" className="w-full bg-surface-container-lowest border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-sm p-3 transition-all"/>
        </div>
        <div>
          <label className="block text-xs font-medium tracking-wide text-on-surface-variant mb-1.5">Vendor</label>
          <input type="text" placeholder="Atelier Studio" className="w-full bg-surface-container-lowest border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-sm p-3 transition-all"/>
        </div>
        <div>
          <label className="block text-xs font-medium tracking-wide text-on-surface-variant mb-1.5">Collections</label>
          <div className="relative">
            <input type="text" placeholder="Search for collections" className="w-full bg-surface-container-lowest border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-sm p-3 transition-all"/>
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant"/>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-high rounded-md text-xs font-medium">
              Summer 2024 <button type="button" className="hover:text-error transition-colors"><X className="w-3 h-3"/></button>
            </span>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium tracking-wide text-on-surface-variant mb-1.5">Tags</label>
          <input type="text" placeholder="Vintage, Cotton, Eco-friendly" className="w-full bg-surface-container-lowest border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-sm p-3 transition-all"/>
        </div>
      </div>
    </section>

    <section className="bg-primary p-6 rounded-xl text-white overflow-hidden relative group">
      <div className="relative z-10">
        <h3 className="text-sm font-bold mb-2 flex items-center gap-2">
          <Lightbulb className="w-4 h-4"/>
          Merchant Pro-tip
        </h3>
        <p className="text-xs leading-relaxed opacity-90">
          Products with high-quality descriptions and at least 3 media files convert 45% better. Use the new AI generator to polish your copy.
        </p>
      </div>
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
    </section>
  </div>
);

// --- Main Form Component ---

export default function AddProduct() {
  const { state, actions } = useAddProduct();
  const { formData, isSaving, variantGroups, generatedSkus } = state;
  const { 
    handleChange, 
    handleSave, 
    addVariantGroup, 
    updateVariantGroupName, 
    removeVariantGroup, 
    removeVariantValue, 
    handleAddVariantValue, 
    updateSkuField 
  } = actions;

  return (
    <div className="p-8 max-w-6xl mx-auto pb-16">
      <PageHeader isSaving={isSaving} onSave={handleSave} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <BasicInfoSection 
            name={formData.name} 
            description={formData.description} 
            onChange={handleChange} 
          />
          
          <MediaSection />
          
          <PricingSection 
            price={formData.price} 
            onChange={handleChange} 
          />
          
          <InventorySection />
          
          <VariantsSection 
            variantGroups={variantGroups}
            onAddGroup={addVariantGroup}
            onUpdateGroupName={updateVariantGroupName}
            onRemoveGroup={removeVariantGroup}
            onRemoveValue={removeVariantValue}
            onAddValue={handleAddVariantValue}
          />
          
          <SkusPreviewSection 
            generatedSkus={generatedSkus}
            basePrice={formData.price}
            onUpdateSku={updateSkuField}
          />
        </div>

        {/* Right Column */}
        <ProductSidebar />
      </div>
    </div>
  );
}
