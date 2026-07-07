import React, { useState, useEffect } from 'react';
import { LOGO_BASE64 } from '../../assets/logoBase64';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    if (menuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  const openMenu = () => {
    setMenuOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.style.overflow = '';
  };

  // Close menu on nav link click
  const handleNavLinkClick = () => {
    closeMenu();
  };

  return (
    <>
      <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
        <a href="#hero" className="nav-logo" aria-label="rek logo">
          <img src={LOGO_BASE64} alt="rek logo" width="100" height="30" />
        </a>

        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#work">Work</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#why">Why Us</a></li>
          <li><a href="#contact" className="nav-cta">Start a Project</a></li>
        </ul>

        {/* Mobile Hamburger Button */}
        <button 
          className={`nav-hamburger ${menuOpen ? 'open' : ''}`} 
          id="hamburger"
          onClick={toggleMenu}
          aria-expanded={menuOpen ? 'true' : 'false'}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Mobile Drawer */}
      <div className={`nav-drawer ${menuOpen ? 'open' : ''}`} id="navDrawer" style={{ display: menuOpen ? 'flex' : 'none' }}>
        <a href="#hero" onClick={handleNavLinkClick}>Home</a>
        <a href="#about" onClick={handleNavLinkClick}>About</a>
        <a href="#services" onClick={handleNavLinkClick}>Services</a>
        <a href="#work" onClick={handleNavLinkClick}>Work</a>
        <a href="#pricing" onClick={handleNavLinkClick}>Pricing</a>
        <a href="#why" onClick={handleNavLinkClick}>Why Us</a>
        <a href="#contact" onClick={handleNavLinkClick}>Start a Project</a>
      </div>
    </>
  );
};
