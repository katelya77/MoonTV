'use client';

import React, { ReactNode, useEffect, useRef } from 'react';
import Sidebar from './sidebar';

// ✅ 粒子背景组件（Canvas 黑客特效）
const HackerParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; r: number; dx: number; dy: number }[] = [];
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 255, 70, 0.8)'; // 绿色黑客风
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });

      requestAnimationFrame(draw);
    };
    draw();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10"></canvas>;
};

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="relative min-h-screen flex flex-col md:flex-row">
      {/* ✅ 黑客风粒子背景 */}
      <HackerParticles />

      {/* ✅ 侧边栏 */}
      <Sidebar />

      {/* ✅ 主内容区：居中 + 16:9 + 四周留白 */}
      <main className="flex-1 flex justify-center items-center p-6 md:p-10 lg:p-16">
        <div className="w-full max-w-[calc(100vh*16/9)] aspect-[16/9] bg-white/70 dark:bg-gray-900/70 rounded-xl shadow-xl backdrop-blur-xl border border-gray-300/40 dark:border-gray-700/40 overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
