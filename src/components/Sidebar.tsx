'use client';

import Link from 'next/link';
import { HomeIcon, FilmIcon, TvIcon, SparklesIcon, SearchIcon } from '@heroicons/react/24/outline';

interface SidebarProps {
  activePath?: string;
  horizontal?: boolean;
}

const menuItems = [
  { name: '首页', path: '/', icon: HomeIcon },
  { name: '搜索', path: '/search', icon: SearchIcon },
  { name: '电影', path: '/movies', icon: FilmIcon },
  { name: '剧集', path: '/series', icon: TvIcon },
  { name: '综艺', path: '/variety', icon: SparklesIcon },
];

export default function Sidebar({ activePath = '/', horizontal = false }: SidebarProps) {
  return (
    <nav className={`flex ${horizontal ? 'flex-row gap-6' : 'flex-col gap-4 p-4'} text-gray-700 dark:text-gray-200`}>
      {menuItems.map((item) => {
        const isActive = activePath === item.path;
        const Icon = item.icon;
        return (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 
              ${isActive ? 'bg-green-500 text-white shadow-md scale-105' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-sm font-medium">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
