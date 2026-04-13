import React, { useState } from 'react';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { saveCategory } from '../../shared/api/mockApi';
export default function CreateCategory() {
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);
    const handleSave = async () => {
        try {
            setIsSaving(true);
            // Simulate gathering form data
            const mockData = { title: 'New Category' };
            await saveCategory(mockData);
            navigate('/products');
        }
        catch (error) {
            console.error('Failed to save category', error);
        }
        finally {
            setIsSaving(false);
        }
    };
    return (<div className="p-8 max-w-5xl mx-auto pb-16">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link to="/products" className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container-low transition-colors">
            <ArrowLeft className="w-5 h-5 text-on-surface-variant"/>
          </Link>
          <h1 className="text-xl font-semibold tracking-tight text-on-surface">Create category</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/products" className="px-4 py-1.5 text-on-surface font-medium bg-surface-container-lowest border border-outline-variant/40 rounded-lg hover:bg-surface-container-low transition-colors shadow-sm text-sm">
            Discard
          </Link>
          <button onClick={handleSave} disabled={isSaving} className="px-4 py-1.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-fixed transition-colors shadow-md text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            {isSaving ? (<>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                Saving...
              </>) : ('Save')}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Details Card */}
          <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
            <div className="p-6">
              <h3 className="text-base font-semibold text-on-surface mb-6">Basic Details</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Title</label>
                  <input type="text" placeholder="e.g., Summer Collection" className="w-full px-4 py-2.5 bg-surface-container-low border-transparent focus:border-primary focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest rounded-lg transition-all duration-200 text-sm"/>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Description</label>
                  <textarea rows={6} className="w-full px-4 py-2.5 bg-surface-container-low border-transparent focus:border-primary focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest rounded-lg transition-all duration-200 text-sm resize-none"></textarea>
                </div>
              </div>
            </div>
          </section>

          {/* Collection Type Card */}
          <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
            <div className="p-6">
              <h3 className="text-base font-semibold text-on-surface mb-6">Collection type</h3>
              <div className="space-y-4">
                {/* Manual Option (Selected) */}
                <label className="flex gap-4 p-4 rounded-xl border border-primary/20 bg-primary/5 cursor-pointer hover:bg-primary/10 transition-all">
                  <div className="mt-1">
                    <input type="radio" name="collection_type" defaultChecked className="w-5 h-5 text-primary border-outline-variant focus:ring-offset-0 focus:ring-primary"/>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-on-surface">Manual</p>
                    <p className="text-on-surface-variant text-sm mt-0.5">Add products to this category one by one</p>
                  </div>
                </label>

                {/* Automated Option (Disabled) */}
                <div className="flex gap-4 p-4 rounded-xl border border-outline-variant/30 opacity-50 cursor-not-allowed">
                  <div className="mt-1">
                    <input type="radio" name="collection_type" disabled className="w-5 h-5 text-outline-variant border-outline-variant focus:ring-offset-0"/>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-on-surface-variant">Automated</p>
                      <span className="text-[10px] px-1.5 py-0.5 bg-surface-container-high text-on-surface-variant rounded font-bold uppercase tracking-wider">Soon</span>
                    </div>
                    <p className="text-on-surface-variant text-sm mt-0.5">Existing and future products that match your conditions will be added automatically.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column (1/3) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Category Image Card */}
          <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden sticky top-[80px]">
            <div className="p-6">
              <h3 className="text-base font-semibold text-on-surface mb-6">Category image</h3>
              <div className="relative group">
                <div className="w-full aspect-square border-2 border-dashed border-outline-variant/40 group-hover:border-primary/30 rounded-xl flex flex-col items-center justify-center gap-3 bg-surface-container-low transition-all cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-surface-container-lowest flex items-center justify-center shadow-sm">
                    <ImageIcon className="w-6 h-6 text-on-surface-variant group-hover:text-primary transition-colors"/>
                  </div>
                  <span className="text-sm font-medium text-on-surface-variant group-hover:text-primary transition-colors">Add image</span>
                </div>
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" aria-label="Upload category image"/>
              </div>
              <p className="mt-4 text-xs text-on-surface-variant leading-relaxed text-center">
                Upload a high-quality image that represents this collection. Recommended size 1200x1200px.
              </p>
            </div>
          </section>

          {/* SEO Summary Card */}
          <section className="bg-surface-container-low/50 rounded-xl border border-transparent p-6">
            <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Search Engine Listing</h4>
            <div className="space-y-2">
              <div className="h-4 w-3/4 bg-surface-container-high rounded animate-pulse"></div>
              <div className="h-3 w-1/2 bg-surface-container rounded animate-pulse"></div>
              <div className="pt-2">
                <p className="text-xs text-on-surface-variant italic">Preview will generate once title and description are provided.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>);
}
