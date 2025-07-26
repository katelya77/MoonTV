/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/exhaustive-deps, no-console */
'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';

import { clearAllFavorites, getAllFavorites, getAllPlayRecords, subscribeToDataUpdates } from '@/lib/db.client';
import { getDoubanCategories } from '@/lib/douban.client';
import { DoubanItem } from '@/lib/types';

import CapsuleSwitch from '@/components/CapsuleSwitch';
import ContinueWatching from '@/components/ContinueWatching';
import PageLayout from '@/components/PageLayout';
import ScrollableRow from '@/components/ScrollableRow';
import { useSite } from '@/components/SiteProvider';
import VideoCard from '@/components/VideoCard';

function HomeClient() {
  const [activeTab, setActiveTab] = useState<'home'|'favorites'>('home');
  const [hotMovies, setHotMovies] = useState<DoubanItem[]>([]);
  const [hotTvShows, setHotTvShows] = useState<DoubanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { announcement } = useSite();
  const [showAnnouncement, setShowAnnouncement] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && announcement) {
      const hasSeenAnnouncement = localStorage.getItem('hasSeenAnnouncement');
      setShowAnnouncement(hasSeenAnnouncement !== announcement);
    }
  }, [announcement]);

  type FavoriteItem = {
    id: string; source: string; title: string; poster: string;
    episodes: number; source_name: string; currentEpisode?: number; search_title?: string;
  };
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    const fetchDoubanData = async () => {
      try {
        setLoading(true);
        const [moviesData, tvShowsData] = await Promise.all([
          getDoubanCategories({ kind: 'movie', category: '热门', type: '全部' }),
          getDoubanCategories({ kind: 'tv', category: 'tv', type: 'tv' }),
        ]);
        if (moviesData.code === 200) setHotMovies(moviesData.list);
        if (tvShowsData.code === 200) setHotTvShows(tvShowsData.list);
      } catch (error) { console.error('获取豆瓣数据失败:', error); }
      finally { setLoading(false); }
    };
    fetchDoubanData();
  }, []);

  const updateFavoriteItems = async (allFavorites: Record<string,any>) => {
    const allPlayRecords = await getAllPlayRecords();
    const sorted = Object.entries(allFavorites)
      .sort(([,a],[,b]) => b.save_time - a.save_time)
      .map(([key,fav]) => {
        const plusIndex = key.indexOf('+');
        const source = key.slice(0,plusIndex);
        const id = key.slice(plusIndex+1);
        const playRecord = allPlayRecords[key];
        return { id, source, title:fav.title, poster:fav.cover, episodes:fav.total_episodes,
                 source_name:fav.source_name, currentEpisode:playRecord?.index, search_title:fav?.search_title };
      });
    setFavoriteItems(sorted);
  };

  useEffect(() => {
    if (activeTab !== 'favorites') return;
    const loadFavorites = async () => {
      const allFavorites = await getAllFavorites();
      await updateFavoriteItems(allFavorites);
    };
    loadFavorites();
    const unsubscribe = subscribeToDataUpdates('favoritesUpdated', (newFavorites) => updateFavoriteItems(newFavorites));
    return unsubscribe;
  }, [activeTab]);

  const handleCloseAnnouncement = (ann: string) => {
    setShowAnnouncement(false);
    localStorage.setItem('hasSeenAnnouncement', ann);
  };

  return (
    <PageLayout>
      <div className="px-2 sm:px-10 py-4 sm:py-8 overflow-visible">
        {/* 顶部 Tab */}
        <div className="mb-8 flex justify-center">
          <CapsuleSwitch options={[{label:'首页',value:'home'},{label:'收藏夹',value:'favorites'}]}
                         active={activeTab} onChange={(v)=>setActiveTab(v as 'home'|'favorites')} />
        </div>

        {/* 🔥 渐变标题 */}
        {activeTab==='home' && <h1 className="gradient-text text-4xl font-extrabold text-center tracking-wide mb-12">KatelyaTV</h1>}

        <div className="max-w-[95%] mx-auto">
          {activeTab==='favorites' ? (
            <section className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">我的收藏</h2>
                {favoriteItems.length>0 && (
                  <button className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          onClick={async()=>{ await clearAllFavorites(); setFavoriteItems([]); }}>清空</button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-x-2 gap-y-14 sm:gap-y-20 sm:grid-cols-[repeat(auto-fill,_minmax(11rem,_1fr))] sm:gap-x-8">
                {favoriteItems.map(item=>(
                  <div key={item.id+item.source} className="w-full">
                    <VideoCard query={item.search_title} {...item} from="favorite" type={item.episodes>1?'tv':''} />
                  </div>
                ))}
                {favoriteItems.length===0 && <div className="col-span-full text-center text-gray-500 py-8 dark:text-gray-400">暂无收藏内容</div>}
              </div>
            </section>
          ) : (
            <>
              <ContinueWatching />

              {/* 热门电影 */}
              <section className="mb-8">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">热门电影</h2>
                  <Link href="/douban?type=movie" className="flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    查看更多 <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                <ScrollableRow>
                  {loading ? Array.from({length:8}).map((_,i)=>(
                    <div key={i} className="min-w-[96px] w-24 sm:min-w-[180px] sm:w-44">
                      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-gray-200 animate-pulse dark:bg-gray-800" />
                      <div className="mt-2 h-4 bg-gray-200 rounded animate-pulse dark:bg-gray-800" />
                    </div>
                  )) : hotMovies.map((movie,i)=>(
                    <div key={i} className="min-w-[96px] w-24 sm:min-w-[180px] sm:w-44">
                      <VideoCard from="douban" title={movie.title} poster={movie.poster} douban_id={movie.id} rate={movie.rate} year={movie.year} type="movie" />
                    </div>
                  ))}
                </ScrollableRow>
              </section>

              {/* 热门剧集 */}
              <section className="mb-8">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">热门剧集</h2>
                  <Link href="/douban?type=tv" className="flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    查看更多 <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                <ScrollableRow>
                  {loading ? Array.from({length:8}).map((_,i)=>(
                    <div key={i} className="min-w-[96px] w-24 sm:min-w-[180px] sm:w-44">
                      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-gray-200 animate-pulse dark:bg-gray-800" />
                      <div className="mt-2 h-4 bg-gray-200 rounded animate-pulse dark:bg-gray-800" />
                    </div>
                  )) : hotTvShows.map((tv,i)=>(
                    <div key={i} className="min-w-[96px] w-24 sm:min-w-[180px] sm:w-44">
                      <VideoCard from="douban" title={tv.title} poster={tv.poster} douban_id={tv.id} rate={tv.rate} year={tv.year} type="tv" />
                    </div>
                  ))}
                </ScrollableRow>
              </section>
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
export default function Page() { return (<Suspense><HomeClient /></Suspense>); }
