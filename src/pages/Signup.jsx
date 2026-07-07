import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useToast } from '../context/ToastContext';
import '../styles/admin.css';

export const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [session, setSession] = useState(null);

  const [nameError, setNameError] = useState(false);
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
    if (!name.trim()) {
      setNameError(true);
      valid = false;
    } else {
      setNameError(false);
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError(true);
      valid = false;
    } else {
      setEmailError(false);
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      valid = false;
    } else {
      setPasswordError(false);
    }

    if (!valid) return;

    setLoading(true);

    try {
      // 1. Sign up user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;

      const userId = data.user?.id;
      if (!userId) {
        throw new Error('Registration failed. Check if account already exists.');
      }

      // 2. Add profile to admin_profiles table
      const { error: profileError } = await supabase
        .from('admin_profiles')
        .insert([{
          id: userId,
          name,
          email,
          role: 'admin'
        }]);

      if (profileError) {
        throw profileError;
      }

      showToast('Registration successful! Redirecting to login.', 'success');
      
      // Auto signout just in case Supabase auto-logged them in, so they can sign in cleanly
      await supabase.auth.signOut();
      
      setTimeout(() => {
        navigate('/admin/login');
      }, 1500);

    } catch (err) {
      setLoading(false);
      showToast(err.message || 'Registration failed.', 'error');
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
          
          .login-links {
            display: flex;
            justify-content: space-between;
            margin-top: 1.5rem;
            font-size: 0.85rem;
          }
          
          .login-links a {
            color: var(--grey-text);
            text-decoration: none;
            transition: color 0.2s;
          }
          
          .login-links a:hover {
            color: var(--orange);
          }
        `}
      </style>
      
      <div className="login-bg" aria-hidden="true"></div>

      <div className="login-page">
        <div className="login-card">
          <div className="login-logo">rek<span>.</span></div>
          <p className="login-subtitle">Create Admin Account</p>

          <form className="login-form" id="signupForm" noValidate onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="adminName">Full Name</label>
              <input
                type="text"
                id="adminName"
                name="name"
                placeholder="Your name"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (nameError) setNameError(false);
                }}
              />
              <span className={`field-error ${nameError ? 'show' : ''}`} id="nameError">
                Please enter your name.
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="adminEmail">Email Address</label>
              <input
                type="email"
                id="adminEmail"
                name="email"
                placeholder="you@example.com"
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
                placeholder="At least 6 characters"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError(false);
                }}
              />
              <span className={`field-error ${passwordError ? 'show' : ''}`} id="passwordError">
                Password must be at least 6 characters.
              </span>
            </div>

            <button type="submit" className={`btn-login ${loading ? 'loading' : ''}`} id="signupBtn" disabled={loading}>
              {loading ? '' : 'Sign Up →'}
            </button>
          </form>

          <div className="login-links">
            <Link to="/signin">Already have an account? Sign In</Link>
            <a href="/">← Home</a>
          </div>
        </div>
      </div>
    </>
  );
};
