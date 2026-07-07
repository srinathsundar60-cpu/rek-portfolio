import React from 'react';

export const Contact = () => {
  return (
    <section id="contact" className="section bg-grey" style={{ borderTop: '1px solid var(--grey-mid)' }}>
      <div className="contact-wrap">
        <div className="section-head reveal reveal-d1" style={{ maxWidth: '600px', margin: '0' }}>
          <div className="section-label">Get in Touch</div>
          <h2>Ready to build something great?</h2>
          <p style={{ marginTop: '1rem', color: 'var(--grey-text)', fontSize: '1.1rem', lineHeight: '1.6' }}>
            Whether you have a fully fleshed out project spec or just an idea, we'd love to hear about it.
          </p>
        </div>
        <div className="contact-methods reveal reveal-d2">
          <a href="mailto:hello@rek.in" className="contact-box">
            <div className="c-icon">✉️</div>
            <div className="c-text">
              <div className="c-title">Email Us</div>
              <div className="c-val">hello@rek.in</div>
            </div>
          </a>
          <a href="https://wa.me/919488125235" target="_blank" rel="noopener noreferrer" className="contact-box">
            <div className="c-icon">💬</div>
            <div className="c-text">
              <div className="c-title">WhatsApp</div>
              <div className="c-val">+91 94881 25235</div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};
