import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Compass, 
  BookOpen, 
  UserCheck, 
  LogOut, 
  LogIn, 
  Menu, 
  X, 
  ShieldCheck, 
  Sparkles,
  ClipboardList,
  CalendarDays
} from 'lucide-react';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
      isActive
        ? 'text-[#105C35] bg-[#EAF7EF] font-semibold'
        : 'text-gray-700 hover:text-[#16834A] hover:bg-gray-50'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
      isActive
        ? 'text-[#105C35] bg-[#EAF7EF] font-semibold'
        : 'text-gray-700 hover:text-[#16834A] hover:bg-gray-50'
    }`;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#16834A] rounded-lg p-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#16834A] to-[#105C35] flex items-center justify-center text-white shadow-md shadow-[#16834A]/20 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-gray-900">Skill<span className="text-[#16834A]">Connect</span></span>
              </div>
              <p className="text-[10px] text-gray-500 font-medium tracking-wide uppercase">Community Workshops</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/workshops" className={navLinkClass}>
              Workshops
            </NavLink>
            <NavLink to="/register" className={navLinkClass}>
              Register
            </NavLink>

            {/* Admin Management Links */}
            {isAdmin && (
              <div className="flex items-center gap-1 ml-2 pl-3 border-l border-gray-200">
                <NavLink to="/admin" end className={navLinkClass}>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#16834A]" />
                    <span>Dashboard</span>
                  </div>
                </NavLink>
                <NavLink to="/admin/workshops" className={navLinkClass}>
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="w-4 h-4 text-gray-500" />
                    <span>Manage Workshops</span>
                  </div>
                </NavLink>
                <NavLink to="/admin/registrations" className={navLinkClass}>
                  <div className="flex items-center gap-1.5">
                    <ClipboardList className="w-4 h-4 text-gray-500" />
                    <span>Registrations</span>
                  </div>
                </NavLink>
              </div>
            )}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAdmin ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs font-semibold text-gray-900 leading-none">
                    {user?.full_name || 'Admin'}
                  </p>
                  <span className="inline-block px-1.5 py-0.5 mt-0.5 text-[10px] font-semibold tracking-wider text-[#105C35] bg-[#EAF7EF] rounded">
                    ADMIN
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/admin/login"
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-[#16834A] hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Admin Login</span>
                </Link>
                <Link
                  to="/workshops"
                  className="btn-primary text-sm !py-2 !px-4 shadow-sm"
                >
                  <span>Find Workshops</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#16834A]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-2 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-150">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            Home
          </NavLink>
          <NavLink
            to="/workshops"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            Explore Workshops
          </NavLink>
          <NavLink
            to="/register"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            Register for Workshop
          </NavLink>

          {isAdmin ? (
            <div className="pt-3 border-t border-gray-100 space-y-1">
              <div className="px-4 py-2 bg-[#EAF7EF] rounded-lg mb-2">
                <p className="text-xs text-gray-600">Logged in as Administrator</p>
                <p className="text-sm font-bold text-[#105C35]">{user?.email || 'admin@skillconnect.org'}</p>
              </div>
              <NavLink
                to="/admin"
                end
                onClick={() => setMobileMenuOpen(false)}
                className={mobileNavLinkClass}
              >
                Admin Dashboard
              </NavLink>
              <NavLink
                to="/admin/workshops"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileNavLinkClass}
              >
                Manage Workshops
              </NavLink>
              <NavLink
                to="/admin/registrations"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileNavLinkClass}
              >
                Manage Registrations
              </NavLink>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 px-4 text-center rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Admin Portal Login
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
