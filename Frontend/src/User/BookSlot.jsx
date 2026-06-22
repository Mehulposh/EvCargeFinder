import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import SlotPicker from './SlotPicker';
import Toast, { useToast } from '../Components/Toast';
import api from '../api/api';
import { useAuth } from '../context/AuthContet';

const BookSlot = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toasts, toast } = useToast();

  const station = location.state?.station || null;

  const [form, setForm] = useState({ phno: '', date: '', time: '' });
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  // Fetch booked slots whenever date changes
  useEffect(() => {
    if (!form.date) return;
    const fetchSlots = async () => {
      setLoadingSlots(true);
      try {
        const { data } = await api.get(`/user/slots/${id}?date=${form.date}`);
        setBookedSlots(data.bookedSlots || []);
      } catch (err) {
        console.error('Error fetching slots:', err);
        setBookedSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
    // Reset time selection when date changes
    setForm((prev) => ({ ...prev, time: '' }));
  }, [form.date, id]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.phno || !form.date || !form.time) {
      toast.error('Please fill all fields and select a time slot.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/user/booking', {
        stationId: id,
        stationName: station?.name || 'Unknown Station',
        phno: form.phno,
        date: form.date,
        time: form.time,
        address: station?.address_components,
      });
      toast.success('Slot booked successfully!');
      setTimeout(() => navigate('/mybookings'), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Sidebar>
      <Toast toasts={toasts} />

      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate('/chargestation')}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Stations
        </button>

        {/* Station info */}
        {station && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-slate-800">{station.name}</p>
                <p className="text-sm text-slate-500">
                  {[station.address_components?.street_address, station.address_components?.city]
                    .filter(Boolean).join(', ')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h1 className="text-xl font-bold text-slate-900 mb-6">Book a Charging Slot</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                name="phno"
                value={form.phno}
                onChange={handleChange}
                required
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm
                  focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                  placeholder:text-slate-400 transition"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Select Date
              </label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                min={today}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm
                  focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              />
            </div>

            {/* Time slots */}
            {form.date && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Select Time Slot
                  {loadingSlots && (
                    <span className="ml-2 text-emerald-600 font-normal">
                      Loading availability...
                    </span>
                  )}
                </label>
                {!loadingSlots && (
                  <SlotPicker
                    bookedSlots={bookedSlots}
                    selectedSlot={form.time}
                    onSelect={(slot) => setForm((prev) => ({ ...prev, time: slot }))}
                    date={form.date}
                  />
                )}
                {loadingSlots && (
                  <div className="flex justify-center py-8">
                    <div className="w-6 h-6 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
            )}

            {/* Summary */}
            {form.date && form.time && (
              <div className="bg-slate-50 rounded-xl p-4 text-sm space-y-1.5">
                <p className="font-medium text-slate-700">Booking Summary</p>
                <p className="text-slate-500">📍 {station?.name || 'Station'}</p>
                <p className="text-slate-500">📅 {form.date}</p>
                <p className="text-slate-500">🕐 {form.time}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !form.time}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300
                text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {submitting && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {submitting ? 'Booking...' : 'Confirm Booking'}
            </button>
          </form>
        </div>
      </div>
    </Sidebar>
  );
};

export default BookSlot;