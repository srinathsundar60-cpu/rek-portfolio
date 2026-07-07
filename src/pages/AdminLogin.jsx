import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useToast } from '../context/ToastContext';
import '../styles/admin.css';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [session, setSession] = useState(null);
  
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setSessionLoading(false);
    });
  }, []);

  if (sessionLoading) {
    return (
      <div style={{ display: 'flex', height: '100vh', background: '#0B0B0B', color: '#FAFAFA', justifyContent: 'center', alignItems: 'center' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (session) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    let valid = true;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError(true);
      valid = false;
    } else {
      setEmailError(false);
    }

    if (!password) {
      setPasswordError(true);
      valid = false;
    } else {
      setPasswordError(false);
    }

    if (!valid) return;

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      if (data.session) {
        showToast('Login successful! Redirecting.', 'success');
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 800);
      }
    } catch (err) {
      setLoading(false);
      showToast(err.message || 'Login failed. Please check your credentials.', 'error');
    }
  };

  return (
    <>
      <style>
        {`
          .login-bg {
            position: fixed;
            inset: 0;
            background: var(--black);
            overflow: hidden;
            z-index: 0;
          }

          .login-bg::before {
            content: '';
            position: absolute;
            width: 600px;
            height: 600px;
            background: radial-gradient(circle, rgba(242,140,56,.12) 0%, transparent 70%);
            top: -150px;
            right: -150px;
            border-radius: 50%;
            pointer-events: none;
          }

          .login-bg::after {
            content: '';
            position: absolute;
            width: 400px;
            height: 400px;
            background: radial-gradient(circle, rgba(242,140,56,.07) 0%, transparent 70%);
            bottom: -100px;
            left: -100px;
            border-radius: 50%;
            pointer-events: none;
          }

          .login-page { position: relative; z-index: 1; }

          .login-card {
            animation: cardIn .5s cubic-bezier(0.16,1,0.3,1) forwards;
          }

          @keyframes cardIn {
            from { opacity: 0; transform: translateY(24px) scale(.97); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }

          .field-error {
            font-size: .72rem;
            color: #e53935;
            margin-top: .25rem;
            display: none;
          }

          .field-error.show { display: block; }
        `}
      </style>
      
      <div className="login-bg" aria-hidden="true"></div>

      <div className="login-page">
        <div className="login-card">
          <div className="login-logo">rek<span>.</span></div>
          <p className="login-subtitle">Admin Portal - Sign in to continue</p>

          <form className="login-form" id="loginForm" noValidate onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="adminEmail">Email</label>
              <input
                type="email"
                id="adminEmail"
                name="email"
                placeholder="admin@example.com"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError(false);
                }}
              />
              <span className={`field-error ${emailError ? 'show' : ''}`} id="emailError">
                Please enter a valid email address.
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="adminPassword">Password</label>
              <input
                type="password"
                id="adminPassword"
                name="password"
                placeholder="••••••••"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError(false);
                }}
              />
              <span className={`field-error ${passwordError ? 'show' : ''}`} id="passwordError">
                Password cannot be empty.
              </span>
            </div>

            <button type="submit" className={`btn-login ${loading ? 'loading' : ''}`} id="loginBtn" disabled={loading}>
              {loading ? '' : 'Sign In →'}
            </button>
          </form>

          <a href="/" className="login-back">← Back to site</a>
        </div>
      </div>
    </>
  );
};
