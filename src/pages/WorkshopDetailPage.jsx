import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useWorkshops } from '../context/WorkshopContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  Award, 
  BookOpen, 
  ShieldCheck,
  Share2,
  Sparkles
} from 'lucide-react';

export default function WorkshopDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getWorkshopById, loading } = useWorkshops();
  const [copySuccess, setCopySuccess] = useState(false);
  const [imgError, setImgError] = useState(false);

  const workshop = getWorkshopById(id);

  if (!workshop && !loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Workshop Not Found</h2>
        <p className="text-gray-600 text-sm max-w-md mb-6">
          The workshop session you are looking for may have concluded or the link is incorrect.
        </p>
        <Link to="/workshops" className="btn-primary text-sm">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Workshops
        </Link>
      </div>
    );
  }

  if (loading || !workshop) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#16834A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { title, category, description, date, time, venue, total_seats, image_url, registeredCount, availableSeats, isFull } = workshop;

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    }
  };

  const defaultPlaceholder = 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80';
  const seatsRatio = Math.min(100, Math.round(((total_seats - availableSeats) / total_seats) * 100));

  return (
    <div className="min-h-screen bg-[#F7FAF8] py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/workshops"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#16834A] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Workshops</span>
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-[#16834A] bg-white px-3 py-1.5 rounded-lg border border-gray-200 transition shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copySuccess ? 'Link Copied!' : 'Share Workshop'}</span>
          </button>
        </div>

        {/* Main Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Workshop Information */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Hero Image & Badge */}
            <div className="relative rounded-3xl overflow-hidden bg-gray-100 shadow-md h-72 sm:h-96">
              <img
                src={imgError ? defaultPlaceholder : (image_url || defaultPlaceholder)}
                alt={title}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              
              <div className="absolute top-4 left-4">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide bg-white/95 text-gray-900 shadow-md">
                  {category}
                </span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight mb-2">
                  {title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-200 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-300" /> {formatDate(date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-300" /> {time}
                  </span>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="card-base p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#16834A]" />
                  About This Workshop
                </h2>
                <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
                  {description}
                </p>
              </div>

              {/* What You Will Receive */}
              <div className="pt-6 border-t border-gray-100">
                <h3 className="font-bold text-gray-900 text-base mb-4">
                  What is Included for Every Participant
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#EAF7EF]/60 text-[#105C35]">
                    <CheckCircle2 className="w-5 h-5 text-[#16834A] shrink-0" />
                    <span>Hands-on practice with provided equipment</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#EAF7EF]/60 text-[#105C35]">
                    <Award className="w-5 h-5 text-[#16834A] shrink-0" />
                    <span>Official Community Certificate of Completion</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#EAF7EF]/60 text-[#105C35]">
                    <Sparkles className="w-5 h-5 text-[#16834A] shrink-0" />
                    <span>Printed learning booklet in local language</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#EAF7EF]/60 text-[#105C35]">
                    <ShieldCheck className="w-5 h-5 text-[#16834A] shrink-0" />
                    <span>100% Free of charge sponsored program</span>
                  </div>
                </div>
              </div>

              {/* Venue & Location details */}
              <div className="pt-6 border-t border-gray-100">
                <h3 className="font-bold text-gray-900 text-base mb-2 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#16834A]" />
                  Workshop Venue & Location
                </h3>
                <p className="text-gray-700 text-sm font-medium">
                  {venue}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Please arrive 15 minutes before scheduled start time for attendance roll-call.
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Registration Card / Sticky Sidebar */}
          <div className="lg:col-span-4">
            <div className="card-base p-6 sticky top-24 space-y-6">
              
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Registration Status</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-3xl font-extrabold text-gray-900">
                    {isFull ? '0' : availableSeats}
                  </span>
                  <span className="text-sm font-medium text-gray-500">
                    of {total_seats} seats remaining
                  </span>
                </div>
              </div>

              {/* Capacity Progress Bar */}
              <div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isFull ? 'bg-red-500' : seatsRatio > 80 ? 'bg-amber-500' : 'bg-[#16834A]'
                    }`}
                    style={{ width: `${seatsRatio}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500 mt-2 font-medium">
                  <span>{registeredCount} Registered</span>
                  <span>{seatsRatio}% Capacity</span>
                </div>
              </div>

              {/* Key Summary Table */}
              <div className="space-y-3 pt-4 border-t border-gray-100 text-xs">
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-500">Workshop Date</span>
                  <span className="font-semibold text-gray-800">{formatDate(date)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-500">Session Hours</span>
                  <span className="font-semibold text-gray-800">{time}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-500">Target Audience</span>
                  <span className="font-semibold text-gray-800">All Community Members</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-500">Registration Fee</span>
                  <span className="font-bold text-[#16834A] bg-[#EAF7EF] px-2 py-0.5 rounded">FREE</span>
                </div>
              </div>

              {/* Action Button */}
              {isFull ? (
                <div className="space-y-2">
                  <button
                    disabled
                    className="w-full bg-gray-200 text-gray-500 font-bold py-3.5 px-4 rounded-xl cursor-not-allowed text-center text-sm"
                  >
                    Workshop Fully Booked
                  </button>
                  <p className="text-center text-xs text-red-600 font-medium">
                    All seats have been reserved. Please check other upcoming sessions.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to={`/register?workshopId=${workshop.id}`}
                    className="btn-primary w-full text-center py-3.5 text-sm font-bold shadow-lg shadow-[#16834A]/20"
                  >
                    Register for This Workshop
                  </Link>
                  <p className="text-center text-[11px] text-gray-500">
                    Takes only 1 minute • Instant pass generation
                  </p>
                </div>
              )}

              {/* Community Guarantee */}
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/70 text-xs text-gray-600 space-y-1">
                <p className="font-semibold text-gray-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#16834A]" /> Guaranteed Seat
                </p>
                <p className="text-[11px] leading-relaxed">
                  Upon registration, your seat is locked immediately in the system.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
