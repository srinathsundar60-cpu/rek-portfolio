import React from 'react';
import { LOGO_BASE64 } from '../../assets/logoBase64';

export const Footer = () => {
  return (
    <footer className="footer bg-black">
      <div className="footer-top">
        <div className="footer-left">
          <div className="footer-brand reveal reveal-d1">
            <a href="#hero" className="footer-logo">
              <img
                src={LOGO_BASE64}
                alt="rek logo"
                style={{ height: '2.1em', width: 'auto', verticalAlign: 'middle', marginBottom: '0.15em' }}
              />
            </a>
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
              <li><a href="#work">Work</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-col reveal reveal-d3">
            <h4>Connect</h4>
            <ul>
              <li><a href="https://instagram.com/rek.solutions" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a href="https://wa.me/919488125235" target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
              <li><a href="mailto:hello@rek.in">Email us</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-copy">
          © {new Date().getFullYear()} rek.
        </div>
      </div>
    </footer>
  );
};
