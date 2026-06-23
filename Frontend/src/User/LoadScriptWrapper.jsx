import React from 'react';
import { LoadScript } from '@react-google-maps/api';

const LIBRARIES = ['places'];
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

const LoadScriptWrapper = ({ children }) => (
  <LoadScript googleMapsApiKey={API_KEY} libraries={LIBRARIES}>
    {children}
  </LoadScript>
);

export default LoadScriptWrapper;