import { createPortal } from 'react-dom';

export default function InvoicePrint({ order }) {
  if (!order) return null;

  return createPortal(
    <div id="printable-invoice" className="hidden print:block bg-white text-black p-10 w-full max-w-[210mm] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-slate-200 pb-8 mb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">LUMINA</h1>
          <p className="text-sm text-slate-500 mt-1">Premium Fashion &amp; Accessories</p>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-bold text-slate-300 uppercase tracking-widest">Invoice</h2>
          <p className="text-sm font-semibold text-slate-800 mt-2">{order.id}</p>
          <p className="text-sm text-slate-500">Date: {order.date}</p>
        </div>
      </div>

      {/* Customer Info */}
      <div className="flex justify-between mb-12">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Billed To</h3>
          <p className="font-bold text-slate-800">John Doe</p>
          <p className="text-sm text-slate-600">123 Fashion Street, Suite 456</p>
          <p className="text-sm text-slate-600">New York, NY 10001</p>
          <p className="text-sm text-slate-600">john.doe@example.com</p>
        </div>
        <div className="text-right">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Payment Method</h3>
          <p className="font-bold text-slate-800">{order.paymentMethod}</p>
          <p className="text-sm text-slate-600">Status: {order.status}</p>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-12">
        <thead>
          <tr className="border-b-2 border-slate-800 text-left">
            <th className="py-3 text-sm font-bold text-slate-800 uppercase tracking-wider">Item Description</th>
            <th className="py-3 text-sm font-bold text-slate-800 uppercase tracking-wider text-center">Qty</th>
            <th className="py-3 text-sm font-bold text-slate-800 uppercase tracking-wider text-right">Price</th>
            <th className="py-3 text-sm font-bold text-slate-800 uppercase tracking-wider text-right">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {order.items.map((item, idx) => {
            const price = item.price || '$35.00';
            return (
              <tr key={idx}>
                <td className="py-4">
                  <p className="font-bold text-slate-800">{item.name || 'Product'}</p>
                  <p className="text-xs text-slate-500">{item.variant || 'Standard'}</p>
                </td>
                <td className="py-4 text-center text-slate-800">1</td>
                <td className="py-4 text-right text-slate-800">{price}</td>
                <td className="py-4 text-right font-bold text-slate-800">{price}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-1/2 max-w-sm">
          <div className="flex justify-between py-2 text-sm text-slate-600"><span>Subtotal</span><span>{order.total}</span></div>
          <div className="flex justify-between py-2 text-sm text-slate-600"><span>Shipping</span><span>$0.00</span></div>
          <div className="flex justify-between py-2 text-sm text-slate-600 border-b border-slate-200"><span>Tax (0%)</span><span>$0.00</span></div>
          <div className="flex justify-between py-4 text-lg font-bold text-slate-900"><span>Total</span><span>{order.total}</span></div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-24 pt-8 border-t border-slate-200 text-center">
        <p className="text-sm font-bold text-slate-800">Thank you for your business!</p>
        <p className="text-xs text-slate-500 mt-1">If you have any questions about this invoice, please contact support@lumina.com</p>
      </div>
    </div>,
    document.body
  );
}
