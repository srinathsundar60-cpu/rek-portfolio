import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useToast } from '../context/ToastContext';
import '../styles/admin.css';

export const AdminLayout = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({ total: 0, visible: 0, hidden: 0, members: 0 });
  const [userEmail, setUserEmail] = useState('Loading…');
  
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Authentication check
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        setUserEmail(session.user.email);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setUserEmail(session.user.email);
      } else {
        setUserEmail('Loading…');
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch metrics/statistics
  const fetchStats = async () => {
    if (!session) return;
    try {
      // Fetch products metrics
      const { data: products, error: pError } = await supabase
        .from('products')
        .select('visible');
      if (pError) throw pError;

      const total = products.length;
      const visible = products.filter((p) => p.visible).length;
      const hidden = total - visible;

      // Fetch team members metrics
      const { count: memberCount, error: mError } = await supabase
        .from('admin_profiles')
        .select('*', { count: 'exact', head: true });
      if (mError) throw mError;

      setStats({ total, visible, hidden, members: memberCount || 0 });
    } catch (err) {
      console.error('Error fetching layout stats:', err.message);
    }
  };

  useEffect(() => {
    if (session) {
      fetchStats();
    }
  }, [session, location.pathname]); // refetch stats when navigate changes

  const handleLogout = async () => {
    showToast('Signing out…', 'info');
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', background: '#0B0B0B', color: '#FAFAFA', justifyContent: 'center', alignItems: 'center', fontFamily: 'Syne, sans-serif' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const isTabActive = (path) => location.pathname === path;

  // Render correct header title
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/admin/dashboard':
        return 'Dashboard';
      case '/admin/products':
        return 'Products';
      case '/admin/visibility':
        return 'Visibility';
      case '/admin/access':
        return 'Access Portal';
      default:
        return 'Admin Panel';
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar Overlay for mobile screen */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} 
        id="sidebarOverlay" 
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`} id="adminSidebar">
        <div className="sidebar-logo">
          <Link to="/admin/dashboard" onClick={closeSidebar}>
            rek<span>.</span> <span className="sidebar-badge">Admin</span>
          </Link>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Management</div>
          <Link 
            to="/admin/products"
            className={isTabActive('/admin/products') ? 'active' : ''}
            onClick={closeSidebar}
          >
            <span className="nav-icon">📦</span> Products
          </Link>
          <Link 
            to="/admin/access"
            className={isTabActive('/admin/access') ? 'active' : ''}
            onClick={closeSidebar}
          >
            <span className="nav-icon">👥</span> Access Portal
          </Link>
          <Link 
            to="/admin/visibility"
            className={isTabActive('/admin/visibility') ? 'active' : ''}
            onClick={closeSidebar}
          >
            <span className="nav-icon">👁️</span> Visibility
          </Link>

          <div className="sidebar-section-label" style={{ marginTop: '1rem' }}>Site</div>
          <a href="/" target="_blank" rel="noopener noreferrer">
            <span className="nav-icon">🌐</span> View Public Site
          </a>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user-info" id="currentUserEmail">{userEmail}</div>
          <button className="btn-logout" id="logoutBtn" onClick={handleLogout}>
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-header-left">
            <button className="btn-sidebar-toggle" id="sidebarToggle" onClick={toggleSidebar} aria-label="Toggle sidebar">
              ☰
            </button>
            <div className="admin-page-title" id="pageTitle">
              {getPageTitle()}
            </div>
          </div>
          <div className="admin-header-actions">
            <a href="/" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ fontSize: '.8rem', padding: '.5rem 1rem' }}>
              🌐 View Site
            </a>
          </div>
        </header>

        <div className="admin-content">
          {/* Summary Stats Grid */}
          <div className="admin-stats">
            <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/products')}>
              <div className="stat-label">Total Projects</div>
              <div className="stat-value" id="statTotal">{stats.total}</div>
            </div>
            <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/visibility')}>
              <div className="stat-label">Visible</div>
              <div className="stat-value" id="statVisible">{stats.visible}</div>
            </div>
            <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/visibility')}>
              <div className="stat-label">Hidden</div>
              <div className="stat-value" id="statHidden">{stats.hidden}</div>
            </div>
            <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/access')}>
              <div className="stat-label">Team Members</div>
              <div className="stat-value" id="statMembers">{stats.members}</div>
            </div>
          </div>

          <Outlet context={{ stats, fetchStats }} />
        </div>
      </main>
    </div>
  );
};
