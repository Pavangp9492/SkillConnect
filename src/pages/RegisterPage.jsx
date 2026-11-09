import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useWorkshops } from '../context/WorkshopContext';
import { 
  CheckCircle, 
  AlertCircle, 
  Calendar, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Printer, 
  Sparkles, 
  Compass, 
  User, 
  Mail, 
  Phone, 
  Hash, 
  Home,
  CheckCircle2,
  Ticket
} from 'lucide-react';

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { workshops, registerParticipant, getWorkshopStats, loading: workshopsLoading } = useWorkshops();

  const preselectedId = searchParams.get('workshopId') || '';

  // Form states
  const [selectedWorkshopId, setSelectedWorkshopId] = useState(preselectedId);
  const [formData, setFormData] = useState({
    participantName: '',
    email: '',
    phone: '',
    age: '',
    village: '',
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [successRegistration, setSuccessRegistration] = useState(null);

  // Update selected workshop if param changes
  useEffect(() => {
    if (preselectedId) {
      setSelectedWorkshopId(preselectedId);
    } else if (workshops.length > 0 && !selectedWorkshopId) {
      // Find first available workshop
      const available = workshops.find(w => {
        const stats = getWorkshopStats(w.id, w.total_seats);
        return !stats.isFull;
      });
      if (available) {
        setSelectedWorkshopId(available.id);
      } else if (workshops[0]) {
        setSelectedWorkshopId(workshops[0].id);
      }
    }
  }, [preselectedId, workshops, selectedWorkshopId, getWorkshopStats]);

  // Selected workshop details & stats
  const activeWorkshop = workshops.find(w => String(w.id) === String(selectedWorkshopId));
  const activeStats = activeWorkshop ? getWorkshopStats(activeWorkshop.id, activeWorkshop.total_seats) : null;

  // Validation function
  const validate = (data = formData, workshopId = selectedWorkshopId) => {
    const newErrors = {};

    if (!workshopId) {
      newErrors.workshopId = 'Please select a workshop.';
    }

    if (!data.participantName?.trim()) {
      newErrors.participantName = 'Full Name is required.';
    } else if (data.participantName.trim().length < 3) {
      newErrors.participantName = 'Name must be at least 3 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email?.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(data.email.trim())) {
      newErrors.email = 'Please enter a valid email address (e.g. name@example.com).';
    }

    const phoneRegex = /^\+?[0-9]{10,14}$/;
    const cleanPhone = data.phone?.replace(/[\s-]/g, '') || '';
    if (!data.phone?.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!phoneRegex.test(cleanPhone)) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number.';
    }

    const parsedAge = parseInt(data.age, 10);
    if (!data.age) {
      newErrors.age = 'Age is required.';
    } else if (isNaN(parsedAge) || parsedAge < 10 || parsedAge > 100) {
      newErrors.age = 'Age must be between 10 and 100 years.';
    }

    if (!data.village?.trim()) {
      newErrors.village = 'Village / Local Address is required.';
    } else if (data.village.trim().length < 2) {
      newErrors.village = 'Please enter your village, ward, or street name.';
    }

    return newErrors;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setServerError(null);

    // Clear field-specific error as user types
    if (errors[field]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const validationErrors = validate();
    if (validationErrors[field]) {
      setErrors(prev => ({ ...prev, [field]: validationErrors[field] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    // Mark all as touched
    setTouched({
      workshopId: true,
      participantName: true,
      email: true,
      phone: true,
      age: true,
      village: true,
    });

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    if (activeStats?.isFull) {
      setServerError('This workshop is currently fully booked. Please select another workshop.');
      return;
    }

    setSubmitting(true);
    try {
      const reg = await registerParticipant({
        workshopId: selectedWorkshopId,
        participantName: formData.participantName,
        email: formData.email,
        phone: formData.phone,
        age: formData.age,
        village: formData.village,
      });

      setSuccessRegistration({
        ...reg,
        workshop: activeWorkshop,
      });
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please check your details and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrintTicket = () => {
    window.print();
  };

  // If successfully registered, show confirmation pass / ticket
  if (successRegistration) {
    const { registration, workshop } = {
      registration: successRegistration,
      workshop: successRegistration.workshop || activeWorkshop,
    };

    return (
      <div className="min-h-screen bg-[#F7FAF8] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          
          {/* Success Banner */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#16834A] flex items-center justify-center mx-auto mb-4 shadow-sm animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Registration Confirmed!
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Your free seat has been officially reserved. Please keep this pass for workshop check-in.
            </p>
          </div>

          {/* Printable Ticket Pass */}
          <div className="card-base overflow-hidden border-2 border-emerald-500/40 shadow-xl bg-white mb-8 print:border-black print:shadow-none">
            
            {/* Ticket Header */}
            <div className="bg-gradient-to-r from-[#16834A] to-[#105C35] p-6 text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-200 uppercase tracking-widest">
                  Official Participant Pass
                </span>
                <h3 className="text-xl font-bold mt-1 text-white">SkillConnect Community</h3>
              </div>
              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-mono font-bold tracking-wider">
                  PASS #{registration.id?.slice(0, 8).toUpperCase() || 'SC-PASS'}
                </span>
              </div>
            </div>

            {/* Ticket Details */}
            <div className="p-6 sm:p-8 space-y-6">
              
              <div>
                <span className="text-xs text-gray-400 uppercase font-semibold">Registered Workshop</span>
                <h4 className="text-xl font-bold text-gray-900 mt-0.5">
                  {workshop?.title || 'Community Skill Workshop'}
                </h4>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EAF7EF] text-[#105C35]">
                  {workshop?.category || 'Community Training'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-y border-dashed border-gray-200">
                <div>
                  <span className="text-xs text-gray-500">Participant Name</span>
                  <p className="font-bold text-gray-900 text-base">{registration.participant_name}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Contact Email</span>
                  <p className="font-medium text-gray-800 text-sm">{registration.email}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Phone Number</span>
                  <p className="font-medium text-gray-800 text-sm">{registration.phone}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Age & Village / Ward</span>
                  <p className="font-medium text-gray-800 text-sm">{registration.age} years • {registration.village}</p>
                </div>
              </div>

              {/* Venue & Date Details */}
              <div className="space-y-2 text-sm text-gray-700 bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#16834A] shrink-0" />
                  <span className="font-semibold">{workshop?.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#16834A] shrink-0" />
                  <span>{workshop?.time}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#16834A] shrink-0 mt-0.5" />
                  <span>{workshop?.venue}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
                <span>Status: <strong className="text-emerald-700">Confirmed & Reserved</strong></span>
                <span>Attendance Code: <code className="bg-gray-100 px-2 py-0.5 rounded font-mono font-bold text-gray-800">{registration.id?.slice(-4).toUpperCase()}</code></span>
              </div>

            </div>

            {/* Ticket Footer Tear-off bar */}
            <div className="bg-emerald-50 px-6 py-3 border-t border-emerald-100 flex items-center justify-between text-xs text-[#105C35]">
              <span className="flex items-center gap-1.5 font-medium">
                <Sparkles className="w-4 h-4" /> Please show this pass at the entrance
              </span>
              <span className="font-semibold">Zero Fee Required</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 print:hidden">
            <button
              onClick={handlePrintTicket}
              className="btn-primary w-full sm:w-auto py-3 px-6 shadow-md"
            >
              <Printer className="w-4 h-4 mr-1.5" /> Print / Save Pass
            </button>
            <button
              onClick={() => {
                setSuccessRegistration(null);
                setFormData({
                  participantName: '',
                  email: '',
                  phone: '',
                  age: '',
                  village: '',
                });
                setTouched({});
                setErrors({});
              }}
              className="btn-secondary w-full sm:w-auto py-3 px-6"
            >
              Register Another Person
            </button>
            <Link
              to="/workshops"
              className="btn-outline w-full sm:w-auto py-3 px-6 text-center"
            >
              Back to Workshops
            </Link>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FAF8] py-10 sm:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#16834A] bg-[#EAF7EF] px-3.5 py-1 rounded-full">
            Free Community Registration
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mt-3">
            Register for a Workshop
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mt-2">
            Fill in your details below to secure your seat. Open to all community members, women self-help groups, farmers, and students.
          </p>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3 shadow-xs">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Registration Notice</p>
              <p className="text-xs sm:text-sm mt-0.5">{serverError}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Form */}
          <div className="lg:col-span-8 card-base p-6 sm:p-8">
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              
              {/* Workshop Selection */}
              <div>
                <label htmlFor="workshop-select" className="block text-sm font-semibold text-gray-900 mb-2">
                  Select Workshop <span className="text-red-500">*</span>
                </label>
                <select
                  id="workshop-select"
                  name="workshopId"
                  value={selectedWorkshopId}
                  onChange={(e) => {
                    setSelectedWorkshopId(e.target.value);
                    setServerError(null);
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#16834A] focus:ring-2 focus:ring-[#16834A]/20 text-sm text-gray-900 bg-white outline-none transition"
                  required
                >
                  <option value="" disabled>-- Choose a Workshop --</option>
                  {workshops.map((w) => {
                    const stats = getWorkshopStats(w.id, w.total_seats);
                    return (
                      <option key={w.id} value={w.id} disabled={stats.isFull}>
                        {w.title} ({w.category}) — {stats.isFull ? 'FULL' : `${stats.availableSeats} seats available`}
                      </option>
                    );
                  })}
                </select>
                {errors.workshopId && (
                  <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.workshopId}</p>
                )}
              </div>

              {/* Participant Name */}
              <div>
                <label htmlFor="participant-name" className="block text-sm font-semibold text-gray-900 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="participant-name"
                    name="participantName"
                    type="text"
                    autoComplete="name"
                    placeholder="e.g. Ramesh Kumar or Sunita Devi"
                    value={formData.participantName}
                    onChange={(e) => handleChange('participantName', e.target.value)}
                    onBlur={() => handleBlur('participantName')}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
                      touched.participantName && errors.participantName
                        ? 'border-red-500 focus:ring-red-200'
                        : 'border-gray-200 focus:border-[#16834A] focus:ring-[#16834A]/20'
                    } focus:ring-2 text-sm text-gray-900 outline-none transition`}
                    required
                  />
                </div>
                {touched.participantName && errors.participantName && (
                  <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.participantName}</p>
                )}
              </div>

              {/* Email and Phone (2 columns on tablet/desktop) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Email */}
                <div>
                  <label htmlFor="participant-email" className="block text-sm font-semibold text-gray-900 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="participant-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      autocorrect="off"
                      autocapitalize="off"
                      spellCheck="false"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      onBlur={() => handleBlur('email')}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
                        touched.email && errors.email
                          ? 'border-red-500 focus:ring-red-200'
                          : 'border-gray-200 focus:border-[#16834A] focus:ring-[#16834A]/20'
                      } focus:ring-2 text-sm text-gray-900 outline-none transition`}
                      required
                    />
                  </div>
                  {touched.email && errors.email && (
                    <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.email}</p>
                  )}
                  <p className="text-[11px] text-gray-500 mt-1">One registration per email for each workshop</p>
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="participant-phone" className="block text-sm font-semibold text-gray-900 mb-1.5">
                    Mobile Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      id="participant-phone"
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      onBlur={() => handleBlur('phone')}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
                        touched.phone && errors.phone
                          ? 'border-red-500 focus:ring-red-200'
                          : 'border-gray-200 focus:border-[#16834A] focus:ring-[#16834A]/20'
                      } focus:ring-2 text-sm text-gray-900 outline-none transition`}
                      required
                    />
                  </div>
                  {touched.phone && errors.phone && (
                    <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.phone}</p>
                  )}
                </div>

              </div>

              {/* Age and Village (2 columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Age */}
                <div>
                  <label htmlFor="participant-age" className="block text-sm font-semibold text-gray-900 mb-1.5">
                    Age (Years) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Hash className="w-4 h-4" />
                    </div>
                    <input
                      id="participant-age"
                      name="age"
                      type="number"
                      min="10"
                      max="100"
                      placeholder="e.g. 24"
                      value={formData.age}
                      onChange={(e) => handleChange('age', e.target.value)}
                      onBlur={() => handleBlur('age')}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
                        touched.age && errors.age
                          ? 'border-red-500 focus:ring-red-200'
                          : 'border-gray-200 focus:border-[#16834A] focus:ring-[#16834A]/20'
                      } focus:ring-2 text-sm text-gray-900 outline-none transition`}
                      required
                    />
                  </div>
                  {touched.age && errors.age && (
                    <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.age}</p>
                  )}
                </div>

                {/* Village / Address */}
                <div>
                  <label htmlFor="participant-village" className="block text-sm font-semibold text-gray-900 mb-1.5">
                    Village / Ward / Area <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Home className="w-4 h-4" />
                    </div>
                    <input
                      id="participant-village"
                      name="village"
                      type="text"
                      placeholder="e.g. Kothur Village or Rampur Ward 4"
                      value={formData.village}
                      onChange={(e) => handleChange('village', e.target.value)}
                      onBlur={() => handleBlur('village')}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
                        touched.village && errors.village
                          ? 'border-red-500 focus:ring-red-200'
                          : 'border-gray-200 focus:border-[#16834A] focus:ring-[#16834A]/20'
                      } focus:ring-2 text-sm text-gray-900 outline-none transition`}
                      required
                    />
                  </div>
                  {touched.village && errors.village && (
                    <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.village}</p>
                  )}
                </div>

              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting || activeStats?.isFull}
                  className={`btn-primary w-full py-3.5 text-base font-bold shadow-lg shadow-[#16834A]/25 ${
                    submitting || activeStats?.isFull ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {submitting ? (
                    <span>Confirming Registration...</span>
                  ) : activeStats?.isFull ? (
                    <span>Workshop Fully Booked</span>
                  ) : (
                    <span>Submit Free Registration</span>
                  )}
                </button>
                <p className="text-center text-xs text-gray-500 mt-2">
                  By submitting, you agree to attend the session promptly on the scheduled date.
                </p>
              </div>

            </form>
          </div>

          {/* Right Column: Workshop Quick Summary Card */}
          <div className="lg:col-span-4 space-y-4">
            {activeWorkshop ? (
              <div className="card-base p-6 border-l-4 border-l-[#16834A]">
                <span className="text-xs font-semibold text-[#16834A] uppercase tracking-wider">Selected Session</span>
                <h3 className="font-bold text-gray-900 text-lg mt-1 mb-2">
                  {activeWorkshop.title}
                </h3>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EAF7EF] text-[#105C35] mb-4">
                  {activeWorkshop.category}
                </span>

                <div className="space-y-2.5 text-xs text-gray-600 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#16834A] shrink-0" />
                    <span className="font-medium text-gray-800">{activeWorkshop.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#16834A] shrink-0" />
                    <span>{activeWorkshop.time}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#16834A] shrink-0 mt-0.5" />
                    <span>{activeWorkshop.venue}</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span>Remaining Seats</span>
                    <span className={activeStats?.isFull ? 'text-red-600' : 'text-[#16834A]'}>
                      {activeStats?.isFull ? 'Full (0 left)' : `${activeStats?.availableSeats} available`}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full ${activeStats?.isFull ? 'bg-red-500' : 'bg-[#16834A]'}`}
                      style={{
                        width: `${Math.min(100, Math.round(((activeWorkshop.total_seats - (activeStats?.availableSeats || 0)) / activeWorkshop.total_seats) * 100))}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="card-base p-6 text-center text-gray-500 text-sm">
                Please select a workshop from the dropdown to see location and schedule details.
              </div>
            )}

            <div className="p-4 rounded-xl bg-white border border-gray-200/80 shadow-xs space-y-2 text-xs text-gray-600">
              <p className="font-bold text-gray-800 flex items-center gap-1.5">
                <Ticket className="w-4 h-4 text-[#16834A]" /> Instant Pass
              </p>
              <p className="leading-relaxed">
                A digital pass with your unique registration code is generated immediately upon submission.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
