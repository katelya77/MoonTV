import { BackButton } from './BackButton';
import { LogoutButton } from './LogoutButton';
import MobileBottomNav from './MobileBottomNav';
import MobileHeader from './MobileHeader';
import { SettingsButton } from './SettingsButton';
import Sidebar from './Sidebar';
import { ThemeToggle } from './ThemeToggle';

interface PageLayoutProps {
  children: React.ReactNode;
  activePath?: string;
}

// 桌面端右上角工具栏组件
const DesktopTopBar = () => (
  <div className="absolute top-2 right-4 z-20 hidden md:flex items-center gap-2">
    <SettingsButton />
    <LogoutButton />
    <ThemeToggle />
  </div>
);

const PageLayout = ({ children, activePath = '/' }: PageLayoutProps) => {
  // 需要显示返回按钮的路由
  const showBackButton = ['/play'].includes(activePath);

  return (
    <div className="w-full min-h-screen">
      {/* 移动端头部 */}
      <MobileHeader showBackButton={showBackButton} />

      {/* 主要布局容器 */}
      <div className="flex md:grid md:grid-cols-[auto_1fr] w-full min-h-screen md:min-h-auto">
        {/* 侧边栏 - 仅桌面端显示 */}
        <div className="hidden md:block">
          <Sidebar activePath={activePath} />
        </div>

        {/* 主内容区域 */}
        <div className="relative min-w-0 flex-1 transition-all duration-300">
          {/* 桌面端左上角返回按钮 */}
          {showBackButton && (
            <div className="absolute top-3 left-1 z-20 hidden md:flex">
              <BackButton />
            </div>
          )}

          {/* 桌面端右上角工具栏 */}
          <DesktopTopBar />

          {/* 主内容 */}
          <main className="flex-1 md:min-h-0 mb-14 md:mb-0 pb-[calc(3.5rem+env(safe-area-inset-bottom))]">
            {children}
          </main>
        </div>
      </div>

      {/* 移动端底部导航 */}
      <div className="md:hidden">
        <MobileBottomNav activePath={activePath} />
      </div>
    </div>
  );
};

export default PageLayout;
