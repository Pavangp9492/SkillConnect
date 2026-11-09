import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function WorkshopCard({ workshop, availableSeats, registeredCount, isFull }) {
  const [imgError, setImgError] = useState(false);

  // Format human-friendly date (e.g. Saturday, 28 Nov 2026)
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Category color mapper
  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'technology':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'digital literacy':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'vocational skills':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'healthcare':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'agriculture':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'business':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-[#EAF7EF] text-[#105C35] border-green-200';
    }
  };

  const defaultPlaceholder = 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80';

  const seatsRatio = workshop.total_seats > 0 
    ? Math.min(100, Math.round(((workshop.total_seats - availableSeats) / workshop.total_seats) * 100))
    : 0;

  return (
    <div className="card-base flex flex-col h-full overflow-hidden group hover:translate-y-[-2px] transition-all duration-200">
      {/* Image Header */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <img
          src={imgError ? defaultPlaceholder : (workshop.image_url || defaultPlaceholder)}
          alt={workshop.title}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        
        {/* Category Pill */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide border shadow-xs bg-white/95 backdrop-blur-xs text-gray-800`}>
            {workshop.category}
          </span>
        </div>

        {/* Seat Availability Status Pill */}
        <div className="absolute top-3 right-3">
          {isFull ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-600 text-white shadow-xs flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> Fully Booked
            </span>
          ) : availableSeats <= 5 ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500 text-white shadow-xs animate-pulse">
              Only {availableSeats} left!
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#16834A] text-white shadow-xs flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {availableSeats} seats open
            </span>
          )}
        </div>

        {/* Total seats info bar on bottom of image */}
        <div className="absolute bottom-2 left-3 text-white text-xs flex items-center gap-1 font-medium">
          <Users className="w-3.5 h-3.5 text-emerald-300" />
          <span>{registeredCount} / {workshop.total_seats} registered</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-gray-900 text-lg leading-snug line-clamp-2 group-hover:text-[#16834A] transition-colors mb-2">
            {workshop.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
            {workshop.description}
          </p>

          {/* Logistics Details */}
          <div className="space-y-2 text-xs text-gray-600 mb-4 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#16834A] shrink-0" />
              <span className="font-medium text-gray-800">{formatDate(workshop.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#16834A] shrink-0" />
              <span>{workshop.time}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#16834A] shrink-0 mt-0.5" />
              <span className="line-clamp-1">{workshop.venue}</span>
            </div>
          </div>
        </div>

        {/* Card Actions */}
        <div className="pt-3 border-t border-gray-100">
          {/* Seat Capacity Progress */}
          <div className="mb-3">
            <div className="flex justify-between text-[11px] text-gray-500 font-medium mb-1">
              <span>Registration Capacity</span>
              <span>{seatsRatio}% Full</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  isFull ? 'bg-red-500' : seatsRatio > 80 ? 'bg-amber-500' : 'bg-[#16834A]'
                }`}
                style={{ width: `${seatsRatio}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/workshops/${workshop.id}`}
              className="btn-outline flex-1 text-xs py-2 text-center"
            >
              Details
            </Link>

            {isFull ? (
              <button
                disabled
                className="flex-1 bg-gray-100 text-gray-400 font-medium text-xs py-2 px-3 rounded-lg cursor-not-allowed text-center"
              >
                Closed
              </button>
            ) : (
              <Link
                to={`/register?workshopId=${workshop.id}`}
                className="btn-primary flex-1 text-xs py-2 text-center"
              >
                Register
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
