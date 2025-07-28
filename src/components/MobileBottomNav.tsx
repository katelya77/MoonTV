'use client';

import { Clover, Film, Home, Search, Tv } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MobileBottomNavProps {
  /**
   * 主动指定当前激活的路径。当未提供时，自动使用 usePathname() 获取的路径。
   */
  activePath?: string;
}

const MobileBottomNav = ({ activePath }: MobileBottomNavProps) => {
  const pathname = usePathname();

  // 当前激活路径：优先使用传入的 activePath，否则回退到浏览器地址
  const currentActive = activePath ?? pathname;

  const navItems = [
    { icon: Home, label: '首页', href: '/' },
    { icon: Search, label: '搜索', href: '/search' },
    {
      icon: Film,
      label: '电影',
      href: '/douban?type=movie',
    },
    {
      icon: Tv,
      label: '剧集',
      href: '/douban?type=tv',
    },
    {
      icon: Clover,
      label: '综艺',
      href: '/douban?type=show',
    },
  ];

  const isActive = (href: string) => {
    const typeMatch = href.match(/type=([^&]+)/)?.[1];

    // 解码URL以进行正确的比较
    const decodedActive = decodeURIComponent(currentActive);
    const decodedItemHref = decodeURIComponent(href);

    return (
      decodedActive === decodedItemHref ||
      (decodedActive.startsWith('/douban') &&
        decodedActive.includes(`type=${typeMatch}`))
    );
  };

  return (
    <nav
      className='md:hidden fixed left-0 right-0 z-[600] bg-white/90 backdrop-blur-xl border-t border-purple-200/50 overflow-hidden dark:bg-gray-900/80 dark:border-purple-700/50 shadow-lg'
      style={{
        /* 紧贴视口底部，同时在内部留出安全区高度 */
        bottom: 0,
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {/* 顶部装饰线 */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
      
      <ul className='flex items-center'>
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <li key={item.href} className='flex-shrink-0 w-1/5'>
              <Link
                href={item.href}
                className={`flex flex-col items-center justify-center w-full h-14 gap-1 text-xs transition-all duration-200 relative ${
                  active 
                    ? 'transform -translate-y-1' 
                    : 'hover:transform hover:-translate-y-0.5'
                }`}
              >
                {/* 激活状态的背景光晕 */}
                {active && (
                  <div className="absolute inset-0 bg-purple-500/10 rounded-lg mx-2 my-1 border border-purple-300/20"></div>
                )}
                
                <item.icon
                  className={`h-6 w-6 transition-all duration-200 ${
                    active
                      ? 'text-purple-600 dark:text-purple-400 scale-110'
                      : 'text-gray-500 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-300'
                  }`}
                />
                <span
                  className={`transition-all duration-200 font-medium ${
                    active
                      ? 'text-purple-600 dark:text-purple-400'
                      : 'text-gray-600 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-300'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default MobileBottomNav;