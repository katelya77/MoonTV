'use client';

import { useEffect, useRef } from 'react';
import { BackButton } from './BackButton';
import { LogoutButton } from './LogoutButton';
import MobileBottomNav from './MobileBottomNav';
import MobileHeader from './MobileHeader';
import { SettingsButton } from './SettingsButton';
import { ThemeToggle } from './ThemeToggle';
import Sidebar from './Sidebar';
import React, { ReactNode, useEffect, useRef } from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
  activePath?: string;
}

/* ✅ 粒子背景组件 */
const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > w) p.dx *= -1;
        if (p.y < 0 || p.y > h) p.dy *= -1;
      });
      requestAnimationFrame(draw);
    };
    draw();

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10" />;
};

/* ✅ Vercel 风格流动光晕 */
const GlowBackground = () => (
  <div className="absolute inset-0 -z-20">
    <div className="absolute w-[600px] h-[600px] bg-green-400/30 rounded-full blur-3xl animate-pulse top-[-200px] left-[-200px]" />
    <div className="absolute w-[500px] h-[500px] bg-purple-400/30 rounded-full blur-3xl animate-ping bottom-[-150px] right-[-150px]" />
  </div>
);

const PageLayout = ({ children, activePath = '/' }: PageLayoutProps) => {
  const showBackButton = ['/play'].includes(activePath);

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      
      {/* 🌌 背景层 */}
      <GlowBackground />
      <ParticleBackground />

      {/* 📱 移动端头部 */}
      <MobileHeader showBackButton={showBackButton} />

      {/* 💻 桌面导航 */}
      <header className="hidden md:flex fixed top-0 left-0 w-full z-30 backdrop-blur-md bg-white/60 dark:bg-gray-900/40 shadow-md border-b border-gray-300 dark:border-gray-700 px-6 py-3 justify-between items-center">
        <div className="flex gap-6">
          <Sidebar activePath={activePath} horizontal />
        </div>
        <div className="flex items-center gap-3">
          {showBackButton && <BackButton />}
          <SettingsButton />
          <LogoutButton />
          <ThemeToggle />
        </div>
      </header>

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

      {/* 📱 移动端底部导航 */}
      <div className="md:hidden">
        <MobileBottomNav activePath={activePath} />
      </div>
    </div>
  );
};

export default PageLayout;
