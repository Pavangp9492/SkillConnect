import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-16 h-16 rounded-2xl bg-[#EAF7EF] text-[#16834A] flex items-center justify-center mb-6 shadow-sm">
        <Compass className="w-8 h-8" />
      </div>
      <span className="text-sm font-bold text-[#16834A] tracking-wider uppercase bg-[#EAF7EF] px-3 py-1 rounded-full mb-3">
        404 Page Not Found
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
        Looking for a Workshop?
      </h1>
      <p className="text-gray-600 text-sm sm:text-base max-w-md mb-8 leading-relaxed">
        We couldn't locate the page you were trying to visit. It might have been moved or the address was typed incorrectly.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/" className="btn-primary text-sm">
          <Home className="w-4 h-4 mr-1.5" /> Return to Home
        </Link>
        <Link to="/workshops" className="btn-secondary text-sm">
          Browse All Workshops
        </Link>
      </div>
    </div>
  );
}
