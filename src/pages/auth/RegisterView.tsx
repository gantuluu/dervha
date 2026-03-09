import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, Phone, Lock, MapPin, Landmark, CreditCard, UserCheck, ArrowRight, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function RegisterView() {
  const [formData, setFormData] = useState({
    full_name: '',
    whatsapp: '',
    password: '',
    address: '',
    city: '',
    province: '',
    country: 'Indonesia',
    bank_name: '',
    bank_account: '',
    bank_owner: '',
    referred_by: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('/api/auth/register', formData);
      navigate('/auth/login', { state: { message: 'Registrasi berhasil! Silakan login.' } });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registrasi gagal. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full py-10 h-full overflow-y-auto">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Buat Akun</h1>
        <p className="text-slate-400">Lengkapi data untuk mulai trading</p>
      </motion.div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-2xl flex items-center gap-3 text-red-400 text-sm">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-6">
        {/* Personal Info */}
        <div className="space-y-4">
          <h3 className="text-blue-400 font-bold text-sm uppercase tracking-wider ml-1">Informasi Pribadi</h3>
          
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="text"
              name="full_name"
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500"
              placeholder="Nama Lengkap"
              required
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="text"
              name="whatsapp"
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500"
              placeholder="Nomor WhatsApp"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="password"
              name="password"
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500"
              placeholder="Password"
              required
            />
          </div>
        </div>

        {/* Address */}
        <div className="space-y-4">
          <h3 className="text-blue-400 font-bold text-sm uppercase tracking-wider ml-1">Alamat</h3>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="text"
              name="address"
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500"
              placeholder="Alamat Lengkap"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="city"
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-blue-500"
              placeholder="Kota"
              required
            />
            <input
              type="text"
              name="province"
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-blue-500"
              placeholder="Provinsi"
              required
            />
          </div>
        </div>

        {/* Bank Data */}
        <div className="space-y-4">
          <h3 className="text-blue-400 font-bold text-sm uppercase tracking-wider ml-1">Data Rekening Bank</h3>
          <div className="relative">
            <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="text"
              name="bank_name"
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500"
              placeholder="Nama Bank (BCA, Mandiri, dll)"
              required
            />
          </div>
          <div className="relative">
            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="text"
              name="bank_account"
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500"
              placeholder="Nomor Rekening"
              required
            />
          </div>
          <div className="relative">
            <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="text"
              name="bank_owner"
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500"
              placeholder="Nama Pemilik Rekening"
              required
            />
          </div>
        </div>

        {/* Referral */}
        <div className="space-y-4">
          <h3 className="text-blue-400 font-bold text-sm uppercase tracking-wider ml-1">Referral (Opsional)</h3>
          <input
            type="text"
            name="referred_by"
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-blue-500"
            placeholder="Kode Referral"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-800 rounded-2xl font-bold text-lg text-white shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
        >
          {loading ? 'Mendaftarkan...' : 'Daftar Sekarang'} <ArrowRight size={20} />
        </button>
      </form>

      <div className="mt-10 text-center pb-10">
        <p className="text-slate-400">
          Sudah punya akun?{' '}
          <Link to="/auth/login" className="text-blue-400 font-bold">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
