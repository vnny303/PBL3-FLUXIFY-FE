import React from 'react';
import { X, UserPlus } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Modal() {
  const { setShowModal } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = () => {
    setShowModal(false);
    navigate('/login', { state: { from: location } });
  };

  const handleSignUp = () => {
    setShowModal(false);
    navigate('/signup');
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setShowModal(false)}></div>
      <div className="relative w-full max-w-[400px] bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100 opacity-100">
        <div className="absolute top-4 right-4 z-10">
          <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
            <X className=" text-sm" />
          </button>
        </div>
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
            <UserPlus className=" text-3xl" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">Join Fluxify Storefront</h2>
          <p className="text-slate-500 mb-8 text-sm leading-relaxed px-2">
            Create an account to save your wishlist, track orders, and get exclusive access to new drops.
          </p>
          <div className="space-y-3">
            <button onClick={handleLogin} className="w-full flex items-center justify-center bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 transition-all shadow-sm">
              Sign In
            </button>
            <button onClick={handleSignUp} className="w-full flex items-center justify-center bg-white border border-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
              Create Account
            </button>
          </div>
          <button onClick={() => setShowModal(false)} className="block w-full text-center text-slate-400 text-sm font-medium mt-6 hover:text-slate-600 transition-colors">
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}
