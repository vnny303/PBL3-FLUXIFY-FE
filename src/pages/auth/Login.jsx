import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useLogin } from '../../hooks/useLogin';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { formData, isLoading, error, isSuccess, handleChange, handleSubmit } = useLogin();

  return (
    <div className="flex h-screen w-full font-display bg-[#f6f6f8] text-slate-900 antialiased overflow-hidden">
      {/* Left Side: Image Section */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAIsBi3eMbj6PU2uDw-9sjMvrAzB7mQiPUCzAhrMuDroRp0Tsi2xJuF01_TBUNv6sS1uLJsh2TyzU00WTArMwyEGWFOpjYpaCu0ZQucziueKBk9BPdzQcavINA9Y12qU3nBQaDMyau3pe-bsI6hPl2G34DAoTFkI99Ftob4-p5d8fBKyCms4j-tGkyrL_qU7BydN2QEojQnrcWl4ALDFtK0ryCh_WPi9UiNiURyg7xkcgZ8l5rURtAKJ4JnHAVYEP6jJX1NZ0iLPNk')",
          }}
        ></div>
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute bottom-16 left-16 right-16 z-10">
          <h1 className="text-white text-5xl font-bold leading-tight tracking-tight max-w-md">
            Discover the extraordinary in the everyday.
          </h1>
        </div>
      </div>

      {/* Right Side: Login Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 sm:px-16 lg:px-24 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Logo & Header */}
          <div className="flex flex-col items-start gap-6">
            <div className="flex items-center gap-2 text-[#1754cf]">
              <svg className="size-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path
                  clipRule="evenodd"
                  d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z"
                  fill="currentColor"
                  fillRule="evenodd"
                ></path>
                <path
                  clipRule="evenodd"
                  d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z"
                  fill="currentColor"
                  fillRule="evenodd"
                ></path>
              </svg>
              <span className="text-2xl font-bold tracking-tight text-slate-900">
                Fluxify
              </span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>
              <p className="mt-2 text-slate-500">Please enter your details to sign in.</p>
            </div>
          </div>

          {/* Hiển thị thông báo trạng thái */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100">
              {error}
            </div>
          )}
          {isSuccess && (
            <div className="p-3 rounded-lg bg-green-50 text-green-600 text-sm font-medium border border-green-100">
              Login successful! Redirecting...
            </div>
          )}

          {/* OAuth Section */}
          <div className="mt-8">
            <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-700 font-semibold hover:bg-slate-50 transition-colors">
              <svg className="size-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              Continue with Google
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
              OR
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Form Section */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="email">
                Email
              </label>
              <input
                className="block w-full rounded-lg border-slate-200 bg-white text-slate-900 focus:border-[#1754cf] focus:ring-[#1754cf] text-sm p-3 border"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@company.com"
                type="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  className="block w-full rounded-lg border-slate-200 bg-white text-slate-900 focus:border-[#1754cf] focus:ring-[#1754cf] text-sm p-3 pr-10 border"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                />
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-1">
              <div className="flex items-center">
                <input
                  className="h-4 w-4 rounded border-slate-300 text-[#1754cf] focus:ring-[#1754cf] cursor-pointer"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  type="checkbox"
                />
                <label className="ml-2 block text-sm text-slate-700 cursor-pointer" htmlFor="rememberMe">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a className="font-medium text-[#1754cf] hover:underline" href="#">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              className={`w-full bg-[#1754cf] text-white font-bold py-3.5 rounded-lg transition-all duration-200 shadow-lg shadow-[#1754cf]/20 ${
                isLoading 
                  ? 'opacity-70 cursor-not-allowed' 
                  : 'hover:bg-[#1754cf]/90'
              }`}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                'Log In'
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-slate-600">
            Don't have an account?{' '}
            <Link className="font-bold text-[#1754cf] hover:underline ml-1" to="/">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
