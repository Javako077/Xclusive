import React, { useState } from 'react';
import { CLASSES_DATA } from '../data/gymData';
import { Clock, Flame, Users, Calendar, MapPin, Play, Check, X, Sparkles } from 'lucide-react';

export const ClassesAndSchedule = ({ onOpenVideo }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDay, setSelectedDay] = useState('Mon');
  const [bookingClass, setBookingClass] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const [formData, setFormData] = useState({
    className: '',
    date: '2026-07-27',
    time: '07:00 AM',
    name: '',
    email: '',
    phone: '',
  });

  const categories = ['All', 'Strength', 'HIIT', 'Boxing', 'Mind & Body', 'Cardio', 'Recovery'];
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const filteredClasses = CLASSES_DATA.filter((item) => {
    const categoryMatch = selectedCategory === 'All' || item.category === selectedCategory;
    const dayMatch = item.days.includes(selectedDay);
    return categoryMatch && dayMatch;
  });

  const handleOpenBooking = (cls) => {
    setBookingClass(cls);
    setFormData((prev) => ({
      ...prev,
      className: cls.name,
      time: cls.time,
    }));
    setBookingSuccess(false);
  };

  const handleSubmitBooking = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setBookingSuccess(true);
  };

  return (
    <section id="classes" className="py-24 bg-black text-white relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-block mb-3">
            <span className="text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase border-l-2 border-[#D4AF37] pl-3 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Timetable & Classes
            </span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black italic tracking-tighter uppercase mb-4">
            HIGH-OCTANE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F5D77F] to-[#C5A059]">SCHEDULE.</span>
          </h2>
          <p className="text-white/50 text-base sm:text-lg font-light">
            Train in our specialized athletic pods. Reserve your spot online with live slot tracking.
          </p>
        </div>

        {/* Day Selector Bar */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {daysOfWeek.map((day) => {
            const isSelected = selectedDay === day;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-6 py-3 font-black text-xs uppercase tracking-widest transition-all duration-200 shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#C5A059] text-black shadow-lg shadow-[#D4AF37]/10 scale-105'
                    : 'bg-zinc-950 border border-white/10 text-white/50 hover:text-white hover:border-white/20'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#D4AF37]/10 border border-[#D4AF37] text-[#D4AF37]'
                    : 'bg-zinc-950/60 border border-white/5 text-white/40 hover:text-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Classes Grid */}
        {filteredClasses.length === 0 ? (
          <div className="text-center py-16 bg-zinc-950 rounded-2xl border border-white/10">
            <p className="text-white/40 text-base">No classes scheduled for {selectedDay} in {selectedCategory}.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-zinc-900 text-[#D4AF37] text-xs font-bold cursor-pointer"
            >
              Show All Categories
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredClasses.map((cls) => {
              const spotsLeft = cls.maxSpots - cls.bookedSpots;
              return (
                <div
                  key={cls.id}
                  className="bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col group shadow-2xl"
                >
                  {/* Class Image / Video Preview Trigger */}
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={cls.image}
                      alt={cls.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-[#D4AF37] border border-white/10">
                      {cls.category}
                    </div>

                    {/* Play Video Preview Button */}
                    <button
                      onClick={() => onOpenVideo(cls.videoUrl, cls.name)}
                      className="absolute top-3 right-3 p-2.5 rounded-full bg-black/80 backdrop-blur-md text-white hover:text-[#D4AF37] hover:scale-110 transition-all cursor-pointer border border-white/10"
                      title="Watch Class Preview Video"
                    >
                      <Play className="w-4 h-4 fill-white hover:fill-[#D4AF37]" />
                    </button>

                    {/* Intensity & Time Badges */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-semibold text-white/80">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#D4AF37]" /> {cls.time} ({cls.durationMinutes} min)
                      </span>
                      <span className="flex items-center gap-1 text-[#D4AF37] font-bold">
                        <Flame className="w-3.5 h-3.5" /> {cls.caloriesBurned} kcal
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-xl font-black italic uppercase text-white mb-2 group-hover:text-[#D4AF37] transition-colors">
                        {cls.name}
                      </h3>
                      <p className="text-xs text-white/50 line-clamp-2 leading-relaxed">
                        {cls.description}
                      </p>
                    </div>

                    {/* Location & Trainer Info */}
                    <div className="pt-3 border-t border-white/10 space-y-2">
                      <div className="flex items-center justify-between text-xs text-white/70">
                        <div className="flex items-center gap-2">
                          <img
                            src={cls.trainerAvatar}
                            alt={cls.trainer}
                            referrerPolicy="no-referrer"
                            className="w-6 h-6 rounded-full object-cover border border-white/10"
                          />
                          <span className="font-medium text-white/90">{cls.trainer}</span>
                        </div>
                        <span className="text-white/40 text-[11px] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-white/30" /> {cls.location}
                        </span>
                      </div>

                      {/* Spots Tracker Bar */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-white/40">
                          <span>Capacity</span>
                          <span className={spotsLeft <= 3 ? 'text-rose-400 font-bold' : 'text-white/70'}>
                            {spotsLeft} spots remaining
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-black overflow-hidden">
                          <div
                            className="h-full bg-[#D4AF37] rounded-full"
                            style={{ width: `${(cls.bookedSpots / cls.maxSpots) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Book Button */}
                    <button
                      onClick={() => handleOpenBooking(cls)}
                      className="w-full py-3 rounded-none bg-white/5 border border-white/10 text-[#D4AF37] font-black text-xs hover:bg-gradient-to-r hover:from-[#D4AF37] hover:to-[#C5A059] hover:text-black transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-widest"
                    >
                      <Users className="w-4 h-4" /> Reserve {selectedDay}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {bookingClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-950 border border-white/10 rounded-2xl max-w-md w-full p-6 relative shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setBookingClass(null)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-zinc-900 text-white/40 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {!bookingSuccess ? (
              <form onSubmit={handleSubmitBooking} className="space-y-4">
                <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" /> Fast Class Reservation
                </div>
                <h3 className="text-xl font-bold text-white">Reserve {bookingClass.name}</h3>
                <p className="text-xs text-white/40">
                  {bookingClass.time} | {selectedDay} | Trainer: {bookingClass.trainer}
                </p>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="alex@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 019-2834"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F5D77F] to-[#C5A059] text-black font-bold text-sm uppercase tracking-wider hover:opacity-90 shadow-lg shadow-[#D4AF37]/20 transition-all cursor-pointer mt-4"
                >
                  Confirm Reservation
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Spot Reserved!</h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  We sent a confirmation pass to <span className="text-[#D4AF37] font-semibold">{formData.email}</span>. See you on {selectedDay} at {bookingClass.time}!
                </p>
                <button
                  onClick={() => setBookingClass(null)}
                  className="px-6 py-2.5 rounded-xl bg-zinc-800 text-white font-bold text-xs hover:bg-zinc-700 cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
