import React from 'react';
import Sidebar from './Sidebar';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Basic',
    price: '₹5',
    unit: 'per kWh',
    color: 'border-slate-200',
    badge: null,
    features: [
      'Access to all public stations',
      'Standard charging speed',
      'Basic booking (1 slot/day)',
      'Email support',
    ],
  },
  {
    name: 'Standard',
    price: '₹8',
    unit: 'per kWh',
    color: 'border-emerald-500',
    badge: 'Most Popular',
    features: [
      'Everything in Basic',
      'Fast charging stations',
      'Up to 3 bookings/day',
      'Priority support',
      'Booking history & QR pass',
    ],
  },
  {
    name: 'Premium',
    price: '₹12',
    unit: 'per kWh',
    color: 'border-purple-500',
    badge: 'Best Value',
    features: [
      'Everything in Standard',
      'Ultra-fast charging',
      'Unlimited bookings',
      '24/7 dedicated support',
      'Reserved parking slot',
      'Monthly usage report',
    ],
  },
];

const Pricing = () => {
  return (
    <Sidebar>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Pricing Plans</h1>
        <p className="text-slate-500 mt-2 text-sm">
          Simple, transparent pricing. No hidden fees.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative bg-white rounded-2xl border-2 p-6 flex flex-col
              ${plan.badge === 'Most Popular' ? 'shadow-lg' : 'shadow-sm'} ${plan.color}`}
          >
            {plan.badge && (
              <span className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold px-3 py-1 rounded-full
                ${plan.badge === 'Most Popular'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-purple-600 text-white'}`}>
                {plan.badge}
              </span>
            )}

            <div className="mb-6">
              <p className="font-semibold text-slate-800 text-lg">{plan.name}</p>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-bold text-slate-900">{plan.price}</span>
                <span className="text-slate-500 text-sm">{plan.unit}</span>
              </div>
            </div>

            <ul className="space-y-3 flex-1 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <svg className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            <Link
              to="/chargestation"
              className={`block text-center py-2.5 rounded-xl font-semibold text-sm transition-colors
                ${plan.badge === 'Most Popular'
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : plan.badge === 'Best Value'
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              Get Started
            </Link>
          </div>
        ))}
      </div>

      {/* Info note */}
      <p className="text-center text-xs text-slate-400 mt-8">
        * Pricing is per session. Final cost depends on your vehicle's battery capacity and charging duration.
      </p>
    </Sidebar>
  );
};

export default Pricing;