import { createPortal } from 'react-dom';

export default function InvoicePrint({ order }) {
  if (!order) return null;

  const getAddressLines = () => {
    if (!order.shippingAddress) return ['Address not provided'];
    if (typeof order.shippingAddress === 'string') {
      return order.shippingAddress.split(',').map(s => s.trim()).filter(Boolean);
    }
    const { name, street, city, state, zip, country } = order.shippingAddress;
    return [
      name,
      street,
      [city, state, zip].filter(Boolean).join(', '),
      country
    ].filter(Boolean);
  };

  const addressLines = getAddressLines();
  const billedName = addressLines[0] || 'Customer';
  const restAddress = addressLines.slice(1);

  const calculateSubtotal = () => {
    return order.items.reduce((sum, item) => {
      let price = 0;
      if (typeof item.price === 'string') {
        price = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
      } else if (typeof item.price === 'number') {
        price = item.price;
      }
      return sum + (price * (item.quantity || 1));
    }, 0);
  };

  const subtotal = calculateSubtotal();
  let totalNum = 0;
  if (typeof order.total === 'string') {
    totalNum = parseFloat(order.total.replace(/[^0-9.]/g, '')) || 0;
  } else if (typeof order.totalAmount === 'number') {
    totalNum = order.totalAmount;
  }
  
  const taxAndShipping = Math.max(0, totalNum - subtotal);

  return createPortal(
    <div id="printable-invoice" className="hidden print:block bg-white text-black p-10 w-full max-w-[210mm] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-slate-200 pb-8 mb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">LUMINA</h1>
          <p className="text-sm text-slate-500 mt-1">Premium Fashion & Accessories</p>
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
          <p className="font-bold text-slate-800">{billedName}</p>
          {restAddress.map((line, idx) => (
            <p key={idx} className="text-sm text-slate-600">{line}</p>
          ))}
          {order.customerEmail && <p className="text-sm text-slate-600">{order.customerEmail}</p>}
        </div>
        <div className="text-right">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Payment Method</h3>
          <p className="font-bold text-slate-800">{order.paymentMethod === 'BankTransfer' ? 'Bank Transfer' : (order.paymentMethod || 'N/A')}</p>
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
            const price = item.price || '$0.00';
            const priceNum = typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0 : (item.price || 0);
            const totalItemPrice = `$${(priceNum * (item.quantity || 1)).toFixed(2)}`;
            return (
              <tr key={idx}>
                <td className="py-4">
                  <p className="font-bold text-slate-800">{item.name || 'Product'}</p>
                  <p className="text-xs text-slate-500">{item.variant || 'Standard'}</p>
                </td>
                <td className="py-4 text-center text-slate-800">{item.quantity || 1}</td>
                <td className="py-4 text-right text-slate-800">{price}</td>
                <td className="py-4 text-right font-bold text-slate-800">{totalItemPrice}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-1/2 max-w-sm">
          <div className="flex justify-between py-2 text-sm text-slate-600">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 text-sm text-slate-600 border-b border-slate-200">
            <span>Shipping & Tax</span>
            <span>${taxAndShipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-4 text-lg font-bold text-slate-900">
            <span>Total</span>
            <span>{order.total}</span>
          </div>
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
