import { Link } from 'react-router-dom';
import { useMerchantLogin } from '../../../../../features/auth/model/useMerchantLogin';
import Input from '../../../../../shared/ui/Input';
import PasswordInput from '../../../../../shared/ui/PasswordInput';
import Checkbox from '../../../../../shared/ui/Checkbox';
import Button from '../../../../../shared/ui/Button';

export default function MerchantLogin() {
  const { formData, isLoading, error, isSuccess, handleChange, handleSubmit } = useMerchantLogin();

  return (
    <div className="flex h-screen w-full font-display bg-[#f6f6f8] text-slate-900 antialiased overflow-hidden">
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80')",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        <div className="absolute bottom-16 left-16 right-16 z-10">
          <h1 className="text-white text-5xl font-bold leading-tight tracking-tight max-w-md">
            Manage your store with confidence.
          </h1>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 sm:px-16 lg:px-24 bg-white">
        <div className="w-full max-w-md space-y-8">
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
              <span className="text-2xl font-bold tracking-tight text-slate-900">Fluxify Merchant</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Merchant sign in</h2>
              <p className="mt-2 text-slate-500">Access your store management portal.</p>
            </div>
          </div>

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

          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input
              label="Merchant Email"
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="merchant@store.com"
            />

            <PasswordInput
              label="Password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
            />

            <div className="flex items-center justify-between py-1">
              <Checkbox
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                label="Remember me"
              />

              <div className="text-sm">
                <a className="font-medium text-[#1754cf] hover:underline" href="#">
                  Forgot password?
                </a>
              </div>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              loadingText="Logging in..."
              className="py-3.5"
            >
              Merchant Log In
            </Button>
          </form>

          <p className="text-center text-sm text-slate-600">
            Looking for customer login?
            <Link className="font-bold text-[#1754cf] hover:underline ml-1" to="/login">
              Go to customer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
