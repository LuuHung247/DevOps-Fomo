'use client';

import React, { useEffect, useRef } from 'react';

interface ThreeHeroCanvasProps {
  className?: string;
  theme?: 'amber' | 'cyan' | 'violet' | 'emerald';
}

export const ThreeHeroCanvas: React.FC<ThreeHeroCanvasProps> = ({
  className = '',
  theme = 'cyan',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes for cyber mesh
    const particleCount = Math.min(45, Math.floor((width * height) / 12000));
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      baseAlpha: number;
    }> = [];

    const colors = {
      amber: { r: 245, g: 158, b: 11 },
      cyan: { r: 6, g: 182, b: 212 },
      violet: { r: 168, g: 85, b: 247 },
      emerald: { r: 16, g: 185, b: 129 },
    }[theme];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.2,
        baseAlpha: Math.random() * 0.5 + 0.2,
      });
    }

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    let tick = 0;

    const render = () => {
      tick += 0.01;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw glowing ambient gradient orbs
      const grad1 = ctx.createRadialGradient(
        width * 0.3 + Math.sin(tick) * 40,
        height * 0.4 + Math.cos(tick) * 30,
        10,
        width * 0.3,
        height * 0.4,
        width * 0.45
      );
      grad1.addColorStop(0, `rgba(${colors.r}, ${colors.g}, ${colors.b}, 0.12)`);
      grad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const grad2 = ctx.createRadialGradient(
        mouseX,
        mouseY,
        5,
        mouseX,
        mouseY,
        180
      );
      grad2.addColorStop(0, `rgba(${colors.r}, ${colors.g}, ${colors.b}, 0.15)`);
      grad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // 2. Update & Connect Particles (Constellation mesh)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${colors.r}, ${colors.g}, ${colors.b}, ${p.alpha})`;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 85) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${colors.r}, ${colors.g}, ${colors.b}, ${
              (1 - dist / 85) * 0.18
            })`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
};
