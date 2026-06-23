import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContet';
import Logo from '../Components/Logo';
import Toast, { useToast } from '../Components/Toast';
import NavBar from '../Components/NavBar';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const { toasts, toast } = useToast();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/user/login', form);
      loginUser(data.user, data.token);
      toast.success('Welcome back, ' + data.user.name + '!');
      setTimeout(() => navigate('/uhome'), 800);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  bg-gradient-to-br from-emerald-50 to-slate-100 flex flex-col">
      <Toast toasts={toasts} />
      <NavBar/>
      <div className='flex flex-1 items-center justify-center px-4 mt-3'>
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Logo />
            <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
            <p className="text-slate-500 text-sm mt-1">Sign in to your EV Charge account</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm
                    focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                    placeholder:text-slate-400 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm
                    focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                    placeholder:text-slate-400 transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400
                  text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {loading && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Don't have an account?{' '}
              <Link to="/signup" className="text-emerald-600 font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          <p className="text-center text-sm text-slate-400 mt-6">
            Are you an admin?{' '}
            <Link to="/alogin" className="text-slate-600 hover:underline">Admin Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;