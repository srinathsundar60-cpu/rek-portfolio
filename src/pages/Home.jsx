import React, { useEffect } from 'react';
import { Navbar } from '../components/Navbar/Navbar';
import { Hero } from '../components/Hero/Hero';
import { About } from '../components/About/About';
import { Services } from '../components/Services/Services';
import { Portfolio } from '../components/Portfolio/Portfolio';
import { Pricing } from '../components/Pricing/Pricing';
import { Contact } from '../components/Contact/Contact';
import { Footer } from '../components/Footer/Footer';
import { Cursor } from '../components/Cursor/Cursor';

export const Home = () => {
  // Scroll reveal setup
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    // Apply delays logic dynamically (similar to JS snippet)
    els.forEach(el => {
      ['reveal-d1', 'reveal-d2', 'reveal-d3', 'reveal-d4'].forEach((d, i) => {
        if (el.classList.contains(d)) el.classList.add('js-rd' + (i + 1));
      });
      el.classList.add('js-reveal');
    });

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

    setTimeout(() => {
      els.forEach(el => obs.observe(el));
    }, 120);

    return () => {
      obs.disconnect();
    };
  }, []);

  return (
    <>
      <Cursor />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Portfolio />
        <Pricing />
        <Contact />
      </main>
      <Footer />
    </>
  );
};
