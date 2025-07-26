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

/* ✨ 增强粒子背景组件 */
const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 3 + 1,
      dx: (Math.random() - 0.5) * 1,
      dy: (Math.random() - 0.5) * 1,
      opacity: Math.random() * 0.5 + 0.1,
      color: `hsl(${Math.random() * 60 + 120}, 70%, 60%)`, // 绿色系
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      
      // 绘制连接线
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
          if (distance < 100) {
            ctx.strokeStyle = `rgba(34, 197, 94, ${0.1 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      // 绘制粒子
      particles.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        
        // 更新位置
        p.x += p.dx;
        p.y += p.dy;
        p.opacity += (Math.random() - 0.5) * 0.01;
        p.opacity = Math.max(0.1, Math.min(0.6, p.opacity));
        
        // 边界反弹
        if (p.x < 0 || p.x > w) p.dx *= -1;
        if (p.y < 0 || p.y > h) p.dy *= -1;
      });
      
      ctx.globalAlpha = 1;
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

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 opacity-60 dark:opacity-40" />;
};

/* 🌟 多层次光晕背景 */
const EnhancedGlowBackground = () => (
  <div className="absolute inset-0 -z-20 overflow-hidden">
    {/* 主光晕 */}
    <div className="absolute w-[800px] h-[800px] bg-gradient-to-r from-green-400/20 via-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse top-[-300px] left-[-300px]" />
    <div className="absolute w-[600px] h-[600px] bg-gradient-to-l from-purple-400/25 via-pink-400/25 to-green-400/25 rounded-full blur-3xl animate-ping bottom-[-200px] right-[-200px] animation-delay-1000" />
    
    {/* 次级光晕 */}
    <div className="absolute w-[400px] h-[400px] bg-cyan-400/15 rounded-full blur-2xl animate-bounce top-1/4 right-1/4 animation-delay-2000" />
    <div className="absolute w-[300px] h-[300px] bg-yellow-400/20 rounded-full blur-2xl animate-pulse bottom-1/3 left-1/3 animation-delay-3000" />
    
    {/* 渐变叠加 */}
    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-green-50/5 to-blue-50/5 dark:from-transparent dark:via-green-900/5 dark:to-blue-900/5" />
  </div>
);

/* 🎯 浮动几何图形 */
const FloatingGeometry = () => (
  <div className="absolute inset-0 -z-15 overflow-hidden pointer-events-none">
    <div className="absolute top-20 left-10 w-16 h-16 border-2 border-green-400/30 rotate-45 animate-spin-slow" />
    <div className="absolute top-40 right-20 w-12 h-12 bg-blue-400/20 rounded-full animate-bounce animation-delay-1000" />
    <div className="absolute bottom-32 left-1/4 w-8 h-8 bg-purple-400/30 transform rotate-45 animate-pulse animation-delay-2000" />
    <div className="absolute bottom-20 right-1/3 w-20 h-20 border border-cyan-400/40 rounded-lg animate-float animation-delay-3000" />
  </div>
);

const PageLayout = ({ children, activePath = '/' }: PageLayoutProps) => {
  const showBackButton = ['/play'].includes(activePath);

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30 dark:from-gray-900 dark:via-green-900/20 dark:to-blue-900/20 text-gray-900 dark:text-gray-100">
      
      {/* 🌌 多层背景效果 */}
      <EnhancedGlowBackground />
      <ParticleBackground />
      <FloatingGeometry />

      {/* 📱 移动端头部 */}
      <MobileHeader showBackButton={showBackButton} />

      {/* 💻 桌面导航 */}
      <header className="hidden md:flex fixed top-0 left-0 w-full z-30 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 shadow-lg border-b border-gray-200/50 dark:border-gray-700/50 px-6 py-3 justify-between items-center">
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

      {/* ✅ 主内容区 - 去除宽度限制，增加高度 */}
      <main className="relative w-full px-4 md:px-6 lg:px-8 pt-20 pb-[calc(4rem+env(safe-area-inset-bottom))] min-h-screen">
        <div className="w-full max-w-7xl mx-auto">
          {/* 内容容器 - 移除固定背景，使用更灵活的布局 */}
          <div className="relative min-h-[calc(100vh-8rem)] rounded-2xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-2xl shadow-2xl border border-white/20 dark:border-gray-700/20 p-4 md:p-8 animate-fade-in overflow-hidden">
            {/* 内容装饰边框 */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400/5 via-transparent to-blue-400/5 pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 rounded-t-2xl" />
            
            {/* 实际内容 */}
            <div className="relative z-10 min-h-full">
              {children}
            </div>
          </div>
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