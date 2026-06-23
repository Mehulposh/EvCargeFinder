import React, { useEffect, useState, useCallback } from 'react';
import { GoogleMap, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import api from '../api/api';

const MAP_STYLE = { width: '100%', height: '100%' };

const DEFAULT_CENTER = { lat: 20.5937, lng: 78.9629 }; // India center

const ChargeStaions = () => {
  const [stations, setStations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation(DEFAULT_CENTER)
      );
    }

    const fetchStations = async () => {
      try {
        const { data } = await api.get('/user/chargestations');
        setStations(data);
      } catch (err) {
        console.error('Error fetching stations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStations();
  }, []);

  const handleMarkerClick = useCallback((station) => {
    setSelected(station);
  }, []);

  const mapCenter = userLocation || DEFAULT_CENTER;

  return (
    <Sidebar>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Charging Stations</h1>
        <p className="text-slate-500 text-sm mt-1">
          {loading ? 'Loading stations...' : `${stations.length} stations found near you`}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden" style={{ height: '70vh' }}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-500 text-sm">Loading map...</p>
            </div>
          </div>
        ) : (
          <GoogleMap
            mapContainerStyle={MAP_STYLE}
            center={mapCenter}
            zoom={userLocation ? 12 : 5}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
          >
            {/* User location marker */}
            {userLocation && (
              <MarkerF
                position={userLocation}
                icon={{
                  path: window.google?.maps?.SymbolPath?.CIRCLE,
                  scale: 8,
                  fillColor: '#2563eb',
                  fillOpacity: 1,
                  strokeColor: '#fff',
                  strokeWeight: 2,
                }}
              />
            )}

            {/* Station markers */}
            {stations.map((station) => (
              <MarkerF
                key={station._id}
                position={{ lat: station.latitude, lng: station.longitude }}
                onClick={() => handleMarkerClick(station)}
                icon={{
                  path: window.google?.maps?.SymbolPath?.BACKWARD_CLOSED_ARROW,
                  scale: 6,
                  fillColor: '#059669',
                  fillOpacity: 1,
                  strokeColor: '#fff',
                  strokeWeight: 1.5,
                }}
              />
            ))}

            {/* Info window */}
            {selected && (
              <InfoWindowF
                position={{ lat: selected.latitude, lng: selected.longitude }}
                onCloseClick={() => setSelected(null)}
              >
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-semibold text-slate-800 text-sm mb-1">{selected.name}</h3>
                  {selected.address_components && (
                    <p className="text-xs text-slate-500 mb-1">
                      {[
                        selected.address_components.street_address,
                        selected.address_components.city,
                        selected.address_components.state,
                      ].filter(Boolean).join(', ')}
                    </p>
                  )}
                  {selected.phone_number && (
                    <p className="text-xs text-slate-500 mb-1">📞 {selected.phone_number}</p>
                  )}
                  {selected.opening_hours && (
                    <p className="text-xs text-slate-500 mb-2">🕐 {selected.opening_hours}</p>
                  )}
                  {selected.rating > 0 && (
                    <p className="text-xs text-amber-600 mb-2">⭐ {selected.rating} ({selected.review_count} reviews)</p>
                  )}
                  <button
                    onClick={() => navigate(`/bookslot/${selected._id}`, { state: { station: selected } })}
                    className="w-full mt-1 px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold
                      rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Book Slot
                  </button>
                </div>
              </InfoWindowF>
            )}
          </GoogleMap>
        )}
      </div>

      {/* Station list below map */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stations.map((station) => (
          <div
            key={station._id}
            className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => {
              setSelected(station);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 text-sm truncate">{station.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {station.address_components?.city || 'Location unavailable'}
                </p>
              </div>
              {station.rating > 0 && (
                <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full flex-shrink-0">
                  ⭐ {station.rating}
                </span>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/bookslot/${station._id}`, { state: { station } });
              }}
              className="mt-3 w-full py-1.5 bg-emerald-700 text-white text-xs font-semibold
                rounded-lg hover:bg-emerald-100 hover:text-slate-500 transition-colors"
            >
              Book Slot
            </button>
          </div>
        ))}
      </div>
    </Sidebar>
  );
};

export default ChargeStaions;