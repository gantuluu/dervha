import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Wallet, TrendingUp, User, History } from 'lucide-react';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: <Home size={24} />, label: 'Home', path: '/dashboard' },
    { icon: <Wallet size={24} />, label: 'Wallet', path: '/dashboard/wallet' },
    { icon: <TrendingUp size={24} />, label: 'Profit', path: '/dashboard/profit' },
    { icon: <History size={24} />, label: 'History', path: '/dashboard/history' },
    { icon: <User size={24} />, label: 'Profile', path: '/dashboard/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[500px] bg-slate-900/80 backdrop-blur-xl border-t border-slate-800 px-6 py-3 flex justify-between items-center z-50">
      {navItems.map((item, i) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={i}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 transition-all ${isActive ? 'text-blue-500' : 'text-slate-500'}`}
          >
            <div className={`transition-transform duration-300 ${isActive ? 'scale-110 -translate-y-1' : ''}`}>
              {item.icon}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
            {isActive && <div className="w-1 h-1 bg-blue-500 rounded-full mt-0.5" />}
          </button>
        );
      })}
    </div>
  );
}
