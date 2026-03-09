import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle, ArrowRight, Shield, Zap, BarChart3, Users } from 'lucide-react';

export default function LandingView() {
  const navigate = useNavigate();

  const packages = [
    { name: 'Paket A', profit: '15%', min: '500.000', max: '4.900.000', color: 'from-blue-500 to-cyan-500' },
    { name: 'Paket B', profit: '20%', min: '5.000.000', max: '49.000.000', color: 'from-indigo-500 to-purple-500' },
    { name: 'Paket C', profit: '25%', min: '50.000.000', max: 'Unlimited', color: 'from-emerald-500 to-teal-500' },
    { name: 'Paket D', profit: '30%', min: '1.000.000.000', max: 'Unlimited', color: 'from-orange-500 to-red-500' },
  ];

  return (
    <div className="h-full overflow-y-auto bg-slate-950 text-white pb-10">
      {/* Hero */}
      <section className="p-8 pt-16 bg-gradient-to-b from-blue-900/20 to-transparent">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl font-bold leading-tight mb-4"
        >
          Bisnis Trading Dengan <span className="text-blue-400">Profit Berjenjang</span> Dan Berani Tampil Beda
        </motion.h1>
        <p className="text-slate-400 mb-8">Platform trading investasi dengan sistem profit otomatis setiap 3 jam.</p>
        <button
          onClick={() => navigate('/auth/register')}
          className="flex items-center gap-2 px-8 py-4 bg-blue-500 rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/20"
        >
          Gabung Sekarang <ArrowRight size={20} />
        </button>
      </section>

      {/* Benefits */}
      <section className="p-8">
        <h2 className="text-xl font-bold mb-6">Kenapa Memilih Kami?</h2>
        <div className="grid grid-cols-1 gap-4">
          {[
            { icon: <Zap className="text-yellow-400" />, text: "Profit masuk setiap 3 jam" },
            { icon: <Shield className="text-blue-400" />, text: "Modal kembali di akhir kontrak" },
            { icon: <BarChart3 className="text-emerald-400" />, text: "Sistem trading otomatis" },
            { icon: <Users className="text-purple-400" />, text: "Dashboard monitoring profit" }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-slate-900 rounded-2xl border border-slate-800">
              <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center">
                {item.icon}
              </div>
              <span className="font-medium">{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Packages */}
      <section className="p-8">
        <h2 className="text-xl font-bold mb-6">Pilihan Paket Investasi</h2>
        <div className="flex flex-col gap-6">
          {packages.map((pkg, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className={`p-6 rounded-3xl bg-gradient-to-br ${pkg.color} relative overflow-hidden`}
            >
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold">{pkg.name}</h3>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-bold">Profit {pkg.profit}</span>
                </div>
                <div className="space-y-1 opacity-90">
                  <p className="text-sm">Min: Rp {pkg.min}</p>
                  <p className="text-sm">Max: Rp {pkg.max}</p>
                </div>
                <button
                  onClick={() => navigate('/auth/register')}
                  className="mt-6 w-full py-3 bg-white text-slate-900 rounded-xl font-bold"
                >
                  Mulai Investasi
                </button>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-20">
                <BarChart3 size={120} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="p-8 text-center">
        <button onClick={() => navigate('/auth/login')} className="text-blue-400 font-medium">
          Sudah punya akun? Masuk di sini
        </button>
      </div>
    </div>
  );
}
