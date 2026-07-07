import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase, supabaseNoPersist, getFriendlyAuthErrorMessage } from '../services/supabase';
import { useToast } from '../context/ToastContext';

export const AccessPortal = () => {
  const { fetchStats } = useOutletContext();
  const { showToast } = useToast();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user);
    });
    loadMembers();
  }, []);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('admin_profiles')
        .select('*')
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      setMembers(data || []);
    } catch (err) {
      showToast('Failed to load members: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (submitting) return; // Prevent duplicate requests

    if (!name || !email || !password) {
      showToast('Please fill out all fields.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      // 1. Sign up the user with the secondary client so we don't drop the current session
      console.log('--- AUTH REQUEST INITIATED: AccessPortal Register ---');
      console.log('Timestamp:', new Date().toISOString());
      console.log('Email:', email);

      const { data: authData, error: authError } = await supabaseNoPersist.auth.signUp({
        email,
        password,
      });

      console.log('--- AUTH REQUEST COMPLETED: AccessPortal Register ---');

      if (authError) throw authError;
      
      const newUserId = authData.user?.id;
      if (!newUserId) {
         // Supabase might have sent a confirmation email, or the user already exists.
         // If it's returning empty user, they might need to go to dashboard.
         throw new Error("Unable to create user ID. User might already exist or require email confirmation.");
      }

      // 2. Insert into admin_profiles
      const { error: insertError } = await supabase
        .from('admin_profiles')
        .insert([{
          id: newUserId,
          name,
          email,
          role: 'admin'
        }]);

      if (insertError) {
        // If profile creation fails, they will exist in Auth but not in profiles.
        throw insertError;
      }

      showToast('Admin member registered successfully!', 'success');
      setName('');
      setEmail('');
      setPassword('');
      
      loadMembers();
      fetchStats();
    } catch (err) {
      const errorMessage = getFriendlyAuthErrorMessage(err);
      showToast('Registration failed: ' + errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (currentUser?.id === id) {
      showToast('You cannot remove your own account.', 'error');
      return;
    }

    if (!window.confirm('Remove this admin member? They will lose dashboard access.')) return;

    try {
      // Note: This only deletes the metadata from admin_profiles. 
      // The actual auth user in Supabase needs to be deleted from the Supabase Dashboard,
      // but deleting the profile removes their dashboard privileges due to RLS/App logic.
      const { error } = await supabase.from('admin_profiles').delete().eq('id', id);
      if (error) throw error;

      showToast('Member removed successfully.', 'success');
      loadMembers();
      fetchStats();
    } catch (err) {
      showToast('Delete failed: ' + err.message, 'error');
    }
  };

  const getInitials = (fullName) => {
    return fullName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  };

  return (
    <div className="tab-panel active">
      {/* Register Profile Form */}
      <div className="admin-card">
        <div className="admin-card-title">
          <span className="title-icon">👥</span>
          Register Admin Profile
        </div>

        <div style={{ padding: '.75rem 1rem', background: 'var(--orange-dim)', borderRadius: '10px', border: '1px solid rgba(242,140,56,.2)', marginBottom: '1.25rem', fontSize: '.82rem', color: 'var(--black)', lineHeight: '1.6' }}>
          <strong>💡 How it works:</strong> You can register a new admin member here directly. A Supabase Auth account will be created automatically, and their profile will be added to the portal.
        </div>

        <form onSubmit={handleRegister} noValidate>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name <span style={{ color: 'var(--orange)' }}>*</span></label>
              <input
                type="text"
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address <span style={{ color: 'var(--orange)' }}>*</span></label>
              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password <span style={{ color: 'var(--orange)' }}>*</span></label>
              <input
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
              />
            </div>
            
            <div className="form-group full-width" style={{ marginTop: '.5rem' }}>
              <button type="submit" className={`btn-primary ${submitting ? 'loading' : ''}`} disabled={submitting}>
                {submitting ? 'Registering...' : 'Register Member'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* List Members */}
      <div className="admin-card">
        <div className="section-header">
          <div className="admin-card-title" style={{ marginBottom: 0 }}>
            <span className="title-icon">🛡️</span>
            Admin Members
          </div>
          <button className="btn-secondary" onClick={loadMembers} style={{ fontSize: '.8rem', padding: '.5rem 1rem' }}>
            🔄 Refresh
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <div className="loading-spinner"></div>
          </div>
        ) : members.length > 0 ? (
          <div className="members-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            {members.map(member => {
              const isSelf = currentUser?.id === member.id;
              return (
                <div key={member.id} className="member-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid var(--grey-mid)', borderRadius: '8px', background: 'var(--white)' }}>
                  <div className="member-avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--black)', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '.9rem' }}>
                    {getInitials(member.name || 'Admin')}
                  </div>
                  <div className="member-info" style={{ flex: 1, minWidth: 0 }}>
                    <div className="member-name" style={{ fontWeight: 600, color: 'var(--black)', fontSize: '.9rem', display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                      {member.name}
                      {isSelf && <span style={{ fontSize: '.7rem', background: 'var(--grey-bg)', padding: '.15rem .4rem', borderRadius: '4px', color: 'var(--grey-text)' }}>You</span>}
                    </div>
                    <div className="member-email" style={{ fontSize: '.8rem', color: 'var(--grey-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {member.email}
                    </div>
                  </div>
                  {!isSelf && (
                    <button 
                      className="btn-danger" 
                      onClick={() => handleDelete(member.id)}
                      style={{ background: 'none', border: 'none', color: '#e53935', cursor: 'pointer', padding: '.4rem' }}
                      title="Remove Member"
                    >
                      ✖
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">No other admin members found.</div>
        )}
      </div>
    </div>
  );
};
