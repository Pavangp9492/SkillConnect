import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured, INITIAL_WORKSHOPS, INITIAL_REGISTRATIONS } from '../lib/supabase';

const WorkshopContext = createContext();

const LOCAL_STORAGE_WORKSHOPS_KEY = 'skillconnect_workshops_v1';
const LOCAL_STORAGE_REGISTRATIONS_KEY = 'skillconnect_registrations_v1';

export function WorkshopProvider({ children }) {
  const [workshops, setWorkshops] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize or fetch data
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (isSupabaseConfigured && supabase) {
      try {
        // Fetch workshops with stats or fallback
        const { data: workshopsData, error: wError } = await supabase
          .from('workshops')
          .select('*')
          .order('date', { ascending: true });

        if (wError) throw wError;

        // Try fetching registrations (admin only; if anon, this safely returns empty or fails gracefully)
        const { data: regsData, error: rError } = await supabase
          .from('registrations')
          .select('*')
          .order('created_at', { ascending: false });

        if (!rError && regsData) {
          setRegistrations(regsData);
        }

        setWorkshops(workshopsData || []);
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local demo data:', err.message);
        loadLocalData();
      } finally {
        setLoading(false);
      }
    } else {
      loadLocalData();
      setLoading(false);
    }
  }, []);

  function loadLocalData() {
    try {
      const storedWorkshops = localStorage.getItem(LOCAL_STORAGE_WORKSHOPS_KEY);
      const storedRegistrations = localStorage.getItem(LOCAL_STORAGE_REGISTRATIONS_KEY);

      if (storedWorkshops) {
        setWorkshops(JSON.parse(storedWorkshops));
      } else {
        setWorkshops(INITIAL_WORKSHOPS);
        localStorage.setItem(LOCAL_STORAGE_WORKSHOPS_KEY, JSON.stringify(INITIAL_WORKSHOPS));
      }

      if (storedRegistrations) {
        setRegistrations(JSON.parse(storedRegistrations));
      } else {
        setRegistrations(INITIAL_REGISTRATIONS);
        localStorage.setItem(LOCAL_STORAGE_REGISTRATIONS_KEY, JSON.stringify(INITIAL_REGISTRATIONS));
      }
    } catch (e) {
      console.error('Error loading from localStorage:', e);
      setWorkshops(INITIAL_WORKSHOPS);
      setRegistrations(INITIAL_REGISTRATIONS);
    }
  }

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Sync state to localStorage when in local/demo mode
  const syncToLocalStorage = (newWorkshops, newRegistrations) => {
    if (!isSupabaseConfigured) {
      if (newWorkshops) {
        localStorage.setItem(LOCAL_STORAGE_WORKSHOPS_KEY, JSON.stringify(newWorkshops));
      }
      if (newRegistrations) {
        localStorage.setItem(LOCAL_STORAGE_REGISTRATIONS_KEY, JSON.stringify(newRegistrations));
      }
    }
  };

  // Helper: calculate registered count and available seats for a workshop
  const getWorkshopStats = useCallback((workshopId, totalSeats) => {
    const regCount = registrations.filter(r => r.workshop_id === workshopId).length;
    const available = Math.max(0, totalSeats - regCount);
    const isFull = available <= 0;
    return {
      registeredCount: regCount,
      availableSeats: available,
      isFull,
    };
  }, [registrations]);

  // Get single workshop by ID (with stats attached)
  const getWorkshopById = useCallback((id) => {
    const ws = workshops.find(w => String(w.id) === String(id));
    if (!ws) return null;
    const stats = getWorkshopStats(ws.id, ws.total_seats);
    return { ...ws, ...stats };
  }, [workshops, getWorkshopStats]);

  // Register a participant for a workshop
  const registerParticipant = async ({ workshopId, participantName, email, phone, age, village }) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = participantName.trim();
    const cleanPhone = phone.trim();
    const cleanVillage = village.trim();
    const parsedAge = parseInt(age, 10);

    // Verify workshop
    const workshop = workshops.find(w => String(w.id) === String(workshopId));
    if (!workshop) {
      throw new Error('Workshop not found.');
    }

    // Check duplicate email
    const duplicate = registrations.some(
      r => String(r.workshop_id) === String(workshopId) && r.email.toLowerCase() === cleanEmail
    );
    if (duplicate) {
      throw new Error(`You have already registered for "${workshop.title}" with the email ${cleanEmail}.`);
    }

    // Check available seats
    const currentRegs = registrations.filter(r => String(r.workshop_id) === String(workshopId));
    if (currentRegs.length >= workshop.total_seats) {
      throw new Error('Sorry, this workshop is currently fully booked. No available seats remain.');
    }

    if (isSupabaseConfigured && supabase) {
      try {
        // Attempt atomic database function first
        const { data: rpcData, error: rpcError } = await supabase.rpc('register_for_workshop', {
          p_workshop_id: workshopId,
          p_participant_name: cleanName,
          p_email: cleanEmail,
          p_phone: cleanPhone,
          p_age: parsedAge,
          p_village: cleanVillage,
        });

        if (!rpcError && rpcData) {
          if (!rpcData.success) {
            throw new Error(rpcData.error || 'Registration failed.');
          }
          const newReg = rpcData.registration;
          setRegistrations(prev => [newReg, ...prev]);
          return newReg;
        }

        // Direct table insert fallback
        const { data: insertData, error: insertError } = await supabase
          .from('registrations')
          .insert([
            {
              workshop_id: workshopId,
              participant_name: cleanName,
              email: cleanEmail,
              phone: cleanPhone,
              age: parsedAge,
              village: cleanVillage,
              attendance_status: 'Registered',
            },
          ])
          .select()
          .single();

        if (insertError) {
          if (insertError.code === '23505') {
            throw new Error('You have already registered for this workshop with this email.');
          }
          throw insertError;
        }

        setRegistrations(prev => [insertData, ...prev]);
        return insertData;
      } catch (err) {
        console.error('Supabase registration error:', err);
        throw err;
      }
    } else {
      // Local/Demo registration
      const newReg = {
        id: `reg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        workshop_id: workshopId,
        participant_name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        age: parsedAge,
        village: cleanVillage,
        attendance_status: 'Registered',
        created_at: new Date().toISOString(),
      };

      const updated = [newReg, ...registrations];
      setRegistrations(updated);
      syncToLocalStorage(null, updated);
      return newReg;
    }
  };

  // Admin: Add Workshop
  const addWorkshop = async (workshopData) => {
    const payload = {
      title: workshopData.title.trim(),
      category: workshopData.category.trim(),
      description: workshopData.description.trim(),
      date: workshopData.date,
      time: workshopData.time.trim(),
      venue: workshopData.venue.trim(),
      total_seats: parseInt(workshopData.total_seats, 10),
      image_url: workshopData.image_url?.trim() || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error: insertErr } = await supabase
        .from('workshops')
        .insert([payload])
        .select()
        .single();

      if (insertErr) throw insertErr;
      setWorkshops(prev => [...prev, data]);
      return data;
    } else {
      const newWorkshop = {
        id: `ws-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        ...payload,
        created_at: new Date().toISOString(),
      };
      const updated = [newWorkshop, ...workshops];
      setWorkshops(updated);
      syncToLocalStorage(updated, null);
      return newWorkshop;
    }
  };

  // Admin: Update Workshop
  const updateWorkshop = async (id, updatedFields) => {
    const payload = {
      title: updatedFields.title?.trim(),
      category: updatedFields.category?.trim(),
      description: updatedFields.description?.trim(),
      date: updatedFields.date,
      time: updatedFields.time?.trim(),
      venue: updatedFields.venue?.trim(),
      total_seats: parseInt(updatedFields.total_seats, 10),
      image_url: updatedFields.image_url?.trim(),
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error: updateErr } = await supabase
        .from('workshops')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (updateErr) throw updateErr;
      setWorkshops(prev => prev.map(w => (String(w.id) === String(id) ? data : w)));
      return data;
    } else {
      const updated = workshops.map(w => {
        if (String(w.id) === String(id)) {
          return { ...w, ...payload };
        }
        return w;
      });
      setWorkshops(updated);
      syncToLocalStorage(updated, null);
      return updated.find(w => String(w.id) === String(id));
    }
  };

  // Admin: Delete Workshop
  const deleteWorkshop = async (id) => {
    if (isSupabaseConfigured && supabase) {
      const { error: deleteErr } = await supabase
        .from('workshops')
        .delete()
        .eq('id', id);

      if (deleteErr) throw deleteErr;
      setWorkshops(prev => prev.filter(w => String(w.id) !== String(id)));
      setRegistrations(prev => prev.filter(r => String(r.workshop_id) !== String(id)));
    } else {
      const updatedWorkshops = workshops.filter(w => String(w.id) !== String(id));
      const updatedRegistrations = registrations.filter(r => String(r.workshop_id) !== String(id));
      setWorkshops(updatedWorkshops);
      setRegistrations(updatedRegistrations);
      syncToLocalStorage(updatedWorkshops, updatedRegistrations);
    }
  };

  // Admin: Update Attendance Status
  const updateAttendance = async (registrationId, newStatus) => {
    if (!['Registered', 'Present', 'Absent'].includes(newStatus)) {
      throw new Error('Invalid attendance status.');
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error: updateErr } = await supabase
        .from('registrations')
        .update({ attendance_status: newStatus })
        .eq('id', registrationId)
        .select()
        .single();

      if (updateErr) throw updateErr;
      setRegistrations(prev =>
        prev.map(r => (String(r.id) === String(registrationId) ? { ...r, attendance_status: newStatus } : r))
      );
      return data;
    } else {
      const updated = registrations.map(r =>
        String(r.id) === String(registrationId) ? { ...r, attendance_status: newStatus } : r
      );
      setRegistrations(updated);
      syncToLocalStorage(null, updated);
      return updated.find(r => String(r.id) === String(registrationId));
    }
  };

  // Reset demo data to factory defaults
  const resetDemoData = () => {
    localStorage.removeItem(LOCAL_STORAGE_WORKSHOPS_KEY);
    localStorage.removeItem(LOCAL_STORAGE_REGISTRATIONS_KEY);
    setWorkshops(INITIAL_WORKSHOPS);
    setRegistrations(INITIAL_REGISTRATIONS);
    localStorage.setItem(LOCAL_STORAGE_WORKSHOPS_KEY, JSON.stringify(INITIAL_WORKSHOPS));
    localStorage.setItem(LOCAL_STORAGE_REGISTRATIONS_KEY, JSON.stringify(INITIAL_REGISTRATIONS));
  };

  // Compute Overall Stats for Dashboard
  const todayStr = new Date().toISOString().split('T')[0];
  const totalWorkshops = workshops.length;
  const totalRegistrations = registrations.length;
  const upcomingWorkshops = workshops.filter(w => w.date >= todayStr).length;
  const totalPresentAttendees = registrations.filter(r => r.attendance_status === 'Present').length;
  const attendanceRate = totalRegistrations > 0
    ? Math.round((totalPresentAttendees / totalRegistrations) * 100)
    : 0;

  const value = {
    workshops,
    registrations,
    loading,
    error,
    refreshData: loadData,
    getWorkshopStats,
    getWorkshopById,
    registerParticipant,
    addWorkshop,
    updateWorkshop,
    deleteWorkshop,
    updateAttendance,
    resetDemoData,
    stats: {
      totalWorkshops,
      totalRegistrations,
      upcomingWorkshops,
      totalPresentAttendees,
      attendanceRate,
    },
  };

  return <WorkshopContext.Provider value={value}>{children}</WorkshopContext.Provider>;
}

export function useWorkshops() {
  const context = useContext(WorkshopContext);
  if (!context) {
    throw new Error('useWorkshops must be used within a WorkshopProvider');
  }
  return context;
}
