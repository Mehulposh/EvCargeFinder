import React from 'react';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <Logo size="md" variant="light" to="/"/>

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