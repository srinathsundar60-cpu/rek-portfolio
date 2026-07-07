import React, { useEffect, useRef } from 'react';

export const Cursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const cRingRef = useRef(null);

  useEffect(() => {
    // Only enable custom cursor on devices with fine pointers (mice)
    if (!window.matchMedia('(pointer:fine)').matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const cRing = cRingRef.current;
    if (!dot || !ring || !cRing) return;

    const isLowPower = navigator.hardwareConcurrency != null && navigator.hardwareConcurrency <= 2;

    let mx = 0, my = 0;          // raw mouse position
    let rx = 0, ry = 0;          // smoothed ring position
    let dirty = false;           // only RAF if mouse actually moved
    let rafId = null;
    let paused = false;          // pause when tab is hidden

    const dotStyle = dot.style;
    const ringStyle = ring.style;

    dotStyle.left = '0';
    dotStyle.top = '0';
    ringStyle.left = '0';
    ringStyle.top = '0';

    const onMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      dirty = true;
    };

    document.addEventListener('mousemove', onMouseMove, { passive: true });

    const tick = () => {
      if (!paused) {
        if (dirty || isLowPower) {
          // Dot: instant follow
          dotStyle.transform = `translate(${mx}px,${my}px)`;

          if (!isLowPower) {
            // Ring: lerp for smooth lag effect
            rx += (mx - rx) * 0.12;
            ry += (my - ry) * 0.12;
            ringStyle.transform = `translate(${rx}px,${ry}px)`;
          } else {
            ringStyle.transform = `translate(${mx}px,${my}px)`;
          }

          dirty = false;
        }
        rafId = requestAnimationFrame(tick);
      }
    };

    // Hover effect logic
    const handleMouseOver = (e) => {
      // Find closest anchor or button
      const target = e.target.closest('a, button');
      if (target) {
        cRing.classList.add('expand');
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target.closest('a, button');
      if (target) {
        cRing.classList.remove('expand');
      }
    };

    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });

    // Pause animation loop when tab is not visible
    const onVisibilityChange = () => {
      if (document.hidden) {
        paused = true;
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      } else {
        paused = false;
        dirty = true;
        rafId = requestAnimationFrame(tick);
      }
    };
    
    document.addEventListener('visibilitychange', onVisibilityChange);

    rafId = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div className="cursor" id="cursorDot" aria-hidden="true" ref={dotRef}>
        <div className="cursor-dot"></div>
      </div>
      <div className="cursor" id="cursorRing" aria-hidden="true" ref={ringRef}>
        <div className="cursor-ring" id="cRing" ref={cRingRef}></div>
      </div>
    </>
  );
};
