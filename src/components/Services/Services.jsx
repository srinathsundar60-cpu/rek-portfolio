import React from 'react';

export const Services = () => {
  return (
    <section id="services">
      <div className="reveal">
        <span className="section-label">What we do</span>
        <h2 className="section-title">Services built for<br />the modern web.</h2>
      </div>
      <div className="services-grid">
        <div className="service-card reveal reveal-d1">
          <div className="service-icon">🌐</div>
          <h3>Websites</h3>
          <p>Clean, responsive, built to convert.</p>
          <span className="service-price">Starting from ₹2,000</span>
        </div>
        <div className="service-card reveal reveal-d2">
          <div className="service-icon">📱</div>
          <h3>Apps</h3>
          <p>Fast, functional, and user-focused.</p>
          <span className="service-price">Starting from ₹3,000</span>
        </div>
        <div className="service-card reveal reveal-d3">
          <div className="service-icon">⚙️</div>
          <h3>Automations</h3>
          <p>Save time. Reduce manual work. Scale smarter.</p>
          <span className="service-price">Starting from ₹2,500</span>
        </div>
        <div className="service-card reveal reveal-d4">
          <div className="service-icon">💻</div>
          <h3>Custom Software</h3>
          <p>Built exactly for your needs. Nothing extra.</p>
          <span className="service-price">Starting from ₹2,500</span>
        </div>
      </div>
    </section>
  );
};
