import React from 'react';
import { X, AlertCircle } from 'lucide-react';

export default function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Xác nhận xóa', 
  message = 'Bạn có chắc chắn muốn thực hiện hành động này?',
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  type = 'danger' // 'danger' or 'info'
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200" 
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative w-full max-w-[400px] bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={onClose} 
            className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-8 text-center">
          <div className={`w-14 h-14 ${type === 'danger' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'} rounded-full flex items-center justify-center mx-auto mb-6`}>
            <AlertCircle className="w-7 h-7" />
          </div>
          
          <h2 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">
            {title}
          </h2>
          
          <p className="text-slate-500 mb-8 text-sm leading-relaxed px-2">
            {message}
          </p>
          
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 flex items-center justify-center bg-white border border-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
            >
              {cancelText}
            </button>
            <button 
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 flex items-center justify-center ${type === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold py-3 px-4 rounded-xl transition-all shadow-sm`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
