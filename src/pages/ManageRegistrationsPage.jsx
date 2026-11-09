import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useWorkshops } from '../context/WorkshopContext';
import { 
  Users, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Download, 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  RefreshCw,
  Sparkles
} from 'lucide-react';

export default function ManageRegistrationsPage() {
  const { registrations, workshops, updateAttendance } = useWorkshops();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorkshopFilter, setSelectedWorkshopFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  // Filtered registrations
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      // Filter by workshop
      if (selectedWorkshopFilter !== 'all' && String(reg.workshop_id) !== String(selectedWorkshopFilter)) {
        return false;
      }

      // Filter by status
      if (statusFilter !== 'all' && reg.attendance_status !== statusFilter) {
        return false;
      }

      // Search across name, email, phone, village
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = reg.participant_name?.toLowerCase().includes(q);
        const matchesEmail = reg.email?.toLowerCase().includes(q);
        const matchesPhone = reg.phone?.toLowerCase().includes(q);
        const matchesVillage = reg.village?.toLowerCase().includes(q);

        if (!matchesName && !matchesEmail && !matchesPhone && !matchesVillage) {
          return false;
        }
      }

      return true;
    });
  }, [registrations, selectedWorkshopFilter, statusFilter, searchQuery]);

  const handleStatusChange = async (regId, newStatus) => {
    setUpdatingId(regId);
    try {
      await updateAttendance(regId, newStatus);
    } catch (err) {
      alert('Could not update attendance: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  // Export to CSV for local organizers
  const handleExportCSV = () => {
    if (filteredRegistrations.length === 0) {
      alert('No records to export with current filters.');
      return;
    }

    const headers = ['Registration ID', 'Participant Name', 'Email', 'Phone', 'Age', 'Village', 'Workshop', 'Date Registered', 'Attendance'];
    const rows = filteredRegistrations.map((r) => {
      const ws = workshops.find((w) => String(w.id) === String(r.workshop_id));
      return [
        `"${r.id}"`,
        `"${r.participant_name}"`,
        `"${r.email}"`,
        `"${r.phone}"`,
        r.age,
        `"${r.village}"`,
        `"${ws?.title || 'Workshop'}"`,
        `"${new Date(r.created_at).toLocaleDateString()}"`,
        `"${r.attendance_status}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `skillconnect_registrations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const counts = {
    total: filteredRegistrations.length,
    present: filteredRegistrations.filter(r => r.attendance_status === 'Present').length,
    absent: filteredRegistrations.filter(r => r.attendance_status === 'Absent').length,
    registered: filteredRegistrations.filter(r => r.attendance_status === 'Registered').length,
  };

  return (
    <div className="min-h-screen bg-[#F7FAF8] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumbs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#16834A] mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Participant Registrations & Attendance
            </h1>
            <p className="text-gray-600 text-sm mt-0.5">
              Review community registrants, verify details, and mark attendance during workshop sessions.
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="btn-secondary text-xs sm:text-sm py-2.5 px-4 shadow-sm self-start md:self-auto border border-emerald-200"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV Roll-Call</span>
          </button>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="card-base p-4">
            <span className="text-xs text-gray-500 font-semibold uppercase">Total Filtered</span>
            <p className="text-2xl font-extrabold text-gray-900 mt-1">{counts.total}</p>
          </div>
          <div className="card-base p-4 border-l-4 border-l-emerald-600">
            <span className="text-xs text-emerald-800 font-semibold uppercase">Marked Present</span>
            <p className="text-2xl font-extrabold text-emerald-700 mt-1">{counts.present}</p>
          </div>
          <div className="card-base p-4 border-l-4 border-l-red-500">
            <span className="text-xs text-red-800 font-semibold uppercase">Marked Absent</span>
            <p className="text-2xl font-extrabold text-red-600 mt-1">{counts.absent}</p>
          </div>
          <div className="card-base p-4 border-l-4 border-l-gray-400">
            <span className="text-xs text-gray-600 font-semibold uppercase">Awaiting Check-in</span>
            <p className="text-2xl font-extrabold text-gray-700 mt-1">{counts.registered}</p>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Search */}
            <div className="md:col-span-5 relative">
              <label htmlFor="reg-search" className="sr-only">Search participant name, email, phone, or village</label>
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                id="reg-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search participant name, email, phone, village..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#16834A] focus:ring-2 focus:ring-[#16834A]/20 text-sm outline-none"
              />
            </div>

            {/* Workshop Filter */}
            <div className="md:col-span-4">
              <label htmlFor="reg-workshop-filter" className="sr-only">Filter by Workshop</label>
              <select
                id="reg-workshop-filter"
                value={selectedWorkshopFilter}
                onChange={(e) => setSelectedWorkshopFilter(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#16834A] outline-none bg-white text-gray-700"
              >
                <option value="all">All Workshops ({workshops.length})</option>
                {workshops.map((ws) => (
                  <option key={ws.id} value={ws.id}>
                    {ws.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Attendance Status Filter */}
            <div className="md:col-span-3">
              <label htmlFor="reg-status-filter" className="sr-only">Filter by Attendance Status</label>
              <select
                id="reg-status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#16834A] outline-none bg-white text-gray-700"
              >
                <option value="all">All Attendance Statuses</option>
                <option value="Registered">Registered (Pending)</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
            </div>

          </div>

          {(searchQuery || selectedWorkshopFilter !== 'all' || statusFilter !== 'all') && (
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-500">Filters applied</span>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedWorkshopFilter('all');
                  setStatusFilter('all');
                }}
                className="text-[#16834A] font-semibold hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Reset all filters
              </button>
            </div>
          )}
        </div>

        {/* Registrations Table */}
        <div className="card-base overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/80 text-xs text-gray-500 uppercase font-semibold border-b border-gray-100">
                <tr>
                  <th className="py-3.5 px-4">Participant</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Age & Village</th>
                  <th className="py-3.5 px-4">Workshop</th>
                  <th className="py-3.5 px-4">Registered Date</th>
                  <th className="py-3.5 px-4 text-center">Attendance Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRegistrations.length > 0 ? (
                  filteredRegistrations.map((reg) => {
                    const ws = workshops.find(w => String(w.id) === String(reg.workshop_id));
                    const isPresent = reg.attendance_status === 'Present';
                    const isAbsent = reg.attendance_status === 'Absent';
                    const isPending = reg.attendance_status === 'Registered';
                    const isUpdating = updatingId === reg.id;

                    return (
                      <tr key={reg.id} className="hover:bg-gray-50/60 transition-colors">
                        
                        {/* Name */}
                        <td className="py-3.5 px-4 font-semibold text-gray-900">
                          <div>
                            <p className="text-sm font-bold text-gray-900">{reg.participant_name}</p>
                            <span className="text-[10px] font-mono text-gray-400">#{reg.id.slice(0, 8)}</span>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="py-3.5 px-4 text-xs">
                          <p className="flex items-center gap-1 text-gray-800">
                            <Mail className="w-3 h-3 text-gray-400" /> {reg.email}
                          </p>
                          <p className="flex items-center gap-1 text-gray-600 mt-0.5">
                            <Phone className="w-3 h-3 text-gray-400" /> {reg.phone}
                          </p>
                        </td>

                        {/* Age & Village */}
                        <td className="py-3.5 px-4 text-xs">
                          <p className="font-medium text-gray-800">{reg.village}</p>
                          <p className="text-gray-400">{reg.age} years old</p>
                        </td>

                        {/* Workshop */}
                        <td className="py-3.5 px-4 text-xs max-w-xs">
                          <p className="font-semibold text-gray-900 truncate">{ws?.title || 'Unknown Workshop'}</p>
                          <span className="text-[10px] text-gray-500">{ws?.date} • {ws?.venue}</span>
                        </td>

                        {/* Date Registered */}
                        <td className="py-3.5 px-4 text-xs text-gray-500">
                          {new Date(reg.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>

                        {/* Attendance Toggle Buttons */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex items-center rounded-lg p-1 bg-gray-100 border border-gray-200">
                            
                            {/* Present Button */}
                            <button
                              disabled={isUpdating}
                              onClick={() => handleStatusChange(reg.id, 'Present')}
                              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 ${
                                isPresent
                                  ? 'bg-[#16834A] text-white shadow-xs'
                                  : 'text-gray-600 hover:text-emerald-700 hover:bg-white'
                              }`}
                              title="Mark Present"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Present</span>
                            </button>

                            {/* Absent Button */}
                            <button
                              disabled={isUpdating}
                              onClick={() => handleStatusChange(reg.id, 'Absent')}
                              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 ${
                                isAbsent
                                  ? 'bg-red-600 text-white shadow-xs'
                                  : 'text-gray-600 hover:text-red-700 hover:bg-white'
                              }`}
                              title="Mark Absent"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Absent</span>
                            </button>

                            {/* Registered / Reset Button */}
                            <button
                              disabled={isUpdating}
                              onClick={() => handleStatusChange(reg.id, 'Registered')}
                              className={`px-2 py-1 text-[11px] font-medium rounded-md transition-colors ${
                                isPending
                                  ? 'bg-gray-300 text-gray-800'
                                  : 'text-gray-400 hover:text-gray-700 hover:bg-white'
                              }`}
                              title="Reset to Registered status"
                            >
                              Reset
                            </button>

                          </div>
                        </td>

                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-sm text-gray-500">
                      No registrations found matching the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
