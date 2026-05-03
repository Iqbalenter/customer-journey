import React, { useEffect, useState } from 'react';
import { useAuthStore, api } from '../lib/store';
import { Card } from '../components/ui';
import { Users, ShoppingCart, MessageSquare, Star, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const user = useAuthStore(state => state.user);
  const [stats, setStats] = useState<any>({ total_customers: 0, total_transactions: 0, total_feedbacks: 0, avg_rating: 0, loyalty_score: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard');
        setStats(res.data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="space-y-4 animate-pulse"><div className="h-32 bg-gray-200 rounded-lg"></div></div>;

  const mockChartData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 2780 },
    { name: 'May', sales: 6890 },
  ];

  const mockPieData = [
    { name: 'Puas', value: 400 },
    { name: 'Netral', value: 300 },
    { name: 'Kecewa', value: 100 },
  ];
  const COLORS = ['#4CAF50', '#FF9800', '#F44336'];

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end mb-8">
        <div className="space-y-1">
           <p className="serif italic text-lg text-primary">Welcome back, {user?.name}</p>
           <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
        </div>
        <div className="flex items-center space-x-4">
             <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase font-bold text-gray-400">System Date</span>
                <span className="text-sm font-medium">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
             </div>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Pelanggan" value={stats.total_customers} icon={<Users size={20} className="text-primary"/>} />
        <StatCard title="Active Transactions" value={stats.total_transactions} icon={<ShoppingCart size={20} className="text-primary"/>} />
        <StatCard title="Average Rating" value={stats.avg_rating} icon={<Star size={20} className="fill-accent text-accent"/>} />
        <Card className="p-5 space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Loyalty Score</p>
            <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold">{stats.loyalty_score || 0}</span>
                <span className="loyalty-badge">
                   {(stats.loyalty_score || 0) > 70 ? 'Excellent' : (stats.loyalty_score || 0) > 40 ? 'Good' : 'Low'}
                </span>
            </div>
        </Card>
      </div>

      {user?.role === 'admin' && (
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <Card className="p-4">
            <h3 className="font-semibold mb-4 text-sm">Tren Transaksi</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="sales" fill="#6F4E37" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card className="p-4">
            <h3 className="font-semibold mb-4 text-sm">Distribusi Kepuasan</h3>
            <div className="h-64">
               <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockPieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {mockPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) {
  return (
    <Card className="p-5 space-y-2">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold">{value}</span>
        <div className="p-2 bg-primary/10 rounded-full">
          {icon}
        </div>
      </div>
    </Card>
  );
}
