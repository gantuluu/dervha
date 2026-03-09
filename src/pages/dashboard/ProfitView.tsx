import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Calendar } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../../store';

export default function ProfitView() {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [profits, setProfits] = useState([]);

  useEffect(() => {
    fetchProfits();
  }, []);

  const fetchProfits = async () => {
    try {
      const res = await axios.get('/api/user/profits', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfits(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const formatIDR = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-white">Riwayat Profit</h1>
      </div>

      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-3xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp size={20} className="text-emerald-400" />
          <span className="text-emerald-400 font-bold uppercase text-xs tracking-wider">Total Profit Diterima</span>
        </div>
        <h2 className="text-3xl font-bold text-white">
          {formatIDR(profits.reduce((acc: number, curr: any) => acc + curr.amount, 0))}
        </h2>
      </div>

      <div className="space-y-4">
        {profits.map((item: any, i) => (
          <div key={i} className="bg-slate-800/50 p-5 rounded-2xl border border-slate-800 flex justify-between items-center">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar size={14} />
                <span className="text-xs">{new Date(item.created_at).toLocaleString()}</span>
              </div>
              <p className="font-bold text-white">Profit Trading Otomatis</p>
            </div>
            <p className="text-emerald-400 font-bold">+{formatIDR(item.amount)}</p>
          </div>
        ))}
        {profits.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
              <TrendingUp size={32} />
            </div>
            <p className="text-slate-500">Belum ada profit yang masuk.</p>
          </div>
        )}
      </div>
    </div>
  );
}
