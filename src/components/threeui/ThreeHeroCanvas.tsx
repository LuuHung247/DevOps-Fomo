'use client';

import React, { useEffect, useRef } from 'react';

interface ThreeHeroCanvasProps {
  className?: string;
  theme?: 'amber' | 'cyan' | 'violet' | 'emerald' | 'multi';
}

export const ThreeHeroCanvas: React.FC<ThreeHeroCanvasProps> = ({
  className = '',
  theme = 'multi',
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

    const particleCount = Math.min(55, Math.floor((width * height) / 10000));
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: { r: number; g: number; b: number };
      alpha: number;
      baseAlpha: number;
    }> = [];

    const colorPalettes = [
      { r: 6, g: 182, b: 212 },   // Electric Cyan
      { r: 245, g: 158, b: 11 },  // Molten Amber
      { r: 16, g: 185, b: 129 },  // Emerald
      { r: 139, g: 92, b: 246 },  // Violet
    ];

    for (let i = 0; i < particleCount; i++) {
      const col = colorPalettes[i % colorPalettes.length];
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 2 + 1,
        color: col,
        alpha: Math.random() * 0.5 + 0.25,
        baseAlpha: Math.random() * 0.5 + 0.25,
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
      tick += 0.008;
      ctx.clearRect(0, 0, width, height);

      // 1. Ambient Dynamic Aurora Glow Backdrops
      const gradCyan = ctx.createRadialGradient(
        width * 0.2 + Math.sin(tick) * 60,
        height * 0.3 + Math.cos(tick * 0.8) * 40,
        20,
        width * 0.2,
        height * 0.3,
        width * 0.5
      );
      gradCyan.addColorStop(0, 'rgba(6, 182, 212, 0.12)');
      gradCyan.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradCyan;
      ctx.fillRect(0, 0, width, height);

      const gradAmber = ctx.createRadialGradient(
        width * 0.8 + Math.cos(tick * 0.7) * 50,
        height * 0.4 + Math.sin(tick) * 40,
        20,
        width * 0.8,
        height * 0.4,
        width * 0.45
      );
      gradAmber.addColorStop(0, 'rgba(245, 158, 11, 0.08)');
      gradAmber.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradAmber;
      ctx.fillRect(0, 0, width, height);

      // Mouse interactive radial highlight
      const gradMouse = ctx.createRadialGradient(
        mouseX,
        mouseY,
        10,
        mouseX,
        mouseY,
        200
      );
      gradMouse.addColorStop(0, 'rgba(6, 182, 212, 0.14)');
      gradMouse.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradMouse;
      ctx.fillRect(0, 0, width, height);

      // 2. Mesh Nodes & Constellation Lines
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.alpha})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${
              (1 - dist / 90) * 0.16
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
