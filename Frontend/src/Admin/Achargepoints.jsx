import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import Toast, { useToast } from '../Components/Toast';
import api from '../api/api';

const Achargepoints = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);
  const { toasts, toast } = useToast();
  const navigate = useNavigate();

  const fetchStations = async () => {
    try {
      const { data } = await api.get('/admin/chargestations');
      setStations(data);
    } catch (err) {
      toast.error('Failed to load stations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStations(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this charging station?')) return;
    setDeleting(id);
    try {
      await api.delete(`/admin/chargestation/${id}`);
      toast.success('Station deleted.');
      fetchStations();
    } catch (err) {
      toast.error('Failed to delete station.');
    } finally {
      setDeleting(null);
    }
  };

  const filtered = stations.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.address_components?.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <Toast toasts={toasts} />

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Charge Points</h1>
          <p className="text-slate-500 text-sm mt-1">{stations.length} stations total</p>
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search by name or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-56 px-4 py-2 rounded-xl border border-slate-200 text-sm
              focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          <button
            onClick={() => navigate('/addchargestation')}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm
              font-semibold rounded-xl hover:bg-emerald-700 transition-colors whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Station
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">No stations found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">#</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Name</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">City</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">State</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Rating</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((station, idx) => (
                  <tr key={station._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 text-slate-400">{idx + 1}</td>
                    <td className="px-5 py-4 font-medium text-slate-800 max-w-[180px] truncate">{station.name}</td>
                    <td className="px-5 py-4 text-slate-500">{station.address_components?.city || '—'}</td>
                    <td className="px-5 py-4 text-slate-500">{station.address_components?.state || '—'}</td>
                    <td className="px-5 py-4">
                      {station.rating > 0 ? (
                        <span className="flex items-center gap-1 text-amber-600 font-medium">
                          ⭐ {station.rating}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/editchargestation/${station._id}`)}
                          className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100
                            hover:bg-slate-200 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(station._id)}
                          disabled={deleting === station._id}
                          className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50
                            hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {deleting === station._id ? '...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Achargepoints;