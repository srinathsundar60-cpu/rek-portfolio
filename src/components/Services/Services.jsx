import React from 'react';

export const Services = () => {
  return (
    <section id="services" className="section bg-grey">
      <div className="section-head reveal reveal-d1">
        <div className="section-label">Capabilities</div>
        <h2>End-to-end digital expertise.</h2>
      </div>
      <div className="services-grid">
        <div className="service-card reveal reveal-d2">
          <div className="service-icon">🌐</div>
          <h3>Websites & Landing Pages</h3>
          <p>Lightning-fast, SEO-optimized sites that convert visitors into customers. Built with modern stacks.</p>
        </div>
        <div className="service-card reveal reveal-d3">
          <div className="service-icon">📱</div>
          <h3>Web & Mobile Apps</h3>
          <p>Complex interactive web applications with secure databases, authentication, and fluid user experiences.</p>
        </div>
        <div className="service-card reveal reveal-d4">
          <div className="service-icon">⚡</div>
          <h3>Automations</h3>
          <p>Streamline your business. We connect APIs, set up webhooks, and eliminate repetitive manual tasks.</p>
        </div>
      </div>
    </section>
  );
};
