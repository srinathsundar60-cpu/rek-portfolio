import React from 'react';

export const Why = () => {
  return (
    <section id="why">
      <div className="reveal">
        <span className="section-label">Why rek.</span>
        <h2 className="section-title" style={{ color: 'var(--white)' }}>The rek advantage.</h2>
      </div>
      <div className="why-grid">
        <div className="why-card reveal reveal-d1">
          <div className="why-num">01</div>
          <div className="why-icon">💰</div>
          <h3>Affordable</h3>
          <p>Good tech shouldn't be expensive.</p>
        </div>
        <div className="why-card reveal reveal-d2">
          <div className="why-num">02</div>
          <div className="why-icon">⚡</div>
          <h3>Fast</h3>
          <p>We don't waste time.</p>
        </div>
        <div className="why-card reveal reveal-d3">
          <div className="why-num">03</div>
          <div className="why-icon">✨</div>
          <h3>Modern</h3>
          <p>Clean design. Latest tech.</p>
        </div>
        <div className="why-card reveal reveal-d4">
          <div className="why-num">04</div>
          <div className="why-icon">🎯</div>
          <h3>Focused</h3>
          <p>We build what matters.</p>
        </div>
      </div>
    </section>
  );
};
