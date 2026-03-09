import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft, Bell, User, ChevronRight, Users } from 'lucide-react';
import { useAuthStore, useWalletStore } from '../../store';

export default function HomeView() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { tradingBalance, profitBalance, fetchWallet } = useWalletStore();

  useEffect(() => {
    fetchWallet();
  }, []);

  const formatIDR = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            {user?.full_name?.charAt(0)}
          </div>
          <div>
            <p className="text-xs text-slate-400">Selamat Datang,</p>
            <p className="font-bold text-white">{user?.full_name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
            <Bell size={20} />
          </button>
          <button onClick={() => navigate('/dashboard/profile')} className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
            <User size={20} />
          </button>
        </div>
      </div>

      {/* Wallet Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-6 text-white shadow-xl shadow-blue-500/20"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-blue-100 text-sm mb-1">Total Saldo Trading</p>
            <h2 className="text-3xl font-bold">{formatIDR(tradingBalance)}</h2>
          </div>
          <div className="bg-white/20 p-2 rounded-xl">
            <Wallet size={24} />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
          <div>
            <p className="text-blue-100 text-xs mb-1">Saldo Profit</p>
            <p className="font-bold text-emerald-300">{formatIDR(profitBalance)}</p>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-xs mb-1">Status Akun</p>
            <p className="font-bold text-white">Aktif</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => navigate('/dashboard/deposit')}
          className="flex items-center justify-center gap-2 py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl text-white font-bold transition-all"
        >
          <ArrowUpRight size={20} className="text-blue-400" /> Deposit
        </button>
        <button
          onClick={() => navigate('/dashboard/withdraw')}
          className="flex items-center justify-center gap-2 py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl text-white font-bold transition-all"
        >
          <ArrowDownLeft size={20} className="text-emerald-400" /> Withdraw
        </button>
      </div>

      {/* Active Package */}
      <div className="bg-slate-800/50 rounded-3xl p-6 border border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-white">Paket Trading Aktif</h3>
          <TrendingUp size={20} className="text-blue-400" />
        </div>
        
        {tradingBalance > 0 ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Estimasi Profit Berikutnya</span>
              <span className="text-emerald-400 font-bold">~ {formatIDR(tradingBalance * 0.15)}</span>
            </div>
            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '65%' }}
                className="bg-blue-500 h-full"
              ></motion.div>
            </div>
            <p className="text-center text-xs text-slate-500">Profit otomatis masuk setiap 3 jam</p>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-slate-500 text-sm mb-4">Belum ada paket aktif. Silakan deposit untuk mulai trading.</p>
            <button
              onClick={() => navigate('/dashboard/deposit')}
              className="text-blue-400 text-sm font-bold flex items-center justify-center gap-1 mx-auto"
            >
              Mulai Sekarang <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: <TrendingUp size={24} />, label: 'Profit', path: '/dashboard/profit', color: 'text-emerald-400' },
          { icon: <Users size={24} />, label: 'Referral', path: '/dashboard/referral', color: 'text-blue-400' },
          { icon: <Wallet size={24} />, label: 'Dompet', path: '/dashboard/wallet', color: 'text-purple-400' },
          { icon: <BarChart3 size={24} />, label: 'History', path: '/dashboard/history', color: 'text-orange-400' }
        ].map((item, i) => (
          <button
            key={i}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center gap-2"
          >
            <div className={`w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center ${item.color}`}>
              {item.icon}
            </div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function BarChart3({ size, className }: { size: number, className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  );
}
