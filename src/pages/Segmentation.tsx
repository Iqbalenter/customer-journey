import React from 'react';
import { useAppStore } from '../lib/store';
import { Card } from '../components/ui';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

export default function Segmentation() {
    const customers = useAppStore(state => state.customers);

    const segments = {
        'Baru': { count: 0, color: '#2196F3', desc: 'Pelanggan baru transaksi pertama' },
        'Aktif': { count: 0, color: '#4CAF50', desc: 'Sering bertransaksi tapi belum terikat' },
        'Potensial Loyal': { count: 0, color: '#FF9800', desc: 'Sering transaksi dan rating mulai tinggi' },
        'Loyal': { count: 0, color: '#D4A853', desc: 'Pelanggan setia dengan repeat purchase & rating tinggi' },
        'Tidak Aktif': { count: 0, color: '#9E9E9E', desc: 'Lama tidak bertransaksi' },
    };

    customers.forEach(c => {
        const s = c.customer_status || 'Baru';
        if (segments[s as keyof typeof segments]) {
            segments[s as keyof typeof segments].count++;
        }
    });

    const chartData = Object.entries(segments)
        .map(([name, data]) => ({ name, value: data.count, color: data.color }))
        .filter(d => d.value > 0);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-dark">Segmentasi Pelanggan</h1>
                <p className="text-gray-500">Berdasarkan frekuensi transaksi dan loyalitas</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                    <h3 className="font-bold mb-4">Distribusi Segmen</h3>
                    <div className="h-64">
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                            <Pie
                                data={chartData}
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <RechartsTooltip />
                            <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <div className="space-y-4">
                    {Object.entries(segments).map(([name, data]) => (
                        <Card key={name} className="p-4 flex items-center justify-between border-l-4" style={{borderLeftColor: data.color}}>
                            <div>
                                <h4 className="font-bold text-sm">{name}</h4>
                                <p className="text-[10px] text-gray-500 mt-1">{data.desc}</p>
                            </div>
                            <div className="text-xl font-bold">{data.count} <span className="text-xs font-normal text-gray-500">orang</span></div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
