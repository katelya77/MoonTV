'use client';

import { Clover, Film, Home, Menu, Search, Tv } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { useSite } from './SiteProvider';

interface SidebarContextType {
  isCollapsed: boolean;
}

const SidebarContext = createContext<SidebarContextType>({
  isCollapsed: false,
});

export const useSidebar = () => useContext(SidebarContext);

const Logo = () => {
  const { siteName } = useSite();
  return (
    <Link
      href="/"
      className="flex items-center justify-center h-16 select-none hover:opacity-80 transition-opacity duration-200"
    >
      <span className="text-2xl font-bold text-purple-600 dark:text-purple-400 tracking-tight">{siteName}</span>
    </Link>
  );
};

interface SidebarProps {
  onToggle?: (collapsed: boolean) => void;
  activePath?: string;
  horizontal?: boolean; // ✅ 支持水平模式
}

declare global {
  interface Window {
    __sidebarCollapsed?: boolean;
  }
}

const Sidebar = ({ onToggle, activePath = '/', horizontal = false }: SidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && typeof window.__sidebarCollapsed === 'boolean') {
      return window.__sidebarCollapsed;
    }
    return false;
  });

  useLayoutEffect(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    if (saved !== null) {
      const val = JSON.parse(saved);
      setIsCollapsed(val);
      window.__sidebarCollapsed = val;
    }
  }, []);

  useLayoutEffect(() => {
    if (typeof document !== 'undefined') {
      if (isCollapsed) document.documentElement.dataset.sidebarCollapsed = 'true';
      else delete document.documentElement.dataset.sidebarCollapsed;
    }
  }, [isCollapsed]);

  const [active, setActive] = useState(activePath);

  useEffect(() => {
    if (activePath) setActive(activePath);
    else {
      const queryString = searchParams.toString();
      setActive(queryString ? `${pathname}?${queryString}` : pathname);
    }
  }, [activePath, pathname, searchParams]);

  const handleToggle = useCallback(() => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
    if (typeof window !== 'undefined') window.__sidebarCollapsed = newState;
    onToggle?.(newState);
  }, [isCollapsed, onToggle]);

  const handleSearchClick = useCallback(() => {
    router.push('/search');
  }, [router]);

  const contextValue = { isCollapsed };

  const menuItems = [
    { icon: Film, label: '电影', href: '/douban?type=movie' },
    { icon: Tv, label: '剧集', href: '/douban?type=tv' },
    { icon: Clover, label: '综艺', href: '/douban?type=show' },
  ];

  // ✅ 【水平导航模式】用于 PageLayout 顶部
  if (horizontal) {
    return (
      <nav className="hidden md:flex items-center gap-6">
        {/* Logo */}
        <Logo />
        {/* 首页 */}
        <Link
          href="/"
          onClick={() => setActive('/')}
          data-active={active === '/'}
          className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-100/50 dark:hover:bg-purple-900/30 data-[active=true]:text-purple-600 dark:data-[active=true]:text-purple-400"
        >
          <Home className="h-4 w-4" />
          <span>首页</span>
        </Link>
        {/* 搜索 */}
        <Link
          href="/search"
          onClick={(e) => {
            e.preventDefault();
            handleSearchClick();
            setActive('/search');
          }}
          data-active={active === '/search'}
          className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-100/50 dark:hover:bg-purple-900/30 data-[active=true]:text-purple-600 dark:data-[active=true]:text-purple-400"
        >
          <Search className="h-4 w-4" />
          <span>搜索</span>
        </Link>
        {/* 其他菜单 */}
        {menuItems.map((item) => {
          const isActive = active.includes(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setActive(item.href)}
              data-active={isActive}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-100/50 dark:hover:bg-purple-900/30 data-[active=true]:text-purple-600 dark:data-[active=true]:text-purple-400"
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    );
  }

  // ✅ 【垂直侧边栏模式】
  return (
    <SidebarContext.Provider value={contextValue}>
      <div className="hidden md:flex">
        <aside
          data-sidebar
          className={`fixed top-0 left-0 h-screen bg-purple-50/60 backdrop-blur-xl transition-all duration-300 border-r border-purple-200/50 z-10 shadow-lg dark:bg-purple-950/70 dark:border-purple-700/50 ${
            isCollapsed ? 'w-16' : 'w-64'
          }`}
          style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
        >
          <div className="flex h-full flex-col">
            {/* Logo + Toggle */}
            <div className="relative h-16">
              <div
                className={`absolute inset-0 flex items-center justify-center ${
                  isCollapsed ? 'opacity-0' : 'opacity-100'
                }`}
              >
                {!isCollapsed && <Logo />}
              </div>
              <button
                onClick={handleToggle}
                className={`absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg text-purple-500 hover:bg-purple-100/50 dark:hover:bg-purple-800/50 ${
                  isCollapsed ? 'left-1/2 -translate-x-1/2' : 'right-2'
                }`}
              >
                <Menu className="h-4 w-4" />
              </button>
            </div>

            {/* 首页 & 搜索 */}
            <nav className="px-2 mt-4 space-y-1">
              <Link
                href="/"
                onClick={() => setActive('/')}
                data-active={active === '/'}
                className="group flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-purple-100/40 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 dark:hover:bg-purple-900/30 data-[active=true]:bg-purple-100/60 data-[active=true]:text-purple-600 dark:data-[active=true]:bg-purple-900/50 dark:data-[active=true]:text-purple-400"
              >
                <Home className="h-4 w-4" /> {!isCollapsed && <span>首页</span>}
              </Link>
              <Link
                href="/search"
                onClick={(e) => {
                  e.preventDefault();
                  handleSearchClick();
                  setActive('/search');
                }}
                data-active={active === '/search'}
                className="group flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-purple-100/40 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 dark:hover:bg-purple-900/30 data-[active=true]:bg-purple-100/60 data-[active=true]:text-purple-600 dark:data-[active=true]:bg-purple-900/50 dark:data-[active=true]:text-purple-400"
              >
                <Search className="h-4 w-4" /> {!isCollapsed && <span>搜索</span>}
              </Link>
            </nav>

            {/* 菜单 */}
            <div className="flex-1 overflow-y-auto px-2 pt-4">
              {menuItems.map((item) => {
                const isActive = active.includes(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setActive(item.href)}
                    data-active={isActive}
                    className="group flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-purple-100/40 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 dark:hover:bg-purple-900/30 data-[active=true]:bg-purple-100/60 data-[active=true]:text-purple-600 dark:data-[active=true]:bg-purple-900/50 dark:data-[active=true]:text-purple-400"
                  >
                    <Icon className="h-4 w-4" /> {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>
        <div className={`transition-all duration-300 sidebar-offset ${isCollapsed ? 'w-16' : 'w-64'}`}></div>
      </div>
    </SidebarContext.Provider>
  );
};

export default Sidebar;