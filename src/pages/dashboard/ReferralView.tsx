import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Copy, Check, Share2, Award } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../../store';

export default function ReferralView() {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [data, setData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchReferrals();
  }, []);

  const fetchReferrals = async () => {
    try {
      const res = await axios.get('/api/user/referrals', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(data?.referral_code || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatIDR = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-white">Program Referral</h1>
      </div>

      <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-6 text-white mb-8 shadow-xl shadow-purple-500/20">
        <div className="flex items-center gap-3 mb-4">
          <Award size={24} />
          <span className="font-bold uppercase text-xs tracking-widest">Bonus Komisi 5%</span>
        </div>
        <p className="text-purple-100 text-sm mb-6">Dapatkan komisi 5% dari setiap deposit yang dilakukan oleh teman yang Anda undang.</p>
        
        <div className="bg-white/10 rounded-2xl p-4 flex items-center justify-between border border-white/10">
          <div>
            <p className="text-[10px] uppercase text-purple-200 font-bold mb-1">Kode Referral Anda</p>
            <p className="text-2xl font-mono font-bold">{data?.referral_code || '...'}</p>
          </div>
          <button onClick={copyToClipboard} className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700">
          <p className="text-slate-400 text-xs mb-1">Total Referral</p>
          <p className="text-xl font-bold text-white">{data?.referrals?.length || 0} Orang</p>
        </div>
        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700">
          <p className="text-slate-400 text-xs mb-1">Total Komisi</p>
          <p className="text-xl font-bold text-emerald-400">{formatIDR(data?.total_commission || 0)}</p>
        </div>
      </div>

      <h3 className="font-bold text-white mb-4 flex items-center gap-2">
        <Users size={18} className="text-blue-400" /> Daftar Referral
      </h3>

      <div className="space-y-3">
        {data?.referrals?.map((ref: any, i: number) => (
          <div key={i} className="bg-slate-800/50 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
            <div>
              <p className="font-bold text-white">{ref.full_name}</p>
              <p className="text-[10px] text-slate-500">Bergabung: {new Date(ref.created_at).toLocaleDateString()}</p>
            </div>
            <div className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-bold uppercase">
              Aktif
            </div>
          </div>
        ))}
        {data?.referrals?.length === 0 && (
          <div className="text-center py-10">
            <p className="text-slate-500 text-sm">Belum ada teman yang diundang.</p>
          </div>
        )}
      </div>

      <button className="w-full mt-8 py-4 bg-slate-800 rounded-2xl font-bold text-white flex items-center justify-center gap-2">
        <Share2 size={20} /> Bagikan Link Undangan
      </button>
    </div>
  );
}
