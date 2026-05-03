import React, { useState, useEffect } from 'react';
import { api, useAuthStore } from '../lib/store';
import { Card, Button, Input } from '../components/ui';
import { Star, AlertTriangle, Trash, Edit, X } from 'lucide-react';
import { format } from 'date-fns';

export default function Feedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const user = useAuthStore(s => s.user);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
      category: '',
      journey_stage: '',
      rating: 5,
      comment: '',
      is_pain_point: false
  });

  const fetchData = () => {
    Promise.all([api.get('/feedbacks'), api.get('/customers')])
      .then(([fRes, cRes]) => {
          setFeedbacks(fRes.data);
          setCustomers(cRes.data);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getCustomerName = (id: string) => customers.find(c => c.id === id)?.customer_name || 'Unknown';

  const handleEdit = (f: any) => {
      setForm({
          category: f.category,
          journey_stage: f.journey_stage,
          rating: f.rating,
          comment: f.comment,
          is_pain_point: f.is_pain_point
      });
      setEditingId(f.id);
      setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          if (editingId) {
              await api.put(`/feedbacks/${editingId}`, form);
          }
          setIsModalOpen(false);
          fetchData();
          setEditingId(null);
      } catch (error) {
          alert("Gagal menyimpan data feedback");
      }
  };

  const handleDelete = async (id: string) => {
      if (confirm('Yakin ingin menghapus feedback ini?')) {
          try {
              await api.delete(`/feedbacks/${id}`);
              fetchData();
          } catch (error) {
              alert('Gagal menghapus');
          }
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-dark">Data Feedback</h1>
      </div>

      <Card className="overflow-x-auto">
         <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-3">Tanggal</th>
                <th className="px-6 py-3">Pelanggan</th>
                <th className="px-6 py-3">Rating</th>
                <th className="px-6 py-3">Kategori</th>
                <th className="px-6 py-3">Komentar</th>
                <th className="px-6 py-3">Status</th>
                {user?.role === 'admin' && <th className="px-6 py-3">Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((f: any) => (
                <tr key={f.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{f.created_at ? format(new Date(f.created_at), 'dd MMM yyyy') : '-'}</td>
                  <td className="px-6 py-4 font-medium">{getCustomerName(f.customer_id)}</td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-1">
                         <Star size={14} className={f.rating >= 1 ? 'fill-warning text-warning' : 'text-gray-300'} />
                         <span className="font-bold">{f.rating}/5</span>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                     <div>{f.category}</div>
                     <div className="text-xs text-gray-400">{f.journey_stage}</div>
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate" title={f.comment}>{f.comment}</td>
                  <td className="px-6 py-4">
                     {f.is_pain_point ? (
                         <span className="flex w-max items-center gap-1 px-2 py-1 bg-danger/10 text-danger text-xs rounded-full">
                             <AlertTriangle size={12}/> Pain Point
                         </span>
                     ) : (
                         <span className="px-2 py-1 bg-success/10 text-success text-xs rounded-full">Aman</span>
                     )}
                  </td>
                  {user?.role === 'admin' && (
                      <td className="px-6 py-4 flex gap-2">
                          <button className="text-accent hover:text-accent/80" onClick={() => handleEdit(f)}><Edit size={16}/></button>
                          <button className="text-danger hover:text-danger/80" onClick={() => handleDelete(f.id)}><Trash size={16}/></button>
                      </td>
                  )}
                </tr>
              ))}
              {feedbacks.length === 0 && (
                <tr>
                   <td colSpan={7} className="px-6 py-8 text-center text-gray-500">Belum ada feedback</td>
                </tr>
              )}
            </tbody>
          </table>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Card className="w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Edit Feedback</h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-dark"><X size={20}/></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1">Kategori</label>
                        <select required className="w-full h-10 rounded-md border border-dark/20 px-3 text-sm focus:outline-primary" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                            <option value="Rasa">Rasa Produk</option>
                            <option value="Pelayanan">Pelayanan</option>
                            <option value="Harga">Harga</option>
                            <option value="Tempat">Tempat/Suasana</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Tahap Journey</label>
                        <select required className="w-full h-10 rounded-md border border-dark/20 px-3 text-sm focus:outline-primary" value={form.journey_stage} onChange={e => setForm({...form, journey_stage: e.target.value})}>
                            <option value="Awareness">Awareness</option>
                            <option value="Consideration">Consideration</option>
                            <option value="Purchase">Purchase</option>
                            <option value="Experience">Experience</option>
                            <option value="Retention">Retention</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Rating (1-5)</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button type="button" key={star} onClick={() => setForm({...form, rating: star})}>
                                    <Star size={24} className={star <= form.rating ? 'fill-warning text-warning' : 'text-gray-300'} />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Komentar</label>
                        <textarea 
                            required
                            rows={4}
                            className="w-full rounded-md border border-dark/20 px-3 py-2 text-sm focus:outline-primary" 
                            value={form.comment} 
                            onChange={e => setForm({...form, comment: e.target.value})}
                        />
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
  )
}
