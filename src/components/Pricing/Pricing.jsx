import React from 'react';

export const Pricing = () => {
  return (
    <section id="pricing">
      <div className="reveal">
        <span className="section-label">Pricing</span>
        <h2 className="section-title">Simple. Transparent.<br />Affordable.</h2>
      </div>
      <div className="pricing-grid">
        <div className="pricing-card reveal reveal-d1">
          <div className="pricing-card-icon">🌐</div>
          <h3>Websites</h3>
          <div className="pricing-amount">₹2,000 <span>/ from</span></div>
        </div>
        <div className="pricing-card reveal reveal-d2">
          <div className="pricing-card-icon">📱</div>
          <h3>Apps</h3>
          <div className="pricing-amount">₹3,000 <span>/ from</span></div>
        </div>
        <div className="pricing-card reveal reveal-d3">
          <div className="pricing-card-icon">⚙️</div>
          <h3>Automations</h3>
          <div className="pricing-amount">₹2,500 <span>/ from</span></div>
        </div>
        <div className="pricing-card reveal reveal-d4">
          <div className="pricing-card-icon">💻</div>
          <h3>Software</h3>
          <div className="pricing-amount">₹2,500 <span>/ from</span></div>
        </div>
      </div>
      <p className="pricing-disclaimer reveal">Final pricing depends on what you need.</p>
    </section>
  );
};
