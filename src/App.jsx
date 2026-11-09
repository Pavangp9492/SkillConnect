import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WorkshopProvider } from './context/WorkshopContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DemoBanner from './components/DemoBanner';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import WorkshopsPage from './pages/WorkshopsPage';
import WorkshopDetailPage from './pages/WorkshopDetailPage';
import RegisterPage from './pages/RegisterPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import ManageWorkshopsPage from './pages/ManageWorkshopsPage';
import ManageRegistrationsPage from './pages/ManageRegistrationsPage';
import NotFoundPage from './pages/NotFoundPage';

// Scroll to top helper on navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WorkshopProvider>
          <div className="flex flex-col min-h-screen bg-[#F7FAF8] text-[#1F2937]">
            <ScrollToTop />
            <DemoBanner />
            <Navbar />
            
            <main className="flex-1">
              <Routes>
                {/* Public Participant Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/workshops" element={<WorkshopsPage />} />
                <Route path="/workshops/:id" element={<WorkshopDetailPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Admin Auth Route */}
                <Route path="/admin/login" element={<AdminLoginPage />} />

                {/* Protected Administrator Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/workshops"
                  element={
                    <ProtectedRoute>
                      <ManageWorkshopsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/registrations"
                  element={
                    <ProtectedRoute>
                      <ManageRegistrationsPage />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </WorkshopProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
