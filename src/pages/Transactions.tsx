import React from 'react';
import { useAppStore } from '../lib/store';
import { Card } from '../components/ui';
import { format } from 'date-fns';
import { Trash } from 'lucide-react';

export default function Transactions() {
  const transactions = useAppStore(state => state.transactions);
  const customers = useAppStore(state => state.customers);
  const deleteTransaction = useAppStore(state => state.deleteTransaction);
  const user = useAppStore(s => s.user);

  const getCustomerName = (id: string) => customers.find(c => c.id === id)?.customer_name || 'Unknown';

  const handleDelete = async (id: string) => {
      if (confirm('Yakin ingin menghapus transaksi ini?')) {
          try {
              deleteTransaction(id);
          } catch (error) {
              alert('Gagal menghapus');
          }
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-dark">Riwayat Transaksi</h1>
      </div>

      <Card className="overflow-x-auto">
         <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-3">ID Transaksi</th>
                <th className="px-6 py-3">Tanggal</th>
                <th className="px-6 py-3">Pelanggan</th>
                <th className="px-6 py-3">Metode</th>
                <th className="px-6 py-3">Total</th>
                {user?.role === 'admin' && <th className="px-6 py-3">Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {transactions.map((t: any) => (
                <tr key={t.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{t.id}</td>
                  <td className="px-6 py-4">{format(new Date(t.transaction_date), 'dd MMM yyyy HH:mm')}</td>
                  <td className="px-6 py-4">{getCustomerName(t.customer_id)}</td>
                  <td className="px-6 py-4">{t.payment_method}</td>
                  <td className="px-6 py-4 font-bold text-primary">Rp {t.total_amount.toLocaleString('id-ID')}</td>
                  {user?.role === 'admin' && (
                      <td className="px-6 py-4">
                          <button className="text-danger hover:text-danger/80" onClick={() => handleDelete(t.id)}><Trash size={16}/></button>
                      </td>
                  )}
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                   <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Belum ada transaksi</td>
                </tr>
              )}
            </tbody>
          </table>
      </Card>
    </div>
  )
}
