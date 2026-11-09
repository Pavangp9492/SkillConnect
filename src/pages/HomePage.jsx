import React from 'react';
import { Link } from 'react-router-dom';
import { useWorkshops } from '../context/WorkshopContext';
import WorkshopCard from '../components/WorkshopCard';
import { 
  Compass, 
  ArrowRight, 
  CheckCircle, 
  Users, 
  GraduationCap, 
  Sparkles, 
  Laptop, 
  Smartphone, 
  Scissors, 
  HeartPulse, 
  Sprout, 
  Briefcase,
  CalendarCheck,
  Award,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  MapPin
} from 'lucide-react';

export default function HomePage() {
  const { workshops, getWorkshopStats, loading } = useWorkshops();

  // Categories list with descriptions and icons
  const categories = [
    {
      name: 'Technology',
      icon: Laptop,
      desc: 'Computer basics, typing, Internet & office apps',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      name: 'Digital Literacy',
      icon: Smartphone,
      desc: 'Mobile banking, UPI, online schemes & safe browsing',
      color: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      name: 'Vocational Skills',
      icon: Scissors,
      desc: 'Tailoring, stitching, embroidery & handicraft skills',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      name: 'Healthcare',
      icon: HeartPulse,
      desc: 'First aid, emergency response, CPR & hygiene safety',
      color: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    {
      name: 'Agriculture',
      icon: Sprout,
      desc: 'Organic composting, soil testing & natural farming',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      name: 'Business',
      icon: Briefcase,
      desc: 'Village micro-enterprise, accounting & loan schemes',
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
  ];

  // Pick top 3-4 upcoming featured workshops
  const featuredWorkshops = workshops.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#EAF7EF]/70 via-white to-[#F7FAF8] pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF7EF] border border-[#16834A]/20 text-[#105C35] text-xs sm:text-sm font-semibold shadow-xs">
                <Sparkles className="w-4 h-4 text-[#16834A]" />
                <span>Grassroots Empowerment Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.15]">
                Learn New Skills. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16834A] to-[#105C35]">
                  Build Your Future.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                SkillConnect brings practical, life-changing workshops directly to villages and local neighborhoods. From digital literacy and computer basics to organic agriculture and vocational tailoring—100% free for everyone.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/workshops"
                  className="btn-primary text-base py-3.5 px-7 shadow-lg shadow-[#16834A]/25 w-full sm:w-auto text-center"
                >
                  <Compass className="w-5 h-5" />
                  <span>Explore Workshops</span>
                </Link>
                <Link
                  to="/register"
                  className="btn-secondary text-base py-3.5 px-7 border border-[#16834A]/20 w-full sm:w-auto text-center"
                >
                  <span>Register Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-gray-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#16834A]" /> 100% Free Workshops
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#16834A]" /> Verified Local Instructors
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#16834A]" /> Certificate of Completion
                </span>
              </div>
            </div>

            {/* Hero Visual Card Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="rounded-3xl p-3 bg-gradient-to-tr from-[#16834A]/20 via-emerald-100 to-white shadow-2xl">
                  <div className="rounded-2xl overflow-hidden shadow-lg bg-white relative">
                    <img
                      src="https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=900&q=80"
                      alt="Community learning workshop"
                      className="w-full h-80 object-cover"
                    />
                    <div className="p-6 bg-white space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold px-2.5 py-1 bg-[#EAF7EF] text-[#105C35] rounded-full">
                          Community In Action
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#16834A]" /> Village Panchayat
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg">
                        Empowering Rural Youth & Homemakers
                      </h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Practical skills taught in easy local language with equipment provided. Zero prerequisite degrees required.
                      </p>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex -space-x-2">
                          <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Learner" />
                          <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Learner" />
                          <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80" alt="Learner" />
                        </div>
                        <span className="text-xs font-medium text-[#105C35]">
                          500+ Enrolled Learners
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. COMMUNITY IMPACT STATISTICS */}
      <section className="bg-white py-12 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#16834A] tracking-tight">500+</p>
              <p className="text-xs sm:text-sm font-medium text-gray-600 mt-1">Participants Trained</p>
            </div>
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#16834A] tracking-tight">100%</p>
              <p className="text-xs sm:text-sm font-medium text-gray-600 mt-1">Free Participation</p>
            </div>
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#16834A] tracking-tight">18+</p>
              <p className="text-xs sm:text-sm font-medium text-gray-600 mt-1">Villages Reached</p>
            </div>
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#16834A] tracking-tight">96%</p>
              <p className="text-xs sm:text-sm font-medium text-gray-600 mt-1">Employment / Self-Reliance</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WORKSHOP CATEGORIES */}
      <section className="py-16 bg-[#F7FAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#16834A] bg-[#EAF7EF] px-3 py-1 rounded-full">
              Explore Domains
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-3 tracking-tight">
              Essential Skills for Local Growth
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mt-2">
              Choose from six high-impact training categories customized for village and community development.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  to={`/workshops?category=${encodeURIComponent(cat.name)}`}
                  className="card-base p-6 hover:border-[#16834A]/50 group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#EAF7EF] text-[#105C35] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-[#16834A] transition-colors mb-2">
                      {cat.name}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {cat.desc}
                    </p>
                  </div>
                  <div className="flex items-center text-xs font-semibold text-[#16834A] gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Browse {cat.name}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. FEATURED WORKSHOPS */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#16834A] bg-[#EAF7EF] px-3 py-1 rounded-full">
                Upcoming Sessions
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mt-3 tracking-tight">
                Featured Community Workshops
              </h2>
              <p className="text-gray-600 text-sm sm:text-base mt-1">
                Seats fill quickly. Register early to guarantee your participation kit.
              </p>
            </div>
            <Link
              to="/workshops"
              className="inline-flex items-center gap-1.5 font-semibold text-[#16834A] hover:text-[#105C35] transition-colors text-sm group"
            >
              <span>View All Available Workshops</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredWorkshops.map((workshop) => {
              const stats = getWorkshopStats(workshop.id, workshop.total_seats);
              return (
                <WorkshopCard
                  key={workshop.id}
                  workshop={workshop}
                  availableSeats={stats.availableSeats}
                  registeredCount={stats.registeredCount}
                  isFull={stats.isFull}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS SECTION */}
      <section className="py-16 bg-[#F7FAF8] border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#16834A] bg-[#EAF7EF] px-3 py-1 rounded-full">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-3 tracking-tight">
              How SkillConnect Works
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mt-2">
              Designed specifically so anyone in the village can join without complicated requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="card-base p-8 text-center relative flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-[#EAF7EF] text-[#16834A] flex items-center justify-center font-bold text-xl mb-5 shadow-xs">
                1
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Find a Workshop</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Browse our list of upcoming local workshops by topic, schedule, and venue. See live available seats.
              </p>
            </div>

            {/* Step 2 */}
            <div className="card-base p-8 text-center relative flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-[#EAF7EF] text-[#16834A] flex items-center justify-center font-bold text-xl mb-5 shadow-xs">
                2
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Register in 1 Minute</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Fill in your basic details (Name, Village, Phone). Zero fees, zero hidden costs, instant confirmation pass.
              </p>
            </div>

            {/* Step 3 */}
            <div className="card-base p-8 text-center relative flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-[#EAF7EF] text-[#16834A] flex items-center justify-center font-bold text-xl mb-5 shadow-xs">
                3
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Attend & Gain Skills</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Join our expert instructors at the community center. Get practical training, toolkits, and certificates.
              </p>
            </div>

          </div>

          {/* Bottom CTA Box */}
          <div className="mt-14 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#16834A] to-[#105C35] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-[#16834A]/20">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Ready to develop your skills?
              </h3>
              <p className="text-emerald-100 text-sm sm:text-base max-w-xl">
                Join hundreds of your neighbors who have upgraded their livelihoods. Check out our scheduled workshops today.
              </p>
            </div>
            <div className="shrink-0 flex flex-col sm:flex-row gap-3">
              <Link
                to="/workshops"
                className="bg-white hover:bg-emerald-50 text-[#105C35] font-bold px-6 py-3 rounded-xl transition-colors shadow-md text-center"
              >
                Browse Workshops
              </Link>
              <Link
                to="/register"
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-6 py-3 rounded-xl border border-emerald-500 transition-colors text-center"
              >
                Register Directly
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
