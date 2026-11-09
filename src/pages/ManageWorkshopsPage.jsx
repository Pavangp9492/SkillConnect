import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWorkshops } from '../context/WorkshopContext';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  X, 
  Check, 
  AlertTriangle, 
  ExternalLink,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

export default function ManageWorkshopsPage() {
  const { workshops, addWorkshop, updateWorkshop, deleteWorkshop, getWorkshopStats } = useWorkshops();

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form states
  const initialForm = {
    title: '',
    category: 'Technology',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM - 1:00 PM',
    venue: '',
    total_seats: '25',
    image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
  };

  const [form, setForm] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  const categories = [
    'Technology',
    'Digital Literacy',
    'Vocational Skills',
    'Healthcare',
    'Agriculture',
    'Business',
  ];

  const handleOpenAdd = () => {
    setEditingWorkshop(null);
    setForm(initialForm);
    setFormErrors({});
    setModalOpen(true);
  };

  const handleOpenEdit = (ws) => {
    setEditingWorkshop(ws);
    setForm({
      title: ws.title || '',
      category: ws.category || 'Technology',
      description: ws.description || '',
      date: ws.date || '',
      time: ws.time || '',
      venue: ws.venue || '',
      total_seats: String(ws.total_seats || 25),
      image_url: ws.image_url || '',
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!form.title.trim()) errors.title = 'Title is required';
    if (!form.description.trim()) errors.description = 'Description is required';
    if (!form.date) errors.date = 'Date is required';
    if (!form.time.trim()) errors.time = 'Time is required';
    if (!form.venue.trim()) errors.venue = 'Venue is required';
    const seats = parseInt(form.total_seats, 10);
    if (!form.total_seats || isNaN(seats) || seats <= 0) {
      errors.total_seats = 'Seats must be a positive number';
    }
    return errors;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      if (editingWorkshop) {
        await updateWorkshop(editingWorkshop.id, form);
        setActionMessage({ type: 'success', text: `Workshop "${form.title}" updated successfully.` });
      } else {
        await addWorkshop(form);
        setActionMessage({ type: 'success', text: `New workshop "${form.title}" created successfully.` });
      }
      setModalOpen(false);
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message || 'Operation failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteWorkshop(id);
      setDeleteConfirmId(null);
      setActionMessage({ type: 'success', text: 'Workshop deleted successfully.' });
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message || 'Could not delete workshop' });
    }
  };

  const filteredWorkshops = workshops.filter((ws) => {
    const q = searchTerm.toLowerCase();
    return (
      ws.title?.toLowerCase().includes(q) ||
      ws.category?.toLowerCase().includes(q) ||
      ws.venue?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#F7FAF8] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumbs & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#16834A] mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Manage Community Workshops
            </h1>
            <p className="text-gray-600 text-sm mt-0.5">
              Add new sessions, edit schedules, update venue locations, or remove past workshops.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="btn-primary text-sm py-2.5 px-4 shadow-sm self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Workshop</span>
          </button>
        </div>

        {/* Action Notice Alert */}
        {actionMessage && (
          <div className={`mb-6 p-4 rounded-xl border text-sm flex items-center justify-between shadow-xs ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <span>{actionMessage.text}</span>
            <button onClick={() => setActionMessage(null)} className="text-gray-500 hover:text-gray-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by title, category, or venue..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-[#16834A] focus:ring-2 focus:ring-[#16834A]/20 text-sm outline-none"
            />
          </div>
        </div>

        {/* Workshops Table */}
        <div className="card-base overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/80 text-xs text-gray-500 uppercase font-semibold border-b border-gray-100">
                <tr>
                  <th className="py-3.5 px-4">Workshop</th>
                  <th className="py-3.5 px-4">Domain</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Venue</th>
                  <th className="py-3.5 px-4">Seats & Capacity</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredWorkshops.map((ws) => {
                  const stats = getWorkshopStats(ws.id, ws.total_seats);
                  return (
                    <tr key={ws.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-gray-900">
                        <div className="flex items-center gap-3">
                          <img
                            src={ws.image_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=100&q=80'}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="truncate max-w-xs">{ws.title}</p>
                            <span className="text-[11px] text-gray-400 font-normal">ID: {ws.id.slice(0, 8)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EAF7EF] text-[#105C35]">
                          {ws.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs">
                        <p className="font-semibold text-gray-800">{ws.date}</p>
                        <p className="text-gray-500">{ws.time}</p>
                      </td>
                      <td className="py-3.5 px-4 text-xs max-w-xs truncate">
                        {ws.venue}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-xs font-semibold text-gray-800">
                          {stats.registeredCount} / {ws.total_seats}
                        </span>
                        <div className="w-20 bg-gray-100 rounded-full h-1.5 mt-1 overflow-hidden">
                          <div
                            className={`h-full ${stats.isFull ? 'bg-red-500' : 'bg-[#16834A]'}`}
                            style={{
                              width: `${Math.min(100, Math.round((stats.registeredCount / ws.total_seats) * 100))}%`
                            }}
                          />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/workshops/${ws.id}`}
                            className="p-1.5 text-gray-500 hover:text-[#16834A] rounded hover:bg-gray-100"
                            title="Preview Public Page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleOpenEdit(ws)}
                            className="p-1.5 text-blue-600 hover:text-blue-800 rounded hover:bg-blue-50"
                            title="Edit Workshop"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(ws.id)}
                            className="p-1.5 text-red-600 hover:text-red-800 rounded hover:bg-red-50"
                            title="Delete Workshop"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL: Add / Edit Workshop */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {editingWorkshop ? 'Edit Workshop' : 'Create New Workshop'}
              </h2>
              <p className="text-xs text-gray-500 mb-6">
                All changes will be reflected immediately in the live community catalog.
              </p>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Workshop Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Organic Farming & Soil Health"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#16834A] focus:ring-2 focus:ring-[#16834A]/20 outline-none"
                  />
                  {formErrors.title && <p className="text-xs text-red-600 mt-1">{formErrors.title}</p>}
                </div>

                {/* Category & Total Seats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Category Domain <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#16834A] outline-none bg-white"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Total Seats <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={form.total_seats}
                      onChange={(e) => setForm({ ...form, total_seats: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#16834A] outline-none"
                    />
                    {formErrors.total_seats && <p className="text-xs text-red-600 mt-1">{formErrors.total_seats}</p>}
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#16834A] outline-none"
                    />
                    {formErrors.date && <p className="text-xs text-red-600 mt-1">{formErrors.date}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Time / Duration <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.time}
                      onChange={(e) => setForm({ ...form, time: e.target.value })}
                      placeholder="e.g. 10:00 AM - 1:00 PM"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#16834A] outline-none"
                    />
                    {formErrors.time && <p className="text-xs text-red-600 mt-1">{formErrors.time}</p>}
                  </div>
                </div>

                {/* Venue */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Venue Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.venue}
                    onChange={(e) => setForm({ ...form, venue: e.target.value })}
                    placeholder="e.g. Panchayat Bhawan, Hall B"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#16834A] outline-none"
                  />
                  {formErrors.venue && <p className="text-xs text-red-600 mt-1">{formErrors.venue}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Detailed Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Explain what skills will be learned and who should attend..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#16834A] outline-none"
                  />
                  {formErrors.description && <p className="text-xs text-red-600 mt-1">{formErrors.description}</p>}
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={form.image_url}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#16834A] outline-none"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="btn-outline text-xs py-2.5 px-4"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary text-xs py-2.5 px-5"
                  >
                    {submitting ? 'Saving...' : editingWorkshop ? 'Update Workshop' : 'Publish Workshop'}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* DIALOG: Delete Confirmation */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center">Confirm Deletion</h3>
              <p className="text-xs sm:text-sm text-gray-600 text-center leading-relaxed">
                Are you sure you want to delete this workshop? All associated participant registrations will also be removed. This action cannot be undone.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="btn-outline text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs py-2 px-4 rounded-lg transition"
                >
                  Yes, Delete Workshop
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
