import React, { useState } from 'react';
import { useAppStore } from '../lib/store';
import { Button, Input, Card } from '../components/ui';
import { useNavigate } from 'react-router-dom';

export default function TransactionForm() {
  const allCustomers = useAppStore(state => state.customers);
  const allProducts = useAppStore(state => state.products);
  const addTransaction = useAppStore(state => state.addTransaction);

  const customers = allCustomers;
  const products = allProducts.filter(p => p.is_active);

  const navigate = useNavigate();

  const [form, setForm] = useState({
      customer_id: '',
      payment_method: 'Cash',
      notes: ''
  });
  
  const [cart, setCart] = useState<{product_id: string, qty: number}[]>([]);

  const totalAmount = cart.reduce((sum, item) => {
      const p = products.find(p => p.id === item.product_id);
      return sum + (p ? p.price * item.qty : 0);
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!form.customer_id || cart.length === 0) return alert('Pilih pelanggan dan minimal 1 produk');

      try {
          const payload = {
              ...form,
              total_amount: totalAmount,
              transaction_date: new Date().toISOString()
          };
          const details = cart.map(c => {
               const p = products.find(p => p.id === c.product_id);
               return { product_id: c.product_id, quantity: c.qty, price: p?.price, subtotal: (p?.price || 0) * c.qty };
          });
          
          addTransaction(payload, details);
          alert('Transaksi berhasil disimpan!');
          navigate('/transactions');
      } catch (err) {
          alert('Gagal menyimpan transaksi');
      }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
       <h1 className="text-2xl font-bold text-dark">Input Transaksi Baru</h1>
       
       <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
             <h2 className="text-lg font-semibold">Data Pelanggan & Pembayaran</h2>
             <div>
                <label className="block text-sm mb-1">Pelanggan</label>
                <select 
                    className="w-full flex h-10 rounded-md border border-dark/20 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                    value={form.customer_id}
                    onChange={e => setForm({...form, customer_id: e.target.value})}
                    required
                >
                    <option value="">-- Pilih Pelanggan --</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.customer_name}</option>)}
                </select>
             </div>
             <div>
                <label className="block text-sm mb-1">Metode Bayar</label>
                <select 
                    className="w-full flex h-10 rounded-md border border-dark/20 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                    value={form.payment_method}
                    onChange={e => setForm({...form, payment_method: e.target.value})}
                >
                    <option value="Cash">Cash</option>
                    <option value="QRIS">QRIS</option>
                    <option value="Transfer">Transfer</option>
                </select>
             </div>
             <div>
                <label className="block text-sm mb-1">Catatan</label>
                <Input value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Opsional" />
             </div>
          </Card>

          <Card className="p-6 space-y-4">
             <h2 className="text-lg font-semibold">Pilih Produk</h2>
             <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                 {products.map(p => {
                     const inCart = cart.find(c => c.product_id === p.id);
                     const qty = inCart ? inCart.qty : 0;
                     return (
                         <div key={p.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-md">
                            <div>
                                <p className="font-medium text-sm">{p.product_name}</p>
                                <p className="text-xs text-gray-500">Rp {p.price.toLocaleString('id-ID')}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button type="button" className="w-6 h-6 rounded-full bg-gray-200" onClick={() => {
                                    if(qty > 1) {
                                        setCart(cart.map(c => c.product_id === p.id ? {...c, qty: c.qty-1} : c));
                                    } else {
                                        setCart(cart.filter(c => c.product_id !== p.id));
                                    }
                                }}>-</button>
                                <span className="w-4 text-center text-sm">{qty}</span>
                                <button type="button" className="w-6 h-6 rounded-full bg-primary text-white" onClick={() => {
                                    if(qty === 0) setCart([...cart, {product_id: p.id, qty: 1}]);
                                    else setCart(cart.map(c => c.product_id === p.id ? {...c, qty: c.qty+1} : c));
                                }}>+</button>
                            </div>
                         </div>
                     );
                 })}
             </div>
             <div className="pt-4 border-t border-gray-100 flex justify-between items-center font-bold">
                 <span>Total:</span>
                 <span className="text-xl text-primary">Rp {totalAmount.toLocaleString('id-ID')}</span>
             </div>
             <Button type="submit" className="w-full">Simpan Transaksi</Button>
          </Card>
       </form>
    </div>
  )
}
