import React, { useRef } from 'react';
import { Loader2 } from 'lucide-react';

export default function AvatarSection({ 
  photoUrl, 
  photoInitial, 
  isUploading, 
  onPhotoChange, 
  primaryColor, 
  borderRadius 
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onPhotoChange(file);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
      {photoUrl ? (
        <div 
          className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-800 bg-cover bg-center border-4 border-white dark:border-slate-800 shadow-lg" 
          style={{ backgroundImage: `url('${photoUrl}')` }}
        ></div>
      ) : (
        <div 
          className="w-24 h-24 rounded-full text-white border-4 border-white dark:border-slate-800 shadow-lg flex items-center justify-center text-2xl font-black"
          style={{ backgroundColor: primaryColor }}
        >
          {photoInitial}
        </div>
      )}
      <div className="flex flex-col items-center sm:items-start gap-2 text-center sm:text-left">
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange} 
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="px-5 py-2 text-sm font-semibold border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
        >
          {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isUploading ? 'Uploading...' : 'Change Photo'}
        </button>
        <p className="text-xs text-slate-500 dark:text-slate-400">JPG, PNG or GIF. Max 5MB.</p>
      </div>
    </div>
  );
}
