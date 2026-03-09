import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Shield, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../../store';

export default function AdminLogin() {
  const [whatsapp, setWhatsapp] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('/api/auth/login', { whatsapp, password });
      if (res.data.user.is_admin !== 1) {
        setError('Anda bukan administrator.');
        return;
      }
      login(res.data.token, res.data.user);
      navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login gagal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-8 justify-center bg-slate-950">
      <div className="mb-10 text-center">
        <div className="w-20 h-20 bg-red-500 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-red-500/20">
          <Shield size={40} />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
        <p className="text-slate-400">Masuk untuk mengelola platform</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-2xl flex items-center gap-3 text-red-400 text-sm">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300 ml-1">Username / WhatsApp</label>
          <input
            type="text"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-red-500 transition-colors"
            placeholder="admin"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-red-500 transition-colors"
              placeholder="Masukkan password"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-red-500 hover:bg-red-600 disabled:bg-red-800 rounded-2xl font-bold text-lg text-white shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 transition-all"
        >
          {loading ? 'Memproses...' : 'Login Admin'} <ArrowRight size={20} />
        </button>
      </form>
    </div>
  );
}
