import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Database, Sparkles, X, KeyRound, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DemoBanner() {
  const { isDemoMode, isAdmin, demoLogin } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  if (!isDemoMode || dismissed) return null;

  return (
    <aside aria-label="Demo Mode Notice" className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white text-xs sm:text-sm py-2 px-4 shadow-inner relative z-40">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-emerald-200">Demonstration Mode Active:</span>
          <span className="text-emerald-100 hidden sm:inline">
            Using built-in community workshops & mock storage. All features (search, registration, admin CRUD & attendance) are fully functional.
          </span>
          <span className="text-emerald-100 sm:hidden">
            Local demo mode active. All features fully functional.
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {!isAdmin ? (
            <button
              onClick={() => demoLogin()}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded text-xs font-medium transition inline-flex items-center gap-1 shadow-sm"
              title="Click to instantly sign in as demo administrator without typing"
            >
              <KeyRound className="w-3.5 h-3.5" />
              1-Click Admin Sign-In
            </button>
          ) : (
            <Link
              to="/admin"
              className="bg-emerald-500 text-emerald-950 font-semibold px-2.5 py-1 rounded text-xs transition hover:bg-emerald-400"
            >
              Open Admin Dashboard &rarr;
            </Link>
          )}

          <button
            onClick={() => setDismissed(true)}
            className="text-emerald-300 hover:text-white p-1 rounded transition"
            aria-label="Dismiss banner"
            title="Dismiss notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
