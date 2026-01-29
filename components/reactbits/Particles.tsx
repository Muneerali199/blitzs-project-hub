"use client";

import { useEffect, useRef } from 'react';

const Particles = ({ className }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create particles
    const particleCount = 50;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 20 + 's';
      particle.style.animationDuration = (Math.random() * 10 + 10) + 's';

      // Random color
      const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

      container.appendChild(particle);
      particles.push(particle);
    }

    // Add CSS animation + glow
    const style = document.createElement('style');
    style.textContent = `
      .particle {
        position: absolute;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        pointer-events: none;
        animation: float linear infinite;
        opacity: 0.9;
        will-change: transform, opacity;
        box-shadow: 0 0 8px currentColor, 0 0 18px currentColor;
        mix-blend-mode: screen;
      }

      @keyframes float {
        0% {
          transform: translateY(0px) translateX(0px) rotate(0deg);
          opacity: 0;
        }
        10% {
          opacity: 0.9;
        }
        50% {
          transform: translateY(-50vh) translateX(4vw) rotate(180deg);
        }
        100% {
          transform: translateY(-110vh) translateX(-4vw) rotate(360deg);
          opacity: 0;
        }
      }

      /* Ensure the container covers the viewport when fixed classes aren't applied */
      .particles-viewport {
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 0;
      }
    `;
    document.head.appendChild(style);

    // Debug: log mount and create a visible test particle on localhost only
    try {
      // eslint-disable-next-line no-console
      console.log('[Particles] mounted');
      if (typeof window !== 'undefined' && window.location.hostname.includes('localhost')) {
        const test = document.createElement('div');
        test.className = 'particle test-particle';
        test.style.width = '26px';
        test.style.height = '26px';
        test.style.left = '50%';
        test.style.top = '50%';
        test.style.transform = 'translate(-50%, -50%)';
        test.style.backgroundColor = '#38bdf8';
        test.style.opacity = '0.98';
        test.style.boxShadow = '0 0 24px #38bdf8, 0 0 48px #60a5fa';
        test.style.animationDuration = '8s';
        test.style.zIndex = '1000';
        container.appendChild(test);
        particles.push(test);
      }
    } catch (e) {
      // ignore
    }

    return () => {
      particles.forEach(particle => {
        if (container.contains(particle)) {
          container.removeChild(particle);
        }
      });
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return <div ref={containerRef} className={`${className || ''} particles-viewport`} />;
};

export default Particles;