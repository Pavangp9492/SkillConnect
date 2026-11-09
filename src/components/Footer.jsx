import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Mail, Phone, MapPin, Heart, Shield, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand & Purpose */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#16834A] to-[#105C35] flex items-center justify-center text-white shadow-md">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Skill<span className="text-emerald-400">Connect</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Empowering grassroots communities and rural villages through free, accessible, and practical skill-building workshops. Learn computer skills, organic farming, tailoring, and entrepreneurship.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <Shield className="w-4 h-4" />
              <span>Certified Community Skill Initiative</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/workshops" className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1">
                  Browse Workshops
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1">
                  Register for a Workshop
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1">
                  Administrator Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Workshop Domains */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Workshop Focus Areas</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Basic Computer & IT Skills
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Digital Literacy & UPI for Seniors
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Vocational Tailoring & Craft
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Organic Farming & Soil Health
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                First Aid & Emergency Response
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Rural Small Business Skills
              </li>
            </ul>
          </div>

          {/* Community Help & Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Community Helpdesk</h4>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Panchayat Community Center, Main Gram Vikas Marg</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Toll-Free Helpline: 1800-425-SKILL (75455)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>support@skillconnect.org</span>
              </div>
            </div>
            <div className="mt-5 p-3 rounded-lg bg-gray-800/80 border border-gray-700/60 text-xs text-gray-300">
              <span className="text-emerald-400 font-semibold">Free Access Notice:</span> All community workshops are 100% free of cost for local residents.
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} SkillConnect Community Initiative. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for local community development
            </span>
            <span>•</span>
            <Link to="/admin/login" className="text-gray-400 hover:text-emerald-400">
              Admin Gateway
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
