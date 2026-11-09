
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  Info,
  Loader2
} from 'lucide-react';

export default function AdminLoginPage() {
  const { login, isAdmin, loading: authLoading } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const from = location.state?.from?.pathname || '/admin';

  // Wait until authentication status is checked
  if (authLoading) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-[#F7FAF8]">
        <Loader2 className="w-8 h-8 animate-spin text-[#16834A]" />
      </div>
    );
  }

  // Redirect existing administrators
  if (isAdmin) {
    return (
      <RedirectToAdmin navigate={navigate} from={from} />
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please enter your administrator email.');
      return;
    }

    if (!password) {
      setError('Please enter your administrator password.');
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err.message || 'Authentication failed. Please verify your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#F7FAF8] flex flex-col justify-center py-12 sm:px-6 lg:px-8">

      <div className="sm:mx-auto sm:w-full sm:max-w-md">

        {/* Brand Header */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#16834A] to-[#105C35] flex items-center justify-center text-white shadow-lg shadow-[#16834A]/25 mx-auto mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Administrator Portal
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Secure access to workshop curation, registrations & attendance
          </p>
        </div>

        {/* Login Card */}
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="card-base p-8 shadow-md">

            {/* Error Message */}
            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label
                  htmlFor="admin-email"
                  className="block text-sm font-semibold text-gray-900 mb-1.5"
                >
                  Administrator Email
                </label>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-4 h-4" />
                  </div>

                  <input
                    id="admin-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#16834A] focus:ring-2 focus:ring-[#16834A]/20 text-sm text-gray-900 outline-none transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-sm font-semibold text-gray-900 mb-1.5"
                >
                  Password
                </label>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>

                  <input
                    id="admin-password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#16834A] focus:ring-2 focus:ring-[#16834A]/20 text-sm text-gray-900 outline-none transition"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-sm font-bold shadow-md shadow-[#16834A]/20 disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying Credentials...
                  </span>
                ) : (
                  <span className="flex items-center gap-2 justify-center">
                    Sign In to Admin Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </button>

            </form>

            {/* Security Information */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-start gap-2 text-xs text-gray-500">
                <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />

                <span>
                  Secure administrator access. Only accounts with an
                  authorized administrator role can access the dashboard.
                </span>
              </div>
            </div>

          </div>

          {/* Return Home */}
          <div className="text-center mt-6">
            <Link
              to="/"
              className="text-sm font-medium text-gray-600 hover:text-[#16834A]"
            >
              &larr; Return to Public SkillConnect Home
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

// Small redirect component
function RedirectToAdmin({ navigate, from }) {
  React.useEffect(() => {
    navigate(from, { replace: true });
  }, [navigate, from]);

  return null;
}
