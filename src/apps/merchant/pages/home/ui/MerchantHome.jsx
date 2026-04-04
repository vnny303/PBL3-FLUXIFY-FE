import { LogOut, Store, Package, ShoppingBag, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAppContext } from '../../../../../app/providers/AppContext';
import { ROUTES } from '../../../../../shared/lib/constants';

const quickStats = [
  {
    title: 'Products',
    value: '--',
    icon: Package,
  },
  {
    title: 'Orders Today',
    value: '--',
    icon: ShoppingBag,
  },
  {
    title: 'Customers',
    value: '--',
    icon: Users,
  },
];

export default function MerchantHome() {
  const navigate = useNavigate();
  const { logout, session } = useAppContext();

  const handleLogout = () => {
    logout();
    toast.success('Đã đăng xuất merchant.');
    navigate(ROUTES.MERCHANT_LOGIN, { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300">
              <Store className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/80">Merchant Console</p>
              <h1 className="text-2xl font-bold">Welcome back, {session?.email || 'Merchant'}</h1>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {quickStats.map((item) => (
            <article key={item.title} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
              <div className="mb-4 inline-flex rounded-lg bg-slate-800 p-2 text-cyan-300">
                <item.icon className="h-5 w-5" />
              </div>
              <p className="text-sm text-slate-400">{item.title}</p>
              <p className="mt-1 text-2xl font-bold tracking-tight">{item.value}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
          <h2 className="text-lg font-semibold">Merchant view is active</h2>
          <p className="mt-2 text-sm text-slate-300">
            Đây là khu vực dành riêng cho merchant. Các màn hình quản trị sản phẩm, đơn hàng và khách hàng sẽ được mở
            rộng ở đây thay vì dùng customer shop view.
          </p>
        </section>
      </div>
    </div>
  );
}
