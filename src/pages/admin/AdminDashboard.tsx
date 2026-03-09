import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, CreditCard, ArrowDownLeft, TrendingUp, Zap, LogOut, Menu } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../../store';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { token, logout } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const runProfitEngine = async () => {
    setRunning(true);
    try {
      const res = await axios.post('/api/admin/run-profit-engine', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`Profit Engine Berhasil! Memproses ${res.data.processed} user.`);
      fetchStats();
    } catch (e) {
      console.error(e);
    } finally {
      setRunning(false);
    }
  };

  const formatIDR = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <button onClick={() => { logout(); navigate('/admin/login'); }} className="text-red-500">
          <LogOut size={24} />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-slate-800 p-5 rounded-3xl border border-slate-700">
          <Users size={20} className="text-blue-400 mb-2" />
          <p className="text-slate-400 text-xs">Total Member</p>
          <p className="text-xl font-bold text-white">{stats?.total_users || 0}</p>
        </div>
        <div className="bg-slate-800 p-5 rounded-3xl border border-slate-700">
          <TrendingUp size={20} className="text-emerald-400 mb-2" />
          <p className="text-slate-400 text-xs">Total Profit</p>
          <p className="text-xl font-bold text-white">{formatIDR(stats?.total_profit || 0)}</p>
        </div>
        <div className="bg-slate-800 p-5 rounded-3xl border border-slate-700">
          <CreditCard size={20} className="text-blue-400 mb-2" />
          <p className="text-slate-400 text-xs">Total Deposit</p>
          <p className="text-xl font-bold text-white">{formatIDR(stats?.total_deposit || 0)}</p>
        </div>
        <div className="bg-slate-800 p-5 rounded-3xl border border-slate-700">
          <ArrowDownLeft size={20} className="text-red-400 mb-2" />
          <p className="text-slate-400 text-xs">Total Withdraw</p>
          <p className="text-xl font-bold text-white">{formatIDR(stats?.total_withdraw || 0)}</p>
        </div>
      </div>

      {/* Profit Engine Control */}
      <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Zap size={24} className="text-yellow-400" />
          <h3 className="font-bold text-white">Profit Engine</h3>
        </div>
        <p className="text-sm text-slate-400 mb-6">Jalankan mesin profit secara manual untuk mendistribusikan profit ke semua user aktif.</p>
        <button
          onClick={runProfitEngine}
          disabled={running}
          className="w-full py-4 bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-800 rounded-2xl font-bold text-slate-900 flex items-center justify-center gap-2 transition-all"
        >
          {running ? 'Sedang Berjalan...' : 'Jalankan Sekarang'}
        </button>
      </div>

      {/* Admin Menu */}
      <h3 className="font-bold text-white mb-4">Manajemen</h3>
      <div className="grid grid-cols-1 gap-3">
        {[
          { label: 'Daftar Member', path: '/admin/members', icon: <Users size={20} />, color: 'bg-blue-500/10 text-blue-400' },
          { label: 'Persetujuan Deposit', path: '/admin/deposits', icon: <CreditCard size={20} />, color: 'bg-emerald-500/10 text-emerald-400' },
          { label: 'Persetujuan Withdraw', path: '/admin/withdraws', icon: <ArrowDownLeft size={20} />, color: 'bg-red-500/10 text-red-400' }
        ].map((item, i) => (
          <button
            key={i}
            onClick={() => navigate(item.path)}
            className="w-full p-4 bg-slate-800 hover:bg-slate-700 rounded-2xl flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                {item.icon}
              </div>
              <span className="font-bold text-white">{item.label}</span>
            </div>
            <Menu size={18} className="text-slate-600" />
          </button>
        ))}
      </div>
    </div>
  );
}
