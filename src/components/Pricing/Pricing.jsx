import React from 'react';

export const Pricing = () => {
  return (
    <section id="pricing" className="section bg-white">
      <div className="section-head reveal reveal-d1">
        <div className="section-label">Investment</div>
        <h2>Transparent pricing.<br />No surprises.</h2>
      </div>
      <div className="pricing-grid">
        <div className="price-card reveal reveal-d2">
          <div className="price-title">Static Sites</div>
          <div className="price-amt">From ₹5k</div>
          <p className="price-desc">Perfect for portfolios, landing pages, and small businesses needing an online presence.</p>
          <ul className="price-features">
            <li>Custom Design</li>
            <li>Mobile Responsive</li>
            <li>SEO Optimized</li>
            <li>Fast Load Times</li>
          </ul>
          <a href="#contact" className="btn-primary" style={{ width: '100%' }}>Get a Quote</a>
        </div>
        <div className="price-card popular reveal reveal-d3">
          <div className="popular-badge">Most Popular</div>
          <div className="price-title">Web Apps</div>
          <div className="price-amt">From ₹12k</div>
          <p className="price-desc">Data-driven applications with user authentication, databases, and custom logic.</p>
          <ul className="price-features">
            <li>React / Next.js</li>
            <li>Supabase / Firebase</li>
            <li>Admin Dashboards</li>
            <li>API Integrations</li>
          </ul>
          <a href="#contact" className="btn-primary" style={{ width: '100%', background: 'var(--white)', color: 'var(--black)' }}>Get a Quote</a>
        </div>
        <div className="price-card reveal reveal-d4">
          <div className="price-title">Automations</div>
          <div className="price-amt">Custom</div>
          <p className="price-desc">Backend scripts and workflow automations to save your team hundreds of hours.</p>
          <ul className="price-features">
            <li>Webhook Listeners</li>
            <li>CRM Integrations</li>
            <li>Data Scraping</li>
            <li>Scheduled Tasks</li>
          </ul>
          <a href="#contact" className="btn-primary" style={{ width: '100%' }}>Discuss Needs</a>
        </div>
      </div>
    </section>
  );
};
