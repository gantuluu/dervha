import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { TrendingUp } from 'lucide-react';

export default function SplashView() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleStart = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
    navigate('/landing');
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-slate-900 to-blue-900 text-white">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="mb-6"
      >
        <div className="w-24 h-24 bg-blue-500 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/50">
          <TrendingUp size={48} />
        </div>
      </motion.div>

      <h1 className="text-3xl font-bold mb-2 text-center">ProfitFlow</h1>
      <p className="text-blue-200 text-center mb-12">Trading Investasi Profit Berjenjang</p>

      {loading ? (
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-sm text-blue-300">Menyiapkan Dashboard...</p>
        </div>
      ) : (
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          onClick={handleStart}
          className="w-full py-4 bg-blue-500 hover:bg-blue-600 rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/30 transition-all"
        >
          Buka Aplikasi
        </motion.button>
      )}
    </div>
  );
}
