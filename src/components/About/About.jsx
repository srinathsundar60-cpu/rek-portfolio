import React from 'react';

export const About = () => {
  return (
    <section id="about">
      <div className="reveal">
        <span className="section-label">Who we are</span>
        <h2 className="section-title">We're rek.</h2>
      </div>
      <div className="about-grid">
        <div className="about-text reveal reveal-d1">
          <p>A <strong>student-led team</strong> building powerful digital products. No fluff. No overpricing. Just clean work that gets results.</p>
          <p>We move fast, think smart, and ship quality.</p>
        </div>
        <div className="about-pills reveal reveal-d2">
          <div className="about-pill">
            <div className="about-pill-icon">⚡</div>
            <div className="about-pill-text">
              <h4>Fast Delivery</h4>
              <p>No endless delays. Your product ships on time.</p>
            </div>
          </div>
          <div className="about-pill">
            <div className="about-pill-icon">💰</div>
            <div className="about-pill-text">
              <h4>Cost-Effective</h4>
              <p>Premium quality. Student prices.</p>
            </div>
          </div>
          <div className="about-pill">
            <div className="about-pill-icon">🎯</div>
            <div className="about-pill-text">
              <h4>Quality-First</h4>
              <p>Clean code. Polished design. Tested thoroughly.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
