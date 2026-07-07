/**
 * js/portfolio.js
 * ─────────────────────────────────────────────────────────────────
 * Fetches visible products from Supabase and renders them into the
 * #portfolioGrid container using the exact same HTML structure as
 * the original hardcoded cards (no visual change).
 *
 * Depends on: config.js, Supabase JS CDN
 * ─────────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  /* ── Guard: only run if grid exists and Supabase is loaded ── */
  const grid = document.getElementById('portfolioGrid');
  if (!grid) return;

  if (typeof supabase === 'undefined' || typeof SUPABASE_URL === 'undefined') {
    console.warn('[portfolio.js] Supabase not loaded or config.js missing credentials.');
    grid.innerHTML = getEmptyState('Configuration needed');
    return;
  }

  if (SUPABASE_URL === 'YOUR_SUPABASE_URL') {
    console.warn('[portfolio.js] Please fill in your Supabase credentials in js/config.js');
    grid.innerHTML = getEmptyState('Connect Supabase to load projects');
    return;
  }

  /* ── Init Supabase client ── */
  const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  /* ── Fetch and render on DOM ready ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fetchProducts);
  } else {
    fetchProducts();
  }

  /**
   * Fetches all products where visible = true, ordered newest first.
   * Only visible products are returned by the RLS policy; this filter
   * is a belt-and-suspenders guard.
   */
  async function fetchProducts() {
    try {
      const { data: products, error } = await client
        .from('products')
        .select('id, title, description, image_url, product_url, created_at')
        .eq('visible', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!products || products.length === 0) {
        grid.innerHTML = getEmptyState('Projects coming soon — check back soon!');
        return;
      }

      renderProducts(products);
    } catch (err) {
      console.error('[portfolio.js] Error fetching products:', err.message);
      /* On error: fall back to empty state (no broken UI) */
      grid.innerHTML = getEmptyState('Unable to load projects right now.');
    }
  }

  /**
   * Renders product cards into the grid.
   * Structure matches the original hardcoded cards exactly.
   * @param {Array} products
   */
  function renderProducts(products) {
    /* Clear skeletons */
    grid.innerHTML = '';

    products.forEach((product, index) => {
      const delay = ['reveal-d1', 'reveal-d2', 'reveal-d3', 'reveal-d4'][index % 4];
      const card = document.createElement('div');
      card.className = `portfolio-card reveal ${delay}`;

      /* Sanitize to prevent XSS */
      const title       = escapeHtml(product.title);
      const description = escapeHtml(product.description);
      const imgUrl      = escapeHtml(product.image_url);
      const productUrl  = escapeHtml(product.product_url);

      card.innerHTML = `
        <div class="portfolio-preview" style="background:linear-gradient(135deg,#1a1a1a,#2a2a2a);">
          <div class="portfolio-preview-inner">
            <img
              src="${imgUrl}"
              alt="${title}"
              width="400"
              height="225"
              loading="lazy"
              style="width:100%;height:100%;object-fit:cover;"
              onerror="this.style.display='none'"
            >
          </div>
          <div class="portfolio-overlay"></div>
          <div class="portfolio-status">Live</div>
        </div>
        <div class="portfolio-body">
          <p class="portfolio-cat">Project</p>
          <h3>${title}</h3>
          <p>${description}</p>
          <a
            href="${productUrl}"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-ghost"
          >View Project →</a>
        </div>
      `;

      grid.appendChild(card);
    });

    /* Re-run scroll reveal for dynamically added cards */
    activateReveal();
  }

  /**
   * Activates the .reveal scroll animation on newly rendered cards.
   * Mirrors the logic in index.html's scroll reveal block.
   */
  function activateReveal() {
    if (!('IntersectionObserver' in window)) return;

    const newCards = grid.querySelectorAll('.reveal:not(.js-reveal)');
    newCards.forEach(el => {
      ['reveal-d1', 'reveal-d2', 'reveal-d3', 'reveal-d4'].forEach((d, i) => {
        if (el.classList.contains(d)) el.classList.add('js-rd' + (i + 1));
      });
      el.classList.add('js-reveal');
    });

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

    setTimeout(() => newCards.forEach(el => obs.observe(el)), 80);
  }

  /** Returns empty-state HTML for the grid */
  function getEmptyState(message) {
    return `<div class="portfolio-empty"><span>🚀</span>${escapeHtml(message)}</div>`;
  }

  /** Basic HTML escape to prevent XSS from database content */
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
})();
