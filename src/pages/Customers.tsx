import React, { useState, useEffect } from 'react';
import { api, useAuthStore } from '../lib/store';
import { Button, Input, Card } from '../components/ui';
import { Plus, Search, Edit, Trash, X } from 'lucide-react';
import { format } from 'date-fns';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
      customer_name: '',
      phone: '',
      email: '',
      address: '',
      notes: ''
  });

  const fetchData = async () => {
    const res = await api.get('/customers');
    setCustomers(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          if (editingId) {
              await api.put(`/customers/${editingId}`, form);
          } else {
              await api.post('/customers', form);
          }
          setIsModalOpen(false);
          fetchData();
          setForm({ customer_name: '', phone: '', email: '', address: '', notes: '' });
          setEditingId(null);
      } catch (error) {
          alert("Gagal menyimpan data pelanggan");
      }
  };

  const handleEdit = (customer: any) => {
      setForm({
          customer_name: customer.customer_name,
          phone: customer.phone || '',
          email: customer.email || '',
          address: customer.address || '',
          notes: customer.notes || ''
      });
      setEditingId(customer.id);
      setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
      if (confirm('Yakin ingin menghapus pelanggan ini?')) {
          try {
              await api.delete(`/customers/${id}`);
              fetchData();
          } catch (error) {
              alert('Gagal menghapus');
          }
      }
  };

  const filtered = customers.filter((c: any) => c.customer_name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-dark">Data Pelanggan</h1>
        <Button className="gap-2" onClick={() => {
            setForm({ customer_name: '', phone: '', email: '', address: '', notes: '' });
            setEditingId(null);
            setIsModalOpen(true);
        }}><Plus size={16}/> Pelanggan Baru</Button>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-2">
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <Input 
                   placeholder="Cari pelanggan..." 
                   value={search} 
                   onChange={e => setSearch(e.target.value)}
                   className="pl-9"
                />
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-3">Nama</th>
                <th className="px-6 py-3">Kontak</th>
                <th className="px-6 py-3">Tgl Daftar</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c: any) => (
                <tr key={c.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{c.customer_name}</td>
                  <td className="px-6 py-4">
                     <div>{c.phone}</div>
                     <div className="text-xs text-gray-400">{c.email}</div>
                  </td>
                  <td className="px-6 py-4">{c.first_purchase_date ? format(new Date(c.first_purchase_date), 'dd MMM yyyy') : '-'}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={c.customer_status} />
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                     <button className="text-accent hover:text-accent/80" onClick={() => handleEdit(c)}><Edit size={16}/></button>
                     <button className="text-danger hover:text-danger/80" onClick={() => handleDelete(c.id)}><Trash size={16}/></button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                   <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Data tidak ditemukan</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Card className="w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">{editingId ? 'Edit Pelanggan' : 'Tambah Pelanggan'}</h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-dark"><X size={20}/></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1">Nama Lengkap</label>
                        <Input required value={form.customer_name} onChange={e => setForm({...form, customer_name: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">No HP</label>
                        <Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Email</label>
                        <Input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Alamat</label>
                        <Input value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
                    </div>
                    <div className="pt-4 flex gap-2 justify-end">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button>
                        <Button type="submit">Simpan</Button>
                    </div>
                </form>
            </Card>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
    let color = 'bg-gray-100 text-gray-800';
    if (status === 'Baru') color = 'bg-blue-100 text-blue-800';
    if (status === 'Aktif') color = 'bg-success/10 text-success';
    if (status === 'Loyal') color = 'bg-accent/20 text-accent font-bold';
    if (status === 'Potensial Loyal') color = 'bg-warning/20 text-warning';
    
    return <span className={`px-2 py-1 rounded-full text-xs ${color}`}>{status}</span>;
}
