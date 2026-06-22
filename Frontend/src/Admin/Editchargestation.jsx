import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import Toast, { useToast } from '../Components/Toast';
import api from '../api/api';

const Editchargestation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toasts, toast } = useToast();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/admin/chargestation/${id}`);
        setForm({
          name: data.name || '',
          latitude: data.latitude || '',
          longitude: data.longitude || '',
          phone_number: data.phone_number || '',
          opening_hours: data.opening_hours || '',
          rating: data.rating || '',
          review_count: data.review_count || '',
          address_components: {
            street_address: data.address_components?.street_address || '',
            district: data.address_components?.district || '',
            city: data.address_components?.city || '',
            state: data.address_components?.state || '',
            country: data.address_components?.country || '',
            zipcode: data.address_components?.zipcode || '',
          },
        });
      } catch (err) {
        toast.error('Failed to load station data.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      address_components: { ...prev.address_components, [name]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/admin/chargestation/${id}`, {
        ...form,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        rating: form.rating ? parseFloat(form.rating) : 0,
        review_count: form.review_count ? parseInt(form.review_count) : 0,
      });
      toast.success('Station updated!');
      setTimeout(() => navigate('/achargepoints'), 800);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update station.');
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-400 transition";
  const labelCls = "block text-sm font-medium text-slate-700 mb-1.5";

  return (
    <AdminLayout>
      <Toast toasts={toasts} />

      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate('/achargepoints')}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Charge Points
        </button>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
          <h1 className="text-xl font-bold text-slate-900 mb-6">Edit Charging Station</h1>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className={labelCls}>Station Name *</label>
                <input type="text" name="name" value={form.name} onChange={handleChange}
                  required className={inputCls} />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-700 mb-3">Location Coordinates *</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Latitude</label>
                    <input type="number" name="latitude" value={form.latitude} onChange={handleChange}
                      required step="any" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Longitude</label>
                    <input type="number" name="longitude" value={form.longitude} onChange={handleChange}
                      required step="any" className={inputCls} />
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-700 mb-3">Address</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Street Address</label>
                    <input type="text" name="street_address" value={form.address_components.street_address}
                      onChange={handleAddressChange} className={inputCls} />
                  </div>
                  {['district', 'city', 'state', 'country', 'zipcode'].map((field) => (
                    <div key={field}>
                      <label className={labelCls}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                      <input type="text" name={field} value={form.address_components[field]}
                        onChange={handleAddressChange} className={inputCls} />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-700 mb-3">Station Details</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Phone Number</label>
                    <input type="tel" name="phone_number" value={form.phone_number}
                      onChange={handleChange} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Opening Hours</label>
                    <input type="text" name="opening_hours" value={form.opening_hours}
                      onChange={handleChange} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Rating (0–5)</label>
                    <input type="number" name="rating" value={form.rating}
                      onChange={handleChange} min="0" max="5" step="0.1" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Review Count</label>
                    <input type="number" name="review_count" value={form.review_count}
                      onChange={handleChange} min="0" className={inputCls} />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => navigate('/achargepoints')}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors text-sm">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400
                    text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
                  {saving && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Editchargestation;