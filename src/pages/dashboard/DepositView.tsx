import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Upload, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../../store';

export default function DepositView() {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/user/deposit', {
        amount: Number(amount),
        proof_url: 'https://via.placeholder.com/300' // Mock upload
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Deposit Berhasil Dikirim</h2>
        <p className="text-slate-400 mb-8">Admin akan memverifikasi bukti transfer Anda dalam waktu maksimal 1x24 jam.</p>
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
        <h1 className="text-xl font-bold text-white">Deposit Dana</h1>
      </div>

      <div className="bg-blue-600/10 border border-blue-500/30 rounded-2xl p-4 mb-8 flex gap-4">
        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white shrink-0">
          <CreditCard size={20} />
        </div>
        <div>
          <p className="text-sm font-bold text-blue-400 mb-1">Transfer Bank BCA</p>
          <p className="text-lg font-mono text-white">123-456-7890</p>
          <p className="text-xs text-slate-400">A/N PT. PROFIT FLOW INDONESIA</p>
        </div>
      </div>

      <form onSubmit={handleDeposit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400 ml-1">Jumlah Deposit (Min Rp 500.000)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">Rp</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500"
              placeholder="0"
              min="500000"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400 ml-1">Upload Bukti Transfer</label>
          <div className="border-2 border-dashed border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-slate-800/30">
            <Upload className="text-slate-500" size={32} />
            <p className="text-sm text-slate-400">Klik untuk pilih file atau foto</p>
            <input type="file" className="hidden" />
          </div>
        </div>

        <div className="p-4 bg-slate-800/50 rounded-2xl flex gap-3 text-xs text-slate-400">
          <AlertCircle size={16} className="shrink-0 text-yellow-500" />
          <p>Pastikan nominal transfer sesuai dengan yang Anda masukkan. Kesalahan input dapat memperlambat proses verifikasi.</p>
        </div>

        <button
          type="submit"
          disabled={loading || !amount}
          className="w-full py-4 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-800 rounded-2xl font-bold text-lg text-white shadow-lg shadow-blue-500/20 transition-all"
        >
          {loading ? 'Mengirim...' : 'Konfirmasi Deposit'}
        </button>
      </form>
    </div>
  );
}
