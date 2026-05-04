import React from 'react';
import { useAppStore } from '../lib/store';
import { Card, Button } from '../components/ui';
import { format } from 'date-fns';
import { Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

export default function Reports() {
    const transactions = useAppStore(state => state.transactions);

    const mockTrendData = [
        {name: 'W1', trx: 12},
        {name: 'W2', trx: 19},
        {name: 'W3', trx: 15},
        {name: 'W4', trx: 22},
    ];

    const handleExport = () => {
        alert("Fungsi Export PDF/Excel berjalan (Simulasi)");
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-dark">Laporan Loyalitas & Transaksi</h1>
                    <p className="text-gray-500">Analisis tren dan export data</p>
                </div>
                <Button onClick={handleExport} className="gap-2"><Download size={16}/> Export Laporan</Button>
            </div>

            <Card className="p-6">
                <h3 className="font-bold mb-4">Tren Transaksi (Bulan Ini)</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockTrendData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <RechartsTooltip />
                            <Line type="monotone" dataKey="trx" stroke="#D4A853" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <Card className="overflow-x-auto mt-6">
                <div className="p-4 border-b border-gray-100"><h3 className="font-bold">Raw Data (Bulan Ini)</h3></div>
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                    <tr>
                        <th className="px-6 py-3">ID Transaksi</th>
                        <th className="px-6 py-3">Tanggal</th>
                        <th className="px-6 py-3">Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    {transactions.slice(0, 5).map((t: any) => (
                        <tr key={t.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{t.id}</td>
                        <td className="px-6 py-4">{format(new Date(t.transaction_date), 'dd MMM yyyy HH:mm')}</td>
                        <td className="px-6 py-4 font-bold text-primary">Rp {t.total_amount.toLocaleString('id-ID')}</td>
                        </tr>
                    ))}
                    {transactions.length === 0 && (
                        <tr>
                        <td colSpan={3} className="px-6 py-8 text-center text-gray-500">Belum ada transaksi</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </Card>
        </div>
    );
}
