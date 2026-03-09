import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet, TrendingUp, History, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useWalletStore } from '../../store';
import axios from 'axios';
import { useAuthStore } from '../../store';

export default function WalletView() {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const { tradingBalance, profitBalance, fetchWallet } = useWalletStore();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchWallet();
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
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-white">Dompet Saya</h1>
      </div>

      <div className="space-y-4 mb-8">
        <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center">
              <Wallet size={20} />
            </div>
            <span className="text-slate-400 font-medium">Saldo Trading</span>
          </div>
          <h2 className="text-2xl font-bold text-white">{formatIDR(tradingBalance)}</h2>
          <p className="text-xs text-slate-500 mt-2">Digunakan untuk menghasilkan profit otomatis</p>
        </div>

        <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
            <span className="text-slate-400 font-medium">Saldo Profit</span>
          </div>
          <h2 className="text-2xl font-bold text-white">{formatIDR(profitBalance)}</h2>
          <p className="text-xs text-slate-500 mt-2">Dapat ditarik ke rekening bank Anda</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-white flex items-center gap-2">
          <History size={18} className="text-blue-400" /> Riwayat Transaksi
        </h3>
        <button onClick={() => navigate('/dashboard/history')} className="text-xs text-blue-400 font-bold">Lihat Semua</button>
      </div>

      <div className="space-y-3">
        {history.slice(0, 5).map((item: any, i) => (
          <div key={i} className="bg-slate-800/50 p-4 rounded-2xl flex items-center justify-between border border-slate-800">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                item.type === 'deposit' ? 'bg-blue-500/10 text-blue-400' :
                item.type === 'withdraw' ? 'bg-red-500/10 text-red-400' :
                'bg-emerald-500/10 text-emerald-400'
              }`}>
                {item.type === 'deposit' ? <ArrowUpRight size={18} /> : 
                 item.type === 'withdraw' ? <ArrowDownLeft size={18} /> : 
                 <TrendingUp size={18} />}
              </div>
              <div>
                <p className="text-sm font-bold text-white capitalize">{item.type.replace('_', ' ')}</p>
                <p className="text-[10px] text-slate-500">{new Date(item.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <p className={`font-bold ${
              item.type === 'withdraw' ? 'text-red-400' : 'text-emerald-400'
            }`}>
              {item.type === 'withdraw' ? '-' : '+'}{formatIDR(item.amount)}
            </p>
          </div>
        ))}
        {history.length === 0 && (
          <p className="text-center text-slate-500 py-10 text-sm">Belum ada riwayat transaksi</p>
        )}
      </div>
    </div>
  );
}
