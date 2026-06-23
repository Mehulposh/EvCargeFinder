import React from 'react';

// All available time slots throughout the day
const ALL_SLOTS = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
  '19:00', '20:00', '21:00',
];

const SlotPicker = ({ bookedSlots = [], selectedSlot, onSelect, date }) => {
  const today = new Date().toISOString().split('T')[0];
  const currentHour = new Date().getHours();

  const isPast = (slot) => {
    if (!date || date > today) return false;
    if (date < today) return true;
    // Today: slots in the past
    const slotHour = parseInt(slot.split(':')[0]);
    return slotHour <= currentHour;
  };

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {ALL_SLOTS.map((slot) => {
          const booked = bookedSlots.includes(slot);
          const past = isPast(slot);
          const selected = selectedSlot === slot;
          const disabled = booked || past;

          return (
            <button
              key={slot}
              type="button"
              disabled={disabled}
              onClick={() => !disabled && onSelect(slot)}
              className={`py-2 px-3 rounded-xl text-sm font-medium border transition-all
                ${selected
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                  : booked
                  ? 'bg-red-50 text-red-400 border-red-200 cursor-not-allowed line-through'
                  : past
                  ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 cursor-pointer'
                }`}
            >
              {slot}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-white border border-slate-300 inline-block" />
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-emerald-600 inline-block" />
          Selected
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-red-100 border border-red-200 inline-block" />
          Booked
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-slate-100 inline-block" />
          Past
        </span>
      </div>
    </div>
  );
};

export default SlotPicker;