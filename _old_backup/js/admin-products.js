/**
 * js/admin-products.js
 * ─────────────────────────────────────────────────────────────────
 * Product CRUD operations for the admin dashboard.
 * - Image validation (16:9, max 2MB, allowed types)
 * - Supabase Storage upload
 * - products table insert / update / delete
 * - Card rendering for the admin products list
 *
 * Depends on: admin-auth.js (window.adminAuth)
 * ─────────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  const { sb, showToast, escapeHtml } = window.adminAuth;

  /* ─── Constants ─── */
  const BUCKET = 'products';
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB
  const ASPECT_TOLERANCE = 0.04;          // ±4% of 16:9

  /* ─── Image Validation ─── */

  /**
   * Validates an image File object.
   * Checks type, size, and 16:9 aspect ratio.
   * @param {File} file
   * @returns {Promise<{ok: boolean, error?: string}>}
   */
  function validateImage(file) {
    return new Promise((resolve) => {
      // Type check
      if (!ALLOWED_TYPES.includes(file.type)) {
        return resolve({ ok: false, error: 'Only JPG, JPEG, PNG, and WebP images are allowed.' });
      }

      // Size check
      if (file.size > MAX_SIZE_BYTES) {
        const mb = (file.size / 1024 / 1024).toFixed(2);
        return resolve({ ok: false, error: `Image is ${mb} MB. Maximum allowed is 2 MB.` });
      }

      // Aspect ratio check (16:9 = 1.7778)
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        const ratio = img.naturalWidth / img.naturalHeight;
        const target = 16 / 9;
        if (Math.abs(ratio - target) > ASPECT_TOLERANCE) {
          return resolve({
            ok: false,
            error: `Image must be 16:9 ratio (e.g. 1280×720, 1920×1080). Your image is ${img.naturalWidth}×${img.naturalHeight}.`
          });
        }
        resolve({ ok: true });
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({ ok: false, error: 'Could not read the image file. Please try another.' });
      };
      img.src = url;
    });
  }

  /**
   * Uploads a validated image File to Supabase Storage.
   * Returns the public URL.
   * @param {File} file
   * @returns {Promise<string>} public URL
   */
  async function uploadImage(file) {
    const ext  = file.name.split('.').pop().toLowerCase();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await sb.storage
      .from(BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false });

    if (uploadError) throw new Error(uploadError.message);

    const { data } = sb.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  }

  /* ─── CRUD Operations ─── */

  /**
   * Inserts a new product into the products table.
   * @param {{title, description, image_url, product_url}} data
   * @returns {Promise<Object>} inserted row
   */
  async function addProduct(data) {
    const { data: row, error } = await sb
      .from('products')
      .insert([{ ...data, visible: true }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return row;
  }

  /**
   * Updates an existing product.
   * @param {string} id UUID
   * @param {Object} updates
   */
  async function updateProduct(id, updates) {
    const { error } = await sb
      .from('products')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw new Error(error.message);
  }

  /**
   * Deletes a product and its associated storage file.
   * @param {string} id UUID
   * @param {string} imageUrl  full public URL of the image
   */
  async function deleteProduct(id, imageUrl) {
    /* Extract storage path from public URL */
    try {
      const url = new URL(imageUrl);
      const parts = url.pathname.split(`/object/public/${BUCKET}/`);
      if (parts.length === 2) {
        await sb.storage.from(BUCKET).remove([parts[1]]);
      }
    } catch (_) { /* ignore storage cleanup errors */ }

    const { error } = await sb.from('products').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }

  /**
   * Toggles the visibility of a product.
   * @param {string} id UUID
   * @param {boolean} visible
   */
  async function toggleVisibility(id, visible) {
    const { error } = await sb
      .from('products')
      .update({ visible, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw new Error(error.message);
  }

  /**
   * Fetches ALL products (no visibility filter) for admin use.
   * @returns {Promise<Array>}
   */
  async function loadAllProducts() {
    const { data, error } = await sb
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  }

  /* ─── Card Rendering ─── */

  /**
   * Builds an admin product card HTML element.
   * @param {Object} product
   * @returns {HTMLElement}
   */
  function buildProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-admin-card';
    card.dataset.id = product.id;

    const checkedAttr = product.visible ? 'checked' : '';
    const badgeClass  = product.visible ? 'visible' : 'hidden';
    const badgeText   = product.visible ? '● Visible' : '○ Hidden';

    card.innerHTML = `
      <div class="product-admin-img">
        <img src="${escapeHtml(product.image_url)}" alt="${escapeHtml(product.title)}" loading="lazy" onerror="this.style.opacity='.3'">
      </div>
      <div class="product-admin-body">
        <div class="product-admin-title" title="${escapeHtml(product.title)}">${escapeHtml(product.title)}</div>
        <div class="product-admin-desc">${escapeHtml(product.description)}</div>
        <div class="product-admin-actions">
          <div class="toggle-wrap">
            <label class="toggle-switch" title="Toggle visibility">
              <input type="checkbox" ${checkedAttr} data-id="${escapeHtml(product.id)}" class="visibility-toggle">
              <span class="toggle-track"></span>
            </label>
            <span class="visibility-badge ${badgeClass}">${badgeText}</span>
          </div>
          <div class="flex-row">
            <button class="btn-icon edit-product" data-id="${escapeHtml(product.id)}" title="Edit">✏️</button>
            <button class="btn-icon danger delete-product" data-id="${escapeHtml(product.id)}" title="Delete">🗑️</button>
          </div>
        </div>
      </div>
    `;

    /* Visibility toggle handler */
    card.querySelector('.visibility-toggle').addEventListener('change', async (e) => {
      const newVal = e.target.checked;
      const badge  = card.querySelector('.visibility-badge');
      try {
        await toggleVisibility(product.id, newVal);
        badge.className = `visibility-badge ${newVal ? 'visible' : 'hidden'}`;
        badge.textContent = newVal ? '● Visible' : '○ Hidden';
        product.visible = newVal;
        showToast(`"${product.title}" is now ${newVal ? 'visible' : 'hidden'} on the site.`, 'success');
      } catch (err) {
        e.target.checked = !newVal; // revert
        showToast('Failed to update visibility: ' + err.message, 'error');
      }
    });

    return card;
  }

  /* ─── Expose API ─── */
  window.adminProducts = {
    validateImage,
    uploadImage,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleVisibility,
    loadAllProducts,
    buildProductCard,
  };
})();
