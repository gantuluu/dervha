import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, Wallet, TrendingUp } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../../store';

export default function AdminMembers() {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMembers(res.data);
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
        <h1 className="text-xl font-bold text-white">Daftar Member</h1>
      </div>

      <div className="space-y-4">
        {members.map((member: any, i) => (
          <div key={i} className="bg-slate-800 p-5 rounded-3xl border border-slate-700 space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                  {member.full_name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-white">{member.full_name}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Phone size={12} /> {member.whatsapp}
                  </p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${member.is_active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                {member.is_active ? 'Active' : 'Suspended'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Trading Balance</p>
                <p className="text-sm font-bold text-blue-400">{formatIDR(member.trading_balance)}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Profit Balance</p>
                <p className="text-sm font-bold text-emerald-400">{formatIDR(member.profit_balance)}</p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button className="flex-1 py-2 bg-slate-700 rounded-xl text-xs font-bold text-white">Edit Paket</button>
              <button className={`flex-1 py-2 rounded-xl text-xs font-bold ${member.is_active ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                {member.is_active ? 'Suspend' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
