import React, { useEffect, useState } from 'react';
import {QRCode} from 'react-qr-code';
import Sidebar from './Sidebar';
import Toast, { useToast } from '../Components/Toast';
import api from '../api/api';

const statusStyles = {
  upcoming: 'bg-blue-50 text-blue-700 border-blue-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-slate-100 text-slate-500 border-slate-200',
};

const statusDot = {
  upcoming: 'bg-blue-500',
  completed: 'bg-emerald-500',
  cancelled: 'bg-slate-400',
};

const Mybookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedQR, setExpandedQR] = useState(null);
  const [cancelling, setCancelling] = useState(null);
  const { toasts, toast } = useToast();

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/user/mybookings');
      setBookings(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(bookingId);
    try {
      await api.patch(`/user/booking/${bookingId}/cancel`);
      toast.success('Booking cancelled.');
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking.');
    } finally {
      setCancelling(null);
    }
  };

  const upcomingCount = bookings.filter((b) => b.status === 'upcoming').length;

  return (
    <Sidebar>
      <Toast toasts={toasts} />

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Bookings</h1>
          <p className="text-slate-500 text-sm mt-1">
            {loading ? 'Loading...' : `${bookings.length} total · ${upcomingCount} upcoming`}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="font-semibold text-slate-800 mb-1">No bookings yet</h3>
          <p className="text-slate-500 text-sm">Find a charging station and book your first slot.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className={`bg-white rounded-2xl border p-5 transition-shadow hover:shadow-md
                ${booking.status === 'cancelled' ? 'opacity-60' : ''}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 truncate">{booking.stationName}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {booking.address?.city && `${booking.address.city}, `}{booking.address?.state}
                  </p>
                </div>
                <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border flex-shrink-0 ${statusStyles[booking.status]}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusDot[booking.status]}`} />
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-0.5">Date</p>
                  <p className="text-sm font-medium text-slate-800">📅 {booking.date}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-0.5">Time</p>
                  <p className="text-sm font-medium text-slate-800">🕐 {booking.time}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-0.5">Phone</p>
                  <p className="text-sm font-medium text-slate-800">📞 {booking.phno}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-0.5">Booked on</p>
                  <p className="text-sm font-medium text-slate-800">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {booking.status === 'upcoming' && (
                  <>
                    <button
                      onClick={() => setExpandedQR(expandedQR === booking._id ? null : booking._id)}
                      className="flex-1 py-2 text-xs font-medium text-emerald-700 bg-emerald-50
                        hover:bg-emerald-100 rounded-xl transition-colors"
                    >
                      {expandedQR === booking._id ? 'Hide QR' : 'Show QR'}
                    </button>
                    <button
                      onClick={() => handleCancel(booking._id)}
                      disabled={cancelling === booking._id}
                      className="flex-1 py-2 text-xs font-medium text-red-600 bg-red-50
                        hover:bg-red-100 rounded-xl transition-colors disabled:opacity-50"
                    >
                      {cancelling === booking._id ? 'Cancelling...' : 'Cancel'}
                    </button>
                  </>
                )}
              </div>

              {/* QR Code */}
              {expandedQR === booking._id && (
                <div className="mt-4 flex flex-col items-center p-4 bg-slate-50 rounded-xl">
                  <QRCode
                    value={JSON.stringify({
                      id: booking._id,
                      station: booking.stationName,
                      date: booking.date,
                      time: booking.time,
                      user: booking.userName,
                    })}
                    size={140}
                    level="M"
                  />
                  <p className="text-xs text-slate-500 mt-3 text-center">
                    Show this QR code at the charging station
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Sidebar>
  );
};

export default Mybookings;