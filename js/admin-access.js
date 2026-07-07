/**
 * js/admin-access.js
 * ─────────────────────────────────────────────────────────────────
 * Admin user/access management for the Access Portal section.
 * Manages admin_profiles table entries.
 *
 * NOTE: Supabase Auth account creation requires the Supabase
 * Dashboard (Auth → Users → Add user). This module manages the
 * admin_profiles metadata table for existing auth users.
 *
 * Depends on: admin-auth.js (window.adminAuth)
 * ─────────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  const { sb, showToast, escapeHtml, getCurrentUser } = window.adminAuth;

  /* ─── CRUD ─── */

  /**
   * Loads all admin profiles, ordered by created_at.
   * @returns {Promise<Array>}
   */
  async function loadAdminProfiles() {
    const { data, error } = await sb
      .from('admin_profiles')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  }

  /**
   * Creates a new admin profile entry.
   * The corresponding Supabase Auth user must be created via Dashboard.
   * @param {{id, name, email, role}} profile
   */
  async function addAdminProfile(profile) {
    const { error } = await sb
      .from('admin_profiles')
      .insert([profile]);

    if (error) throw new Error(error.message);
  }

  /**
   * Updates an admin profile's name/role.
   * @param {string} id UUID (matches auth.users id)
   * @param {{name?, role?}} updates
   */
  async function updateAdminProfile(id, updates) {
    const { error } = await sb
      .from('admin_profiles')
      .update(updates)
      .eq('id', id);

    if (error) throw new Error(error.message);
  }

  /**
   * Removes an admin profile.
   * Prevents deletion of the currently logged-in admin.
   * @param {string} id UUID
   */
  async function removeAdminProfile(id) {
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === id) {
      throw new Error('You cannot remove your own account.');
    }

    const { error } = await sb.from('admin_profiles').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }

  /* ─── Card Rendering ─── */

  /**
   * Builds a member card HTML element.
   * @param {Object} profile
   * @returns {HTMLElement}
   */
  function buildMemberCard(profile) {
    const card = document.createElement('div');
    card.className = 'member-card';
    card.dataset.id = profile.id;

    const currentUser = getCurrentUser();
    const isSelf = currentUser && currentUser.id === profile.id;

    /* Avatar initials from name */
    const initials = (profile.name || 'A')
      .split(' ')
      .map(w => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    const formattedDate = profile.created_at
      ? new Date(profile.created_at).toLocaleDateString('en-IN', {
          year: 'numeric', month: 'short', day: 'numeric'
        })
      : '—';

    card.innerHTML = `
      <div class="member-avatar">${escapeHtml(initials)}</div>
      <div class="member-info-name">${escapeHtml(profile.name || '—')}</div>
      <div class="member-info-email">${escapeHtml(profile.email || '—')}</div>
      <div class="member-role-badge">${escapeHtml(profile.role || 'admin')}</div>
      <div class="member-date">Joined ${escapeHtml(formattedDate)}</div>
      <div class="member-actions">
        <button class="btn-secondary edit-member" data-id="${escapeHtml(profile.id)}" style="font-size:.78rem;padding:.5rem .9rem;">
          ✏️ Edit
        </button>
        ${isSelf
          ? `<span class="text-muted" style="font-size:.75rem;">(you)</span>`
          : `<button class="btn-danger remove-member" data-id="${escapeHtml(profile.id)}">🗑️ Remove</button>`
        }
      </div>
    `;

    return card;
  }

  /* ─── Expose API ─── */
  window.adminAccess = {
    loadAdminProfiles,
    addAdminProfile,
    updateAdminProfile,
    removeAdminProfile,
    buildMemberCard,
  };
})();
