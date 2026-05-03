import React, { useState, useEffect } from 'react';
import { api } from '../lib/store';
import { Card } from '../components/ui';
import { AlertTriangle, Lightbulb, Users } from 'lucide-react';

const STAGES = [
    { id: 'Awareness', title: 'Awareness', desc: 'Menyadari brand' },
    { id: 'Consideration', title: 'Consideration', desc: 'Mempertimbangkan beli' },
    { id: 'Purchase', title: 'Purchase', desc: 'Melakukan transaksi' },
    { id: 'Experience', title: 'Experience', desc: 'Menikmati produk/layanan' },
    { id: 'Retention', title: 'Retention', desc: 'Pembelian kembali' },
    { id: 'Loyalty', title: 'Loyalty', desc: 'Merekomendasikan ke pihak lain' },
];

export default function CJM() {
    const [feedbacks, setFeedbacks] = useState<any[]>([]);

    useEffect(() => {
        api.get('/feedbacks').then(res => setFeedbacks(res.data));
    }, []);

    const getStageData = (stageId: string) => {
        const stageFeedbacks = feedbacks.filter(f => f.journey_stage === stageId);
        const painPoints = stageFeedbacks.filter(f => f.is_pain_point);
        return {
            count: stageFeedbacks.length,
            painPoints: painPoints.length,
            recentComments: stageFeedbacks.slice(0, 2).map(f => f.comment)
        };
    };

    return (
        <div className="space-y-6">
            <header className="mb-8">
               <h1 className="text-3xl tracking-tight font-bold text-dark">Journey Mapping</h1>
               <p className="text-gray-500 mt-1">Visualisasi perjalanan pelanggan dan identifikasi masalah pada setiap tahap.</p>
            </header>

            <Card className="p-6 flex flex-col mb-8 overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="serif text-2xl font-semibold text-primary">Customer Journey Pipeline</h3>
                    <div className="flex space-x-2">
                        <span className="text-[10px] bg-background px-3 py-1 rounded-full text-primary font-bold uppercase">Live Tracking</span>
                    </div>
                </div>
                
                <div className="flex items-center justify-between flex-1 relative mb-4">
                    {STAGES.map((stage) => {
                        const data = getStageData(stage.id);
                        const isHighPain = data.painPoints > 0;
                        const activeClass = isHighPain ? "bg-danger text-white rounded-2xl" : "cjm-step text-dark"; // simple active styling
                        return (
                            <div key={stage.id} className={`cjm-step ${isHighPain ? 'active-step' : 'text-dark'}`}>
                                <div className={`text-[10px] font-bold uppercase mb-2 ${isHighPain ? 'text-white/60' : 'text-gray-400'}`}>{stage.title}</div>
                                <div className="text-2xl font-bold mb-1">{data.count}</div>
                                <div className={`text-[9px] italic leading-tight ${isHighPain ? 'text-white/80' : 'text-accent'}`}>{stage.desc}</div>
                            </div>
                        )
                    })}
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {STAGES.map((stage, idx) => {
                    const data = getStageData(stage.id);
                    return (
                        <Card key={stage.id} className="p-5 space-y-4 relative overflow-hidden group">
                           <div className="absolute top-0 left-0 w-full h-1" style={{backgroundColor: data.painPoints > 0 ? 'var(--color-danger)' : 'var(--color-primary)'}}></div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                                    {idx + 1}
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm tracking-tight">{stage.title}</h3>
                                    <p className="text-xs text-gray-400">Total: {data.count} Feedbacks</p>
                                </div>
                            </div>

                            {data.painPoints > 0 && (
                                <div className="bg-danger/5 border border-danger/10 p-3 rounded-xl text-danger">
                                    <div className="flex items-center gap-1 font-bold text-xs mb-1 uppercase tracking-wider">
                                        <AlertTriangle size={14} /> Dominan Pain Point
                                    </div>
                                    <p className="text-[11px] leading-relaxed">
                                        Ditemukan {data.painPoints} keluhan pada tahap ini.
                                    </p>
                                </div>
                            )}

                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Touchpoint</h4>
                                <ul className="text-xs text-gray-600 list-none space-y-1">
                                    {stage.id === 'Awareness' && <li className="flex gap-2 before:content-['•'] before:text-accent">Social Media</li>}
                                    {stage.id === 'Consideration' && <li className="flex gap-2 before:content-['•'] before:text-accent">Menu / Daftar Harga</li>}
                                    {stage.id === 'Purchase' && <li className="flex gap-2 before:content-['•'] before:text-accent">Kasir / Pembayaran</li>}
                                    {stage.id === 'Experience' && <li className="flex gap-2 before:content-['•'] before:text-accent">Penyajian / Rasa</li>}
                                    {stage.id === 'Retention' && <li className="flex gap-2 before:content-['•'] before:text-accent">Promo / Follow up</li>}
                                    {stage.id === 'Loyalty' && <li className="flex gap-2 before:content-['•'] before:text-accent">Membership / Referal</li>}
                                </ul>
                            </div>

                            {data.recentComments.length > 0 && (
                                <div className="pt-2 border-t border-gray-100">
                                    <h4 className="text-xs font-bold mb-2 text-gray-500">Recent Feedback</h4>
                                    <div className="space-y-2">
                                        {data.recentComments.map((c, i) => (
                                            <p key={i} className="text-xs text-gray-600 bg-background/50 border border-dark/5 p-2 rounded-lg italic">"{c}"</p>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                        </Card>
                    );
                })}
            </div>
        </div>
    )
}
