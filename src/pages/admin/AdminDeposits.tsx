import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, ExternalLink, Clock } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../../store';

export default function AdminDeposits() {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [deposits, setDeposits] = useState([]);

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    try {
      const res = await axios.get('/api/admin/deposits', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDeposits(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const approve = async (id: number) => {
    if (!confirm('Approve deposit ini?')) return;
    try {
      await axios.post(`/api/admin/deposits/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDeposits();
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
        <h1 className="text-xl font-bold text-white">Persetujuan Deposit</h1>
      </div>

      <div className="space-y-4">
        {deposits.map((dep: any, i) => (
          <div key={i} className="bg-slate-800 p-5 rounded-3xl border border-slate-700 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-white">{dep.full_name}</p>
                <p className="text-xs text-slate-500">{dep.whatsapp}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                dep.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' :
                dep.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                'bg-red-500/10 text-red-500'
              }`}>
                {dep.status}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Jumlah Deposit</p>
                <p className="text-xl font-bold text-blue-400">{formatIDR(dep.amount)}</p>
              </div>
              <button className="text-blue-400 flex items-center gap-1 text-xs font-bold">
                Bukti <ExternalLink size={14} />
              </button>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <Clock size={12} /> {new Date(dep.created_at).toLocaleString()}
            </div>

            {dep.status === 'pending' && (
              <div className="flex gap-2 pt-2">
                <button onClick={() => approve(dep.id)} className="flex-1 py-3 bg-emerald-500 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2">
                  <Check size={16} /> Approve
                </button>
                <button className="flex-1 py-3 bg-red-500/10 rounded-xl text-xs font-bold text-red-500 flex items-center justify-center gap-2">
                  <X size={16} /> Reject
                </button>
              </div>
            )}
          </div>
        ))}
        {deposits.length === 0 && (
          <p className="text-center text-slate-500 py-20">Tidak ada pengajuan deposit.</p>
        )}
      </div>
    </div>
  );
}
