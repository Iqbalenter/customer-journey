import React, { useState, useEffect } from 'react';
import { api, useAuthStore } from '../lib/store';
import { Button, Input, Card } from '../components/ui';
import { Plus, Search, Edit, Trash, X } from 'lucide-react';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const user = useAuthStore(s => s.user);

  const [form, setForm] = useState({
      product_name: '',
      category: 'Coffee',
      price: '',
      description: '',
      is_active: true
  });

  const fetchData = async () => {
    const res = await api.get('/products');
    setProducts(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          const payload = { ...form, price: Number(form.price) };
          if (editingId) {
              await api.put(`/products/${editingId}`, payload);
          } else {
              await api.post('/products', payload);
          }
          setIsModalOpen(false);
          fetchData();
          setForm({ product_name: '', category: 'Coffee', price: '', description: '', is_active: true });
          setEditingId(null);
      } catch (error) {
          alert("Gagal menyimpan data");
      }
  };

  const handleEdit = (product: any) => {
      setForm({
          product_name: product.product_name,
          category: product.category,
          price: product.price.toString(),
          description: product.description || '',
          is_active: product.is_active
      });
      setEditingId(product.id);
      setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
      if (confirm('Yakin ingin menghapus produk ini?')) {
          try {
              await api.delete(`/products/${id}`);
              fetchData();
          } catch (error) {
              alert('Gagal menghapus');
          }
      }
  };

  const filtered = products.filter((p: any) => p.product_name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-dark">Manajemen Produk</h1>
        {user?.role === 'admin' && (
           <Button className="gap-2" onClick={() => {
               setForm({ product_name: '', category: 'Coffee', price: '', description: '', is_active: true });
               setEditingId(null);
               setIsModalOpen(true);
           }}><Plus size={16}/> Tambah Produk</Button>
        )}
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-2">
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <Input 
                   placeholder="Cari produk..." 
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
                <th className="px-6 py-3">Nama Produk</th>
                <th className="px-6 py-3">Kategori</th>
                <th className="px-6 py-3">Harga</th>
                <th className="px-6 py-3">Status</th>
                {user?.role === 'admin' && <th className="px-6 py-3">Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((product: any) => (
                <tr key={product.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{product.product_name}</td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">Rp {product.price.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${product.is_active ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-500'}`}>
                        {product.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  {user?.role === 'admin' && (
                    <td className="px-6 py-4 flex gap-2">
                        <button className="text-accent hover:text-accent/80" onClick={() => handleEdit(product)}><Edit size={16}/></button>
                        <button className="text-danger hover:text-danger/80" onClick={() => handleDelete(product.id)}><Trash size={16}/></button>
                    </td>
                  )}
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                   <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Produk tidak ditemukan</td>
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
                    <h2 className="text-lg font-bold">{editingId ? 'Edit Produk' : 'Tambah Produk'}</h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-dark"><X size={20}/></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1">Nama Produk</label>
                        <Input required value={form.product_name} onChange={e => setForm({...form, product_name: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Kategori</label>
                        <select className="w-full h-10 rounded-md border border-dark/20 px-3 text-sm focus:ring-2 focus:ring-primary outline-none" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                            <option value="Coffee">Coffee</option>
                            <option value="Non-Coffee">Non-Coffee</option>
                            <option value="Snack">Snack</option>
                            <option value="Pastry">Pastry</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Harga (Rp)</label>
                        <Input type="number" required value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-sm cursor-pointer mt-4">
                            <input type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} className="w-4 h-4 text-primary" />
                            <span>Produk Aktif (Tersedia)</span>
                        </label>
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
