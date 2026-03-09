import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, History, ArrowUpRight, ArrowDownLeft, TrendingUp, Filter } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../../store';

export default function HistoryView() {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('/api/user/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const formatIDR = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-white">Riwayat Transaksi</h1>
        </div>
        <button className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
          <Filter size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {history.map((item: any, i) => (
          <div key={i} className="bg-slate-800/50 p-5 rounded-2xl border border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                item.type === 'deposit' ? 'bg-blue-500/10 text-blue-400' :
                item.type === 'withdraw' ? 'bg-red-500/10 text-red-400' :
                'bg-emerald-500/10 text-emerald-400'
              }`}>
                {item.type === 'deposit' ? <ArrowUpRight size={24} /> : 
                 item.type === 'withdraw' ? <ArrowDownLeft size={24} /> : 
                 <TrendingUp size={24} />}
              </div>
              <div>
                <p className="font-bold text-white capitalize">{item.type.replace('_', ' ')}</p>
                <p className="text-xs text-slate-500">{new Date(item.created_at).toLocaleString()}</p>
                <p className="text-[10px] text-slate-400 mt-1">{item.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-bold text-lg ${
                item.type === 'withdraw' ? 'text-red-400' : 'text-emerald-400'
              }`}>
                {item.type === 'withdraw' ? '-' : '+'}{formatIDR(item.amount)}
              </p>
              <span className="text-[10px] uppercase font-bold text-slate-500">Berhasil</span>
            </div>
          </div>
        ))}
        {history.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
              <History size={32} />
            </div>
            <p className="text-slate-500">Belum ada transaksi.</p>
          </div>
        )}
      </div>
    </div>
  );
}
