import React, { useState } from 'react';
import { useAppStore } from '../lib/store';
import { Button, Input, Card } from '../components/ui';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FeedbackForm() {
    const customers = useAppStore(state => state.customers);
    const products = useAppStore(state => state.products);
    const addFeedback = useAppStore(state => state.addFeedback);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        customer_id: '',
        product_id: '',
        rating: 5,
        category: 'Rasa',
        comment: '',
        journey_stage: 'Experience'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            addFeedback({ ...form, created_at: new Date().toISOString() });
            alert('Feedback berhasil disimpan');
            navigate('/feedbacks');
        } catch (error) {
            alert('Gagal menyimpan feedback');
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-dark">Catat Feedback Pelanggan</h1>
            
            <Card className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm mb-1">Pelanggan</label>
                            <select required className="w-full h-10 rounded-md border border-dark/20 px-3 text-sm" value={form.customer_id} onChange={e => setForm({...form, customer_id: e.target.value})}>
                                <option value="">-- Pilih Pelanggan --</option>
                                {customers.map(c => <option key={c.id} value={c.id}>{c.customer_name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Produk (Terkait)</label>
                            <select className="w-full h-10 rounded-md border border-dark/20 px-3 text-sm" value={form.product_id} onChange={e => setForm({...form, product_id: e.target.value})}>
                                <option value="">-- Umum / Tidak Spesifik --</option>
                                {products.map(p => <option key={p.id} value={p.id}>{p.product_name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm mb-1">Kategori</label>
                            <select required className="w-full h-10 rounded-md border border-dark/20 px-3 text-sm" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                                <option value="Rasa">Rasa Produk</option>
                                <option value="Pelayanan">Pelayanan</option>
                                <option value="Harga">Harga</option>
                                <option value="Tempat">Tempat/Suasana</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Tahap Journey</label>
                            <select required className="w-full h-10 rounded-md border border-dark/20 px-3 text-sm" value={form.journey_stage} onChange={e => setForm({...form, journey_stage: e.target.value})}>
                                <option value="Awareness">Awareness</option>
                                <option value="Consideration">Consideration</option>
                                <option value="Purchase">Purchase</option>
                                <option value="Experience">Experience</option>
                                <option value="Retention">Retention</option>
                            </select>
                        </div>
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

                    <Button type="submit" className="w-full">Simpan Feedback</Button>
                </form>
            </Card>
        </div>
    )
}
