import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout.jsx';
import Toast, { useToast } from '../Components/Toast.jsx';
import api from '../api/api.js';
import { useNavigate } from 'react-router-dom';

const statusStyles = {
  upcoming: 'bg-blue-50 text-blue-700',
  completed: 'bg-emerald-50 text-emerald-700',
  cancelled: 'bg-slate-100 text-slate-500',
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const { toasts, toast } = useToast();
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data);
    } catch (err) {
      toast.error('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const openBookings = async (user) => {
    setSelectedUser(user);
    setBookingsLoading(true);
    try {
      const { data } = await api.get(`/admin/user/${user._id}/bookings`);
      setUserBookings(data);
    } catch (err) {
      toast.error('Failed to load bookings.');
    } finally {
      setBookingsLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Delete this user and all their bookings?')) return;
    setDeleting(userId);
    try {
      await api.delete(`/admin/user/${userId}`);
      toast.success('User deleted.');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to delete user.');
    } finally {
      setDeleting(null);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <Toast toasts={toasts} />

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Users</h1>
          <p className="text-slate-500 text-sm mt-1">{users.length} registered users</p>
        </div>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64 px-4 py-2 rounded-xl border border-slate-200 text-sm
            focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">No users found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">#</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Name</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Joined</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((user, idx) => (
                  <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 text-slate-400">{idx + 1}</td>
                    <td className="px-5 py-4 font-medium text-slate-800">{user.name}</td>
                    <td className="px-5 py-4 text-slate-500">{user.email}</td>
                    <td className="px-5 py-4 text-slate-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openBookings(user)}
                          className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50
                            hover:bg-emerald-100 rounded-lg transition-colors"
                        >
                          Bookings
                        </button>
                        <button
                          onClick={() => navigate(`/edituser/${user._id}`)}
                          className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100
                            hover:bg-slate-200 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          disabled={deleting === user._id}
                          className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50
                            hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {deleting === user._id ? '...' : 'Delete'}
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

      {/* Bookings modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h3 className="font-semibold text-slate-800">{selectedUser.name}'s Bookings</h3>
                <p className="text-xs text-slate-500">{selectedUser.email}</p>
              </div>
              <button
                onClick={() => { setSelectedUser(null); setUserBookings([]); }}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              {bookingsLoading ? (
                <div className="flex justify-center py-10">
                  <div className="w-6 h-6 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : userBookings.length === 0 ? (
                <p className="text-center text-slate-400 text-sm py-10">No bookings found</p>
              ) : (
                <div className="space-y-3">
                  {userBookings.map((b) => (
                    <div key={b._id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-slate-800 text-sm truncate">
                          {b.stationId?.name || b.stationName}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">{b.date} at {b.time}</p>
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${statusStyles[b.status]}`}>
                        {b.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Users;