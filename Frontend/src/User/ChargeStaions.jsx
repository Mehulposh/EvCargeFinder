import React, { useEffect, useState, useCallback } from 'react';
import { GoogleMap, MarkerF, InfoWindowF, useJsApiLoader } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import api from '../api/api';

const MAP_STYLE = { width: '100%', height: '100%' };
const DEFAULT_CENTER = { lat: 20.5937, lng: 78.9629 };
const LIBRARIES = ['places'];

const ChargeStaions = () => {
  const [stations, setStations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const navigate = useNavigate();

  // Load Google Maps script once, won't reload on re-render
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: LIBRARIES,
  });

  useEffect(() => {
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
        setDataLoading(false);
      }
    };
    fetchStations();
  }, []);

  const handleMarkerClick = useCallback((station) => {
    setSelected(station);
  }, []);

  const mapCenter = userLocation || DEFAULT_CENTER;
  const loading = dataLoading || !isLoaded;

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

            {selected && (
              <InfoWindowF
                position={{ lat: selected.latitude, lng: selected.longitude }}
                onCloseClick={() => setSelected(null)}
              >
                <div style={{ padding: '8px', minWidth: '200px', fontFamily: 'sans-serif' }}>
                  <h3 style={{ fontWeight: '600', color: '#1e293b', fontSize: '14px', marginBottom: '4px' }}>
                    {selected.name}
                  </h3>
                  {selected.address_components && (
                    <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                      {[selected.address_components.street_address,
                        selected.address_components.city,
                        selected.address_components.state,
                      ].filter(Boolean).join(', ')}
                    </p>
                  )}
                  {selected.phone_number && (
                    <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                      📞 {selected.phone_number}
                    </p>
                  )}
                  {selected.opening_hours && (
                    <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                      🕐 {selected.opening_hours}
                    </p>
                  )}
                  {selected.rating > 0 && (
                    <p style={{ fontSize: '12px', color: '#d97706', marginBottom: '8px' }}>
                      ⭐ {selected.rating} ({selected.review_count} reviews)
                    </p>
                  )}
                  <button
                    onClick={() => navigate(`/bookslot/${selected._id}`, { state: { station: selected } })}
                    style={{
                      width: '100%', marginTop: '4px', padding: '6px 12px',
                      backgroundColor: '#059669', color: 'white', fontSize: '12px',
                      fontWeight: '600', borderRadius: '8px', border: 'none', cursor: 'pointer',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#047857'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                  >
                    Book Slot
                  </button>
                </div>
              </InfoWindowF>
            )}
          </GoogleMap>
        )}
      </div>

      {/* Station list */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stations.map((station) => (
          <div
            key={station._id}
            onClick={() => { setSelected(station); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            style={{
              backgroundColor: 'white', borderRadius: '12px',
              border: '1px solid #e2e8f0', padding: '16px', cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <div style={{
                width: '32px', height: '32px', backgroundColor: '#d1fae5',
                borderRadius: '8px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', flexShrink: 0,
              }}>
                <svg style={{ width: '16px', height: '16px', color: '#059669' }}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: '500', color: '#1e293b', fontSize: '14px',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {station.name}
                </p>
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  {station.address_components?.city || 'Location unavailable'}
                </p>
              </div>
              {station.rating > 0 && (
                <span style={{
                  fontSize: '12px', fontWeight: '500', color: '#d97706',
                  backgroundColor: '#fffbeb', padding: '2px 8px',
                  borderRadius: '9999px', flexShrink: 0,
                }}>
                  ⭐ {station.rating}
                </span>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/bookslot/${station._id}`, { state: { station } });
              }}
              style={{
                marginTop: '12px', width: '100%', padding: '6px 0',
                backgroundColor: '#059669', color: 'white', fontSize: '12px',
                fontWeight: '600', borderRadius: '8px', border: 'none', cursor: 'pointer',
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#047857'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#059669'}
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