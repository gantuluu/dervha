import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, Landmark, Clock } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../../store';

export default function AdminWithdraws() {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [withdraws, setWithdraws] = useState([]);

  useEffect(() => {
    fetchWithdraws();
  }, []);

  const fetchWithdraws = async () => {
    try {
      const res = await axios.get('/api/admin/withdraws', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWithdraws(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const approve = async (id: number) => {
    if (!confirm('Approve withdraw ini? Pastikan Anda sudah mentransfer dana ke user.')) return;
    try {
      await axios.post(`/api/admin/withdraws/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchWithdraws();
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
        <h1 className="text-xl font-bold text-white">Persetujuan Withdraw</h1>
      </div>

      <div className="space-y-4">
        {withdraws.map((wd: any, i) => (
          <div key={i} className="bg-slate-800 p-5 rounded-3xl border border-slate-700 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-white">{wd.full_name}</p>
                <p className="text-xs text-slate-500">{wd.whatsapp}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                wd.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' :
                wd.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                'bg-red-500/10 text-red-500'
              }`}>
                {wd.status}
              </div>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700">
              <div className="flex items-center gap-2 mb-2 text-blue-400">
                <Landmark size={14} />
                <span className="text-xs font-bold uppercase tracking-wider">Data Bank User</span>
              </div>
              <p className="text-sm font-bold text-white">{wd.bank_name} - {wd.bank_account}</p>
              <p className="text-xs text-slate-500">A/N {wd.bank_owner}</p>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Jumlah Penarikan</p>
                <p className="text-xl font-bold text-red-400">{formatIDR(wd.amount)}</p>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                <Clock size={12} /> {new Date(wd.created_at).toLocaleString()}
              </div>
            </div>

            {wd.status === 'pending' && (
              <div className="flex gap-2 pt-2">
                <button onClick={() => approve(wd.id)} className="flex-1 py-3 bg-red-500 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2">
                  <Check size={16} /> Approve & Sent
                </button>
                <button className="flex-1 py-3 bg-slate-700 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2">
                  <X size={16} /> Reject
                </button>
              </div>
            )}
          </div>
        ))}
        {withdraws.length === 0 && (
          <p className="text-center text-slate-500 py-20">Tidak ada pengajuan penarikan.</p>
        )}
      </div>
    </div>
  );
}
