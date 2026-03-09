import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, MapPin, Landmark, LogOut, ChevronRight, Shield, Bell, HelpCircle } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../../store';

export default function ProfileView() {
  const navigate = useNavigate();
  const { token, logout } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <div className="p-6 pb-10">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-white">Profil Saya</h1>
      </div>

      {/* Profile Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4 border-4 border-slate-800 shadow-xl">
          {profile?.full_name?.charAt(0)}
        </div>
        <h2 className="text-xl font-bold text-white">{profile?.full_name}</h2>
        <p className="text-slate-500 text-sm">{profile?.whatsapp}</p>
        <div className="mt-4 px-4 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-bold uppercase tracking-wider">
          Verified Account
        </div>
      </div>

      {/* Info Sections */}
      <div className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Informasi Akun</h3>
          <div className="bg-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-700">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User size={18} className="text-blue-400" />
                <span className="text-sm text-white">Nama Lengkap</span>
              </div>
              <span className="text-sm text-slate-400">{profile?.full_name}</span>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-blue-400" />
                <span className="text-sm text-white">WhatsApp</span>
              </div>
              <span className="text-sm text-slate-400">{profile?.whatsapp}</span>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-blue-400" />
                <span className="text-sm text-white">Lokasi</span>
              </div>
              <span className="text-sm text-slate-400">{profile?.city}, {profile?.province}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Data Perbankan</h3>
          <div className="bg-slate-800 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center text-blue-400">
              <Landmark size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">{profile?.bank_name} - {profile?.bank_account}</p>
              <p className="text-xs text-slate-500">A/N {profile?.bank_owner}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Lainnya</h3>
          <div className="bg-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-700">
            <button className="w-full p-4 flex items-center justify-between hover:bg-slate-700 transition-colors">
              <div className="flex items-center gap-3">
                <Shield size={18} className="text-slate-400" />
                <span className="text-sm text-white">Keamanan & Password</span>
              </div>
              <ChevronRight size={18} className="text-slate-600" />
            </button>
            <button className="w-full p-4 flex items-center justify-between hover:bg-slate-700 transition-colors">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-slate-400" />
                <span className="text-sm text-white">Notifikasi</span>
              </div>
              <ChevronRight size={18} className="text-slate-600" />
            </button>
            <button className="w-full p-4 flex items-center justify-between hover:bg-slate-700 transition-colors">
              <div className="flex items-center gap-3">
                <HelpCircle size={18} className="text-slate-400" />
                <span className="text-sm text-white">Pusat Bantuan</span>
              </div>
              <ChevronRight size={18} className="text-slate-600" />
            </button>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-4 bg-red-500/10 hover:bg-red-500/20 rounded-2xl font-bold text-red-500 flex items-center justify-center gap-2 transition-all"
        >
          <LogOut size={20} /> Keluar Akun
        </button>
      </div>
    </div>
  );
}
