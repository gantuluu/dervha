import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Landmark, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useAuthStore, useWalletStore } from '../../store';

export default function WithdrawView() {
  const navigate = useNavigate();
  const { token, user } = useAuthStore();
  const { profitBalance, fetchWallet } = useWalletStore();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(amount) > profitBalance) {
      setError('Saldo profit tidak mencukupi');
      return;
    }
    if (Number(amount) < 50000) {
      setError('Minimal penarikan adalah Rp 50.000');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await axios.post('/api/user/withdraw', {
        amount: Number(amount)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(true);
      fetchWallet();
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal melakukan penarikan');
    } finally {
      setLoading(false);
    }
  };

  const formatIDR = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  if (success) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Penarikan Berhasil</h2>
        <p className="text-slate-400 mb-8">Dana akan dikirim ke rekening Anda dalam waktu maksimal 1x24 jam setelah disetujui admin.</p>
        <button onClick={() => navigate('/dashboard')} className="w-full py-4 bg-slate-800 rounded-2xl font-bold text-white">
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-white">Tarik Saldo Profit</h1>
      </div>

      <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 mb-8">
        <p className="text-slate-400 text-sm mb-1">Saldo Profit Tersedia</p>
        <h2 className="text-3xl font-bold text-emerald-400">{formatIDR(profitBalance)}</h2>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Landmark size={18} className="text-blue-400" />
          <span className="text-sm font-bold text-white">Rekening Tujuan</span>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-white font-medium">{user?.bank_name} - {user?.bank_account}</p>
          <p className="text-xs text-slate-500">A/N {user?.bank_owner}</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-2xl flex items-center gap-3 text-red-400 text-sm">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <form onSubmit={handleWithdraw} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400 ml-1">Jumlah Penarikan (Min Rp 50.000)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">Rp</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500"
              placeholder="0"
              required
            />
          </div>
        </div>

        <div className="p-4 bg-slate-800/50 rounded-2xl flex gap-3 text-xs text-slate-400">
          <AlertCircle size={16} className="shrink-0 text-yellow-500" />
          <p>Penarikan akan diproses setiap hari kerja. Pastikan data rekening Anda sudah benar.</p>
        </div>

        <button
          type="submit"
          disabled={loading || !amount}
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-800 rounded-2xl font-bold text-lg text-white shadow-lg shadow-emerald-500/20 transition-all"
        >
          {loading ? 'Memproses...' : 'Konfirmasi Penarikan'}
        </button>
      </form>
    </div>
  );
}
