import React from 'react';

export const About = () => {
  return (
    <section id="about" className="section bg-white">
      <div className="section-head reveal reveal-d1">
        <div className="section-label">Who We Are</div>
        <h2>A partner, not just an agency.</h2>
      </div>
      <div className="about-grid">
        <div className="about-text reveal reveal-d2">
          <p>
            rek. is a specialized digital studio focused on high-performance websites, custom web apps, and business automations. We bridge the gap between aesthetics and engineering.
          </p>
          <p>
            Most agencies deliver a template and disappear. We architect tailored solutions designed to scale with your business, optimized for speed, SEO, and conversion from day one.
          </p>
        </div>
        <div className="about-stats">
          <div className="stat-item reveal reveal-d3">
            <div className="stat-num">100<span>%</span></div>
            <div className="stat-label">In-house engineering</div>
          </div>
          <div className="stat-item reveal reveal-d4">
            <div className="stat-num">&lt;1<span>s</span></div>
            <div className="stat-label">Avg. load times</div>
          </div>
        </div>
      </div>
    </section>
  );
};
