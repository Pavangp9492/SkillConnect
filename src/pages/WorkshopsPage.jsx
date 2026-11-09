import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useWorkshops } from '../context/WorkshopContext';
import WorkshopCard from '../components/WorkshopCard';
import { Search, Filter, RefreshCw, AlertCircle, Compass, Calendar, Sparkles } from 'lucide-react';

export default function WorkshopsPage() {
  const { workshops, getWorkshopStats, loading } = useWorkshops();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const selectedCategory = searchParams.get('category') || 'All';
  const [availabilityFilter, setAvailabilityFilter] = useState('all'); // all, available, full

  const categories = [
    'All',
    'Technology',
    'Digital Literacy',
    'Vocational Skills',
    'Healthcare',
    'Agriculture',
    'Business',
  ];

  const handleCategoryChange = (cat) => {
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  // Filtered workshops
  const filteredWorkshops = useMemo(() => {
    return workshops.filter((workshop) => {
      // Category filter
      if (selectedCategory !== 'All' && workshop.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // Search filter (title, description, venue)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = workshop.title?.toLowerCase().includes(query);
        const matchesDesc = workshop.description?.toLowerCase().includes(query);
        const matchesVenue = workshop.venue?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesVenue) {
          return false;
        }
      }

      // Availability filter
      const stats = getWorkshopStats(workshop.id, workshop.total_seats);
      if (availabilityFilter === 'available' && stats.isFull) {
        return false;
      }
      if (availabilityFilter === 'full' && !stats.isFull) {
        return false;
      }

      return true;
    });
  }, [workshops, selectedCategory, searchQuery, availabilityFilter, getWorkshopStats]);

  const resetFilters = () => {
    setSearchQuery('');
    setAvailabilityFilter('all');
    searchParams.delete('category');
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-[#F7FAF8] py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF7EF] text-[#105C35] text-xs font-semibold mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Community Learning Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Discover Community Workshops
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mt-2 max-w-2xl">
            Explore free upcoming skill-training programs organized across local community halls, panchayat offices, and vocational centers.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Search Input */}
            <div className="md:col-span-8 relative">
              <label htmlFor="search-workshops" className="sr-only">Search workshops</label>
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                id="search-workshops"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by workshop title, skill keywords, or venue location..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#16834A] focus:ring-2 focus:ring-[#16834A]/20 text-sm placeholder:text-gray-400 outline-none transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-gray-400 hover:text-gray-700"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Availability Filter Dropdown */}
            <div className="md:col-span-4">
              <label htmlFor="availability-select" className="sr-only">Filter by seat status</label>
              <select
                id="availability-select"
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#16834A] focus:ring-2 focus:ring-[#16834A]/20 text-sm text-gray-700 bg-white outline-none transition"
              >
                <option value="all">All Availability Statuses</option>
                <option value="available">Open for Registration (Seats Available)</option>
                <option value="full">Fully Booked Only</option>
              </select>
            </div>

          </div>

          {/* Category Tabs */}
          <div className="pt-2 border-t border-gray-100 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-xs font-semibold text-gray-500 shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Domain:
            </span>
            {categories.map((cat) => {
              const active = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                    active
                      ? 'bg-[#16834A] text-white shadow-xs font-semibold'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter & Active Filters Display */}
        <div className="flex items-center justify-between mb-6 text-sm text-gray-600">
          <div>
            Showing <span className="font-bold text-gray-900">{filteredWorkshops.length}</span> workshops
            {selectedCategory !== 'All' && <span> in <span className="font-semibold text-[#16834A]">{selectedCategory}</span></span>}
            {searchQuery && <span> matching "<span className="italic">{searchQuery}</span>"</span>}
          </div>

          {(selectedCategory !== 'All' || searchQuery || availabilityFilter !== 'all') && (
            <button
              onClick={resetFilters}
              className="text-xs text-[#16834A] hover:text-[#105C35] font-semibold flex items-center gap-1 underline underline-offset-2"
            >
              <RefreshCw className="w-3 h-3" /> Reset all filters
            </button>
          )}
        </div>

        {/* Workshop Cards Grid */}
        {filteredWorkshops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredWorkshops.map((workshop) => {
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
        ) : (
          /* Empty State */
          <div className="card-base p-12 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#16834A] mx-auto flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Workshops Match Your Search</h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              We couldn't find any workshops matching your current search criteria. Try modifying your search keywords or switching category filters.
            </p>
            <button
              onClick={resetFilters}
              className="btn-primary text-sm py-2 px-5 inline-flex"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Reset Filters & Show All
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
