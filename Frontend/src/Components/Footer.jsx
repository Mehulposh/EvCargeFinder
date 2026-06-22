import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg">EV Charge</span>
          </div>

          {/* Tagline */}
          <p className="text-sm text-center text-slate-400 max-w-md">
            Plug in, Power Up — Your Ultimate EV Charge Finder Companion
          </p>

          {/* Contact */}
          <div className="text-sm text-center">
            <p className="text-slate-300">📞 127-865-586-67</p>
            <p className="mt-1">© {new Date().getFullYear()} EV Charge. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;