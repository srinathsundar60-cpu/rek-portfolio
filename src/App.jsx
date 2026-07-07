import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { ToastProvider } from './context/ToastContext';

// Public Pages
import { Home } from './pages/Home';

// Admin Layout & Pages
import { AdminLayout } from './layouts/AdminLayout';
import { AdminLogin } from './pages/AdminLogin';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { Visibility } from './pages/Visibility';
import { AccessPortal } from './pages/AccessPortal';

const NotFound = () => (
  <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', background: '#0B0B0B', color: '#FAFAFA', fontFamily: 'Syne, sans-serif' }}>
    <h1 style={{ fontSize: '4rem', margin: 0, color: 'var(--orange)' }}>404</h1>
    <p>Page not found</p>
    <a href="/" style={{ marginTop: '1rem', color: '#FAFAFA', textDecoration: 'underline' }}>Return home</a>
  </div>
);

export const App = () => {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Website */}
          <Route path="/" element={<Home />} />
          
          {/* Admin Authentication */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/signin" element={<AdminLogin />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="visibility" element={<Visibility />} />
            <Route path="access" element={<AccessPortal />} />
          </Route>

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
};

export default App;
