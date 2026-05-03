import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../lib/store';
import { LayoutDashboard, Users, UserPlus, ShoppingCart, MessageSquare, Route, PieChart, LogOut, Package } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState, useEffect } from 'react';

export default function AppLayout() {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const navItems = user.role === 'admin' ? [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Pelanggan', path: '/customers', icon: Users },
    { name: 'Produk', path: '/products', icon: Package },
    { name: 'Transaksi', path: '/transactions', icon: ShoppingCart },
    { name: 'Feedback', path: '/feedbacks', icon: MessageSquare },
    { name: 'Journey Mapping', path: '/cjm', icon: Route },
    { name: 'Segmentasi', path: '/segmentation', icon: PieChart },
    { name: 'Laporan', path: '/reports', icon: PieChart },
  ] : [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Input Transaksi', path: '/transactions/new', icon: ShoppingCart },
    { name: 'Data Pelanggan', path: '/customers', icon: Users },
    { name: 'Catat Feedback', path: '/feedbacks/new', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen flex h-full w-full overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-dark text-white p-6 space-y-8">
        <div className="flex items-center space-x-3 px-2">
          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
             <span className="serif font-bold text-xl">A</span>
          </div>
          <div>
            <h1 className="serif text-xl font-semibold leading-tight tracking-tight">Aroma Coffee</h1>
            <p className="text-[10px] uppercase tracking-widest text-accent opacity-80">Bland & Roastery</p>
          </div>
        </div>
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "p-3 rounded-xl flex items-center space-x-3 cursor-pointer transition-colors",
                  isActive ? "bg-primary text-white" : "hover:bg-white/5 text-white/60"
                )}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="pt-6 border-t border-white/10">
          <div className="flex items-center justify-between space-x-3">
             <div className="flex items-center space-x-3 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white shrink-0">
                   {user.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                   <p className="text-xs font-semibold truncate text-white">{user.name}</p>
                   <p className="text-[10px] text-white/40 capitalize">{user.role}</p>
                </div>
             </div>
             <button 
                onClick={logout}
                className="text-white/40 hover:text-danger hover:bg-white/5 p-2 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut size={16} />
             </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-4 md:p-8 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border border-primary/10 rounded-[20px] p-4 mb-4 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white"><span className="serif font-bold">A</span></div>
               <h1 className="text-lg serif font-bold text-dark">Aroma Coffee</h1>
            </div>
            <button onClick={logout} className="text-danger"><LogOut size={20}/></button>
        </header>

        <div className="flex-1 overflow-y-auto pr-2 pb-16 md:pb-0">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-dark/10 flex justify-around p-2 z-20 shadow-[0_-4px_20px_rgba(111,78,55,0.05)]">
         {navItems.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 text-[10px] transition-colors rounded-lg",
                  isActive ? "text-primary font-bold bg-primary/5" : "text-gray-500"
                )}
              >
                <Icon size={20} />
                <span className="truncate max-w-[60px]">{item.name}</span>
              </Link>
            );
          })}
      </nav>
    </div>
  );
}
