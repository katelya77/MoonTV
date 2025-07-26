'use client';

import { useEffect, useRef } from 'react';
import { BackButton } from './BackButton';
import { LogoutButton } from './LogoutButton';
import MobileBottomNav from './MobileBottomNav';
import MobileHeader from './MobileHeader';
import { SettingsButton } from './SettingsButton';
import { ThemeToggle } from './ThemeToggle';
import Sidebar from './Sidebar';

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

      {/* ✅ 主内容区（宽度增强） */}
      <main className="relative max-w-6xl mx-auto w-full px-4 md:px-8 pt-20 pb-[calc(3.5rem+env(safe-area-inset-bottom))] min-h-screen">
        <div className="rounded-xl bg-white/60 dark:bg-gray-800/50 backdrop-blur-lg shadow-lg p-4 md:p-6 animate-fade-in">
          {children}
        </div>
      </main>

      {/* 📱 移动端底部导航 */}
      <div className="md:hidden">
        <MobileBottomNav activePath={activePath} />
      </div>
    </div>
  );
};

export default PageLayout;
