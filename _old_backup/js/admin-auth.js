/**
 * js/admin-auth.js
 * ─────────────────────────────────────────────────────────────────
 * Authentication guard and helpers for admin pages.
 * - Guards admin pages: redirects to /admin/login if no session.
 * - Provides logout, toast, and current user utilities.
 *
 * Depends on: config.js, Supabase JS CDN
 * ─────────────────────────────────────────────────────────────────
 */

/* ── INIT SUPABASE CLIENT ── */
const _sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ── CURRENT SESSION (set after guard runs) ── */
let _currentUser = null;

/**
 * Guards the current page: if no authenticated session, redirect to login.
 * Returns the current user object on success.
 * @returns {Promise<Object>} current Supabase user
 */
async function requireAuth() {
  const { data: { session } } = await _sb.auth.getSession();

  if (!session) {
    window.location.replace('/admin/login.html');
    return null;
  }

  _currentUser = session.user;
  return _currentUser;
}

/**
 * Returns the cached current user (after requireAuth has run).
 */
function getCurrentUser() {
  return _currentUser;
}

/**
 * Signs the current user out and redirects to login.
 */
async function adminLogout() {
  await _sb.auth.signOut();
  window.location.replace('/admin/login.html');
}

/* ── TOAST NOTIFICATION SYSTEM ── */

/**
 * Show a toast message.
 * @param {string} message
 * @param {'info'|'success'|'error'} type
 * @param {number} duration ms before auto-dismiss
 */
function showToast(message, type = 'info', duration = 4000) {
  const container = document.getElementById('toastContainer') || createToastContainer();

  const icons = { info: 'ℹ️', success: '✅', error: '❌' };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || '💬'}</span>
    <span class="toast-msg">${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  // Auto-dismiss
  setTimeout(() => {
    toast.classList.add('hiding');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  }, duration);
}

function createToastContainer() {
  const el = document.createElement('div');
  el.id = 'toastContainer';
  document.body.appendChild(el);
  return el;
}

/** Basic HTML escaping for toast messages */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Expose on window for use by other admin scripts */
window.adminAuth = {
  sb: _sb,
  requireAuth,
  getCurrentUser,
  adminLogout,
  showToast,
  escapeHtml,
};
