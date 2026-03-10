import { Link } from 'react-router-dom';
import { useSignUp } from '../../hooks/useSignUp';
import Input from '../../components/Input';
import PasswordInput from '../../components/PasswordInput';
import Checkbox from '../../components/Checkbox';
import Button from '../../components/Button';

export default function SignUp() {
  const { formData, isLoading, error, isSuccess, handleChange, handleSubmit } = useSignUp();

  return (
    <div className="flex h-screen w-full font-display bg-[#f6f6f8] text-slate-900 antialiased overflow-hidden">
      {/* Left Side: Lifestyle Image */}
      <div className="hidden lg:flex lg:w-1/2 h-full relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBwMj-5YVg2RCcGbnJ_eKItzuICLc9Grs69vNc5ZStqJ0TkwTb-0g5bniI7IyKIV0Jd_dhqsKZVbCD_WggFkLlJUixnkMwG2vuTIzzOxOqi1f4DguxtoDc4GwjFoR3dRwcsnye1fUp_rlw0e_NXc4C8DcUvDlhkisv-C8HAos73EMxzl8k8RPfuWzD94GekQ-8V38plorzZ8359YTWOoQ3WRoQWbTKQDYDNDN1Z3PFups_egYwicedS9KEiAMUiMfEEkbbKRX3_AB4')",
          }}
        ></div>
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"></div>
        <div className="relative z-10 flex flex-col justify-between p-12 h-full w-full">
          <div className="flex items-center gap-2 text-white">
            <div className="size-8">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
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
            </div>
            <span className="text-2xl font-bold tracking-tight">Fluxify</span>
          </div>
          <div className="max-w-md">
            <h1 className="text-white text-5xl font-bold leading-tight mb-4">
              Discover the extraordinary in the everyday.
            </h1>
            <div className="h-1.5 w-20 bg-[#1754cf] rounded-full"></div>
          </div>
          <div className="text-white/60 text-sm">
            © 2024 Fluxify Inc. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side: Sign Up Form */}
      <div className="w-full lg:w-1/2 h-full bg-white flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto">
        <div className="w-full max-w-[420px] flex flex-col gap-8">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-2 text-[#1754cf] mb-4">
            <div className="size-8">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
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
            </div>
            <span className="text-2xl font-bold tracking-tight">Fluxify</span>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Create an account
            </h2>
            <p className="text-slate-500">Join the Fluxify community today.</p>
          </div>

          {/* Hiển thị thông báo trạng thái */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
              {error}
            </div>
          )}
          {isSuccess && (
            <div className="p-3 rounded-xl bg-green-50 text-green-600 text-sm font-medium border border-green-100">
              Account created successfully! Redirecting...
            </div>
          )}

          <div className="flex flex-col gap-4">
            <button className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-3 px-4 text-slate-700 font-semibold hover:bg-slate-50 transition-colors duration-200">
              <svg height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"></path>
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                OR
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <Input
                label="Tenant ID (Workspace Name)"
                id="tenantId"
                name="tenantId"
                value={formData.tenantId}
                onChange={handleChange}
                placeholder="my-workspace"
              />

              <Input
                label="Email Address"
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
              />

              <PasswordInput
                label="Password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
              />

              <div className="mt-1">
                <Checkbox
                  id="terms"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={(e) => handleChange({ target: { name: 'acceptTerms', value: e.target.checked } })}
                >
                  <span className="text-sm text-slate-500 ml-2">
                    I agree to the{' '}
                    <a className="text-[#1754cf] font-medium hover:underline" href="#">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a className="text-[#1754cf] font-medium hover:underline" href="#">
                      Privacy Policy
                    </a>
                    .
                  </span>
                </Checkbox>
              </div>

              <Button
                type="submit"
                isLoading={isLoading}
                loadingText="Creating..."
                className="py-4"
              >
                Create Account
              </Button>
            </form>
          </div>

          <div className="text-center pt-2">
            <p className="text-slate-600">
              Already have an account?{' '}
              <Link className="text-[#1754cf] font-bold hover:underline ml-1" to="/login">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
