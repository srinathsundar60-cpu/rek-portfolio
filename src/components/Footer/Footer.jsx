import React from 'react';
import { LOGO_BASE64 } from '../../assets/logoBase64';

export const Footer = () => {
  return (
    <footer>
      <div className="footer-main">
        <div className="footer-left">
          <div className="reveal">
            <span className="footer-brand-logo" aria-label="rek logo">
              <img
                src={LOGO_BASE64}
                alt="rek logo"
                style={{ height: '2.1em', width: 'auto', verticalAlign: 'middle', marginBottom: '0.15em' }}
              />
            </span>
            <p className="footer-tagline">Building digital products that work.</p>
          </div>
          <div className="footer-col reveal reveal-d1">
            <h4>Services</h4>
            <ul>
              <li><a href="#services">Websites</a></li>
              <li><a href="#services">Apps</a></li>
              <li><a href="#services">Automations</a></li>
              <li><a href="#services">Software</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-right">
          <div className="footer-col reveal reveal-d2">
            <h4>Pages</h4>
            <ul>
              <li><a href="#hero">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#work">Portfolio</a></li>
              <li><a href="#pricing">Pricing</a></li>
            </ul>
          </div>
          <div className="footer-col reveal reveal-d3">
            <h4>Connect</h4>
            <ul>
              <li><a href="https://wa.me/919488125235" target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
              <li><a href="mailto:hello@rek.in">hello@rek.in</a></li>
              <li><a href="https://instagram.com/rek.solutions" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom reveal reveal-d4">
        <p>© 2026 rek.solutions. All rights reserved.</p>
        <div className="footer-bottom-links">
          <a href="#contact">Privacy</a>
          <a href="#contact">Terms</a>
        </div>
      </div>
    </footer>
  );
};
