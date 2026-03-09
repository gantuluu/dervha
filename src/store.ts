import { create } from 'zustand';
import axios from 'axios';

interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: any) => void;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  login: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ token: null, user: null, isAuthenticated: false });
  },
  checkAuth: () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (token && user) {
      set({ token, user, isAuthenticated: true });
    } else {
      set({ token: null, user: null, isAuthenticated: false });
    }
  }
}));

interface WalletState {
  tradingBalance: number;
  profitBalance: number;
  fetchWallet: () => Promise<void>;
}

export const useWalletStore = create<WalletState>((set) => ({
  tradingBalance: 0,
  profitBalance: 0,
  fetchWallet: async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/user/wallet', {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ tradingBalance: res.data.trading_balance, profitBalance: res.data.profit_balance });
    } catch (e) {
      console.error(e);
    }
  }
}));
