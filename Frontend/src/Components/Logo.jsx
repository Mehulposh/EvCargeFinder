import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Logo component
 * @param {'sm' | 'md' | 'lg'} size - sm: small icon only hint, md: default, lg: large
 * @param {boolean} withText - show "EV Charge" text next to icon (default true)
 * @param {string} to - link destination (default "/")
 * @param {'light' | 'dark'} variant - light = white text (for dark backgrounds), dark = slate text (default)
 */
const Logo = ({ size = 'md', withText = true, to = '/', variant = 'dark' }) => {
  const sizes = {
    sm: { box: 'w-6 h-6', icon: 'w-3.5 h-3.5', text: 'text-sm' },
    md: { box: 'w-8 h-8', icon: 'w-5 h-5',   text: 'text-lg' },
    lg: { box: 'w-12 h-12', icon: 'w-7 h-7', text: 'text-2xl' },
  };

  const textColor = variant === 'light' ? 'text-white' : 'text-slate-800';
  const { box, icon, text } = sizes[size];

  return (
    <Link to={to} className="flex items-center gap-2 select-none">
      <div className={`${box} bg-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0`}>
        <svg className={`${icon} text-white`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      {withText && (
        <span className={`font-bold ${text} ${textColor}`}>EV Charge</span>
      )}
    </Link>
  );
};

export default Logo;