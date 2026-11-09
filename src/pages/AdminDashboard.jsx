import React from 'react';
import { Link } from 'react-router-dom';
import { useWorkshops } from '../context/WorkshopContext';
import { useAuth } from '../context/AuthContext';
import { 
  CalendarDays, 
  Users, 
  UserCheck, 
  CalendarCheck, 
  TrendingUp, 
  PlusCircle, 
  ArrowRight, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ShieldCheck, 
  ExternalLink,
  RotateCcw
} from 'lucide-react';

export default function AdminDashboard() {
  const { workshops, registrations, stats, getWorkshopStats, resetDemoData } = useWorkshops();
  const { user, isDemoMode } = useAuth();

  const recentRegistrations = registrations.slice(0, 6);
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-[#F7FAF8] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EAF7EF] text-[#105C35]">
                Administrator Control Center
              </span>
              {isDemoMode && (
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-100 text-amber-800">
                  Demo Mode
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Community Workshop Overview
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Welcome back, <strong className="text-gray-800">{user?.full_name || user?.email || 'Administrator'}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isDemoMode && (
              <button
                onClick={() => {
                  if (window.confirm('Reset demo data to initial factory state?')) {
                    resetDemoData();
                  }
                }}
                className="btn-outline text-xs py-2 px-3 text-gray-600"
                title="Reset sample workshops and registrations to initial state"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo Data</span>
              </button>
            )}

            <Link
              to="/admin/workshops"
              className="btn-primary text-xs sm:text-sm py-2.5 px-4 shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Manage Workshops</span>
            </Link>

            <Link
              to="/admin/registrations"
              className="btn-secondary text-xs sm:text-sm py-2.5 px-4"
            >
              <Users className="w-4 h-4" />
              <span>View Registrations</span>
            </Link>
          </div>
        </div>

        {/* 1. STATISTIC METRIC CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          
          {/* Total Workshops */}
          <div className="card-base p-5 border-l-4 border-l-[#16834A]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Workshops</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">{stats.totalWorkshops}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#EAF7EF] text-[#16834A] flex items-center justify-center">
                <CalendarDays className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
              <span>{stats.upcomingWorkshops} upcoming sessions</span>
            </p>
          </div>

          {/* Total Registrations */}
          <div className="card-base p-5 border-l-4 border-l-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Registrations</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">{stats.totalRegistrations}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
              <span>Enrolled across all community programs</span>
            </p>
          </div>

          {/* Upcoming Sessions */}
          <div className="card-base p-5 border-l-4 border-l-amber-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Upcoming Workshops</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">{stats.upcomingWorkshops}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <CalendarCheck className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
              <span>Scheduled for coming weeks</span>
            </p>
          </div>

          {/* Total Attendees (Present) */}
          <div className="card-base p-5 border-l-4 border-l-emerald-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Present Attendees</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">{stats.totalPresentAttendees}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <UserCheck className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
              <span className="font-semibold text-emerald-700">{stats.attendanceRate}%</span> attendance completion rate
            </p>
          </div>

        </div>

        {/* 2. MAIN DASHBOARD CONTENT (2 COLUMNS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Workshop Overview Table (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="card-base overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-gray-900 text-lg">Workshop Status Overview</h2>
                  <p className="text-xs text-gray-500">Live seat reservations and attendance stats</p>
                </div>
                <Link
                  to="/admin/workshops"
                  className="text-xs font-semibold text-[#16834A] hover:text-[#105C35] flex items-center gap-1"
                >
                  Manage All &rarr;
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-50/80 text-xs text-gray-500 uppercase font-semibold border-b border-gray-100">
                    <tr>
                      <th className="py-3 px-4">Workshop</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Seats Reserved</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {workshops.map((ws) => {
                      const wStats = getWorkshopStats(ws.id, ws.total_seats);
                      const isUpcoming = ws.date >= todayStr;
                      const occupancy = Math.round((wStats.registeredCount / ws.total_seats) * 100);

                      return (
                        <tr key={ws.id} className="hover:bg-gray-50/60 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-gray-900">
                            <div className="flex flex-col">
                              <span>{ws.title}</span>
                              <span className="text-[11px] text-gray-400 font-normal">{ws.venue}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#EAF7EF] text-[#105C35]">
                              {ws.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-xs">
                            <span className={isUpcoming ? 'text-gray-900 font-medium' : 'text-gray-400 line-through'}>
                              {ws.date}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-gray-800">
                                {wStats.registeredCount} / {ws.total_seats}
                              </span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                                wStats.isFull ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                {occupancy}%
                              </span>
                            </div>
                            <div className="w-24 bg-gray-100 rounded-full h-1.5 mt-1 overflow-hidden">
                              <div
                                className={`h-full ${wStats.isFull ? 'bg-red-500' : 'bg-[#16834A]'}`}
                                style={{ width: `${occupancy}%` }}
                              />
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                to={`/workshops/${ws.id}`}
                                className="p-1.5 text-gray-500 hover:text-[#16834A] rounded hover:bg-gray-100"
                                title="View Public Page"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Link>
                              <Link
                                to="/admin/workshops"
                                className="text-xs font-semibold text-[#16834A] hover:underline"
                              >
                                Edit
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Recent Registrations & Quick Actions (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Recent Registrations Box */}
            <div className="card-base p-5">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                <h3 className="font-bold text-gray-900 text-base">Recent Registrations</h3>
                <Link
                  to="/admin/registrations"
                  className="text-xs font-semibold text-[#16834A] hover:underline"
                >
                  All ({registrations.length})
                </Link>
              </div>

              {recentRegistrations.length > 0 ? (
                <div className="space-y-3">
                  {recentRegistrations.map((reg) => {
                    const ws = workshops.find(w => String(w.id) === String(reg.workshop_id));
                    return (
                      <div key={reg.id} className="p-3 rounded-xl bg-gray-50/70 border border-gray-100 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-900">{reg.participant_name}</span>
                          <span className={`px-1.5 py-0.5 rounded font-semibold text-[10px] ${
                            reg.attendance_status === 'Present'
                              ? 'bg-emerald-100 text-emerald-800'
                              : reg.attendance_status === 'Absent'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-200 text-gray-700'
                          }`}>
                            {reg.attendance_status}
                          </span>
                        </div>
                        <p className="text-gray-500 truncate">{ws?.title || 'Workshop'}</p>
                        <p className="text-[11px] text-gray-400">{reg.village} • {reg.phone}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-gray-500 text-center py-6">No registrations received yet.</p>
              )}
            </div>

            {/* Quick Action Navigation */}
            <div className="card-base p-5 space-y-3">
              <h3 className="font-bold text-gray-900 text-sm">Administrative Tools</h3>
              <div className="space-y-2">
                <Link
                  to="/admin/workshops"
                  className="w-full p-3 rounded-xl border border-gray-200 hover:border-[#16834A] hover:bg-[#EAF7EF]/40 text-xs font-medium text-gray-700 flex items-center justify-between transition"
                >
                  <span className="flex items-center gap-2">
                    <PlusCircle className="w-4 h-4 text-[#16834A]" /> Create New Workshop
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                </Link>

                <Link
                  to="/admin/registrations"
                  className="w-full p-3 rounded-xl border border-gray-200 hover:border-[#16834A] hover:bg-[#EAF7EF]/40 text-xs font-medium text-gray-700 flex items-center justify-between transition"
                >
                  <span className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#16834A]" /> Mark Attendance Sheet
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                </Link>

                <Link
                  to="/workshops"
                  className="w-full p-3 rounded-xl border border-gray-200 hover:border-gray-400 text-xs font-medium text-gray-700 flex items-center justify-between transition"
                >
                  <span className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-gray-500" /> View Public Workshop Catalog
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
