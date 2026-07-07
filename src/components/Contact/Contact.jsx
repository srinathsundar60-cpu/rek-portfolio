import React from 'react';

export const Contact = () => {
  return (
    <section id="contact">
      <div className="contact-grid">
        <div className="contact-info reveal">
          <span className="section-label">Contact</span>
          <h2 className="contact-headline">Got an <em>idea?</em></h2>
          <p className="contact-sub">Let's turn it into something real.</p>
          <div className="contact-socials">
            <a href="https://wa.me/919488125235" className="contact-link" target="_blank" rel="noopener noreferrer">
              <span>💬</span> WhatsApp Us
            </a>
            <a href="https://instagram.com/rek.solutions" className="contact-link" target="_blank" rel="noopener noreferrer">
              <span>📸</span> @rek.solutions on Instagram
            </a>
          </div>
        </div>
        <form action="https://formspree.io/f/mreopqgl" method="POST" className="contact-form reveal reveal-d2" id="contactForm">
          <div className="form-group">
            <label htmlFor="cname">Name</label>
            <input type="text" id="cname" name="name" placeholder="Your name" autoComplete="name" required />
          </div>
          <div className="form-group">
            <label htmlFor="cemail">Email</label>
            <input type="email" id="cemail" name="email" placeholder="you@email.com" autoComplete="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="cidea">Project Idea</label>
            <textarea id="cidea" name="message" placeholder="Tell us what you want to build..." required></textarea>
          </div>
          <button type="submit" className="btn-submit" id="submitBtn">Start a Project →</button>
        </form>
      </div>
    </section>
  );
};
