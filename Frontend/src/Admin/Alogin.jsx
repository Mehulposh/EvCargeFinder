import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContet';
import Toast, { useToast } from '../Components/Toast';

const Alogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();
  const { toasts, toast } = useToast();

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/admin/login', form);
      loginAdmin(data.admin, data.token);
      toast.success('Welcome, ' + data.admin.name);
      setTimeout(() => navigate('/ahome'), 800);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-emerald-50 flex items-center justify-center px-4">
      <Toast toasts={toasts} />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-slate-900 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Login</h1>
          <p className="text-slate-500 text-sm mt-1">Sign in to the admin dashboard</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required
                placeholder="admin@evcharge.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-400 transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} required
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-400 transition" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
              {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-6">
            No admin account?{' '}
            <Link to="/asignup" className="text-emerald-600 font-medium hover:underline">Create one</Link>
          </p>
        </div>
        <p className="text-center text-sm text-slate-400 mt-4">
          <Link to="/login" className="hover:underline">← Back to user login</Link>
        </p>
      </div>
    </div>
  );
};

export default Alogin;