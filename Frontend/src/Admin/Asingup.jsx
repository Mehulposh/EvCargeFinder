import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContet';
import Toast, { useToast } from '../Components/Toast';
import NavBar from '../Components/NavBar';

const Asingup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();
  const { toasts, toast } = useToast();

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match.'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/admin/signup', {
        name: form.name, email: form.email, password: form.password
      });
      loginAdmin(data.admin, data.token);
      toast.success('Admin account created!');
      setTimeout(() => navigate('/ahome'), 800);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-emerald-50 flex flex-col">
      <Toast toasts={toasts} />
      <NavBar/>
      <div className='flex flex-1 items-center justify-center px-4 mt-3'>
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-slate-900 rounded-2xl mb-4">
              <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Create Admin Account</h1>
            <p className="text-slate-500 text-sm mt-1">Set up your admin dashboard access</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: 'Full Name', name: 'name', type: 'text', placeholder: 'John Admin' },
                { label: 'Email', name: 'email', type: 'email', placeholder: 'admin@evcharge.com' },
                { label: 'Password', name: 'password', type: 'password', placeholder: 'Min. 6 characters' },
                { label: 'Confirm Password', name: 'confirm', type: 'password', placeholder: '••••••••' },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{field.label}</label>
                  <input
                    type={field.type} name={field.name} value={form[field.name]}
                    onChange={handleChange} required placeholder={field.placeholder}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm
                      focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                      placeholder:text-slate-400 transition"
                  />
                </div>
              ))}
              <button type="submit" disabled={loading}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400
                  text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 mt-2">
                {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {loading ? 'Creating...' : 'Create Admin Account'}
              </button>
            </form>
            <p className="text-center text-sm text-slate-500 mt-6">
              Already have an account?{' '}
              <Link to="/alogin" className="text-emerald-600 font-medium hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Asingup;