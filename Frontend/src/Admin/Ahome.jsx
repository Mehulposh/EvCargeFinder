import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AdminLayout from './AdminLayout';
import { useAuth } from '../context/AuthContet.jsx';
import api from '../api/api';

const StatCard = ({ label, value, icon, color, sub }) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-6">
    <div className="flex items-center justify-between mb-4">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
    </div>
    <p className="text-3xl font-bold text-slate-900">{value ?? '—'}</p>
    {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
  </div>
);

const Ahome = () => {
  const { admin } = useAuth();
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/stats');
        setStats(data);

        // Build chart data from recent bookings by station
        const stationMap = {};
        (data.recentBookings || []).forEach((b) => {
          const name = b.stationId?.name || 'Unknown';
          stationMap[name] = (stationMap[name] || 0) + 1;
        });
        setChartData(
          Object.entries(stationMap).map(([name, bookings]) => ({
            name: name.length > 14 ? name.slice(0, 14) + '…' : name,
            bookings,
          }))
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      label: 'Total Users',
      value: stats?.userCount,
      sub: 'Registered accounts',
      color: 'bg-blue-50',
      icon: <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    },
    {
      label: 'Charge Stations',
      value: stats?.stationCount,
      sub: 'Active locations',
      color: 'bg-emerald-50',
      icon: <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    },
    {
      label: 'Total Bookings',
      value: stats?.bookingCount,
      sub: 'Excluding cancelled',
      color: 'bg-purple-50',
      icon: <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    },
  ];

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Welcome back, {admin?.name}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {statCards.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-800 mb-6">Recent Bookings by Station</h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-6 h-6 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : chartData.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-12">No booking data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Bar dataKey="bookings" fill="#059669" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent bookings table */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-800 mb-4">Recent Upcoming Bookings</h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-6 h-6 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !stats?.recentBookings?.length ? (
            <p className="text-slate-400 text-sm text-center py-12">No recent bookings</p>
          ) : (
            <div className="space-y-3">
              {stats.recentBookings.map((b) => (
                <div key={b._id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {b.userId?.name || 'Unknown User'}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {b.stationId?.name || 'Unknown Station'}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-medium text-slate-700">{b.date}</p>
                    <p className="text-xs text-slate-500">{b.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Ahome;