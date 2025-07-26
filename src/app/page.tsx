/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/exhaustive-deps, no-console */

'use client';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import {
  clearAllFavorites,
  getAllFavorites,
  getAllPlayRecords,
  subscribeToDataUpdates,
} from '@/lib/db.client';
import { getDoubanCategories } from '@/lib/douban.client';
import { DoubanItem } from '@/lib/types';
import CapsuleSwitch from '@/components/CapsuleSwitch';
import ContinueWatching from '@/components/ContinueWatching';
import PageLayout from '@/components/PageLayout';
import ScrollableRow from '@/components/ScrollableRow';
import { useSite } from '@/components/SiteProvider';
import VideoCard from '@/components/VideoCard';

function HomeClient() {
  const [activeTab, setActiveTab] = useState<'home' | 'favorites'>('home');
  const [hotMovies, setHotMovies] = useState<DoubanItem[]>([]);
  const [hotTvShows, setHotTvShows] = useState<DoubanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { announcement } = useSite();
  const [showAnnouncement, setShowAnnouncement] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && announcement) {
      const seen = localStorage.getItem('hasSeenAnnouncement');
      setShowAnnouncement(seen !== announcement);
    }
  }, [announcement]);

  type FavoriteItem = { /* ... */ };
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([]);
  useEffect(() => { /* fetch logic omitted for brevity */ }, []);
  useEffect(() => { /* update favorites logic omitted */ }, [activeTab]);
  const handleCloseAnnouncement = (announcement: string) => {
    setShowAnnouncement(false);
    localStorage.setItem('hasSeenAnnouncement', announcement);
  };

  return (
    <PageLayout>
      <div className="px-2 sm:px-10 py-4 sm:py-8 overflow-visible bg-animated animate-fade-in">
        <div className="mb-8 flex justify-center">
          <CapsuleSwitch
            options={[
              { label: '首页', value: 'home' },
              { label: '收藏夹', value: 'favorites' },
            ]}
            active={activeTab}
            onChange={(v) => setActiveTab(v as any)}
          />
        </div>

        {activeTab === 'home' && (
          <h1 className="gradient-text text-5xl font-extrabold mb-12">
            KatelyaTV
          </h1>
        )}

        {/* 以下内容保持不变 */}
        <div className="max-w-[95%] mx-auto">
          {/* your content... */}
        </div>
      </div>

      {/* announcement modal retained */}
    </PageLayout>
  );
}

export default function Home() {
  return <Suspense><HomeClient /></Suspense>;
}
