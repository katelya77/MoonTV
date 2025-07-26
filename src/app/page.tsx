/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/exhaustive-deps, no-console */

'use client';

import { ChevronRight, Sparkles, Zap } from 'lucide-react';
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
      const hasSeenAnnouncement = localStorage.getItem('hasSeenAnnouncement');
      if (hasSeenAnnouncement !== announcement) {
        setShowAnnouncement(true);
      } else {
        setShowAnnouncement(Boolean(!hasSeenAnnouncement && announcement));
      }
    }
  }, [announcement]);

  type FavoriteItem = {
    id: string;
    source: string;
    title: string;
    poster: string;
    episodes: number;
    source_name: string;
    currentEpisode?: number;
    search_title?: string;
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
      } catch (error) {
        console.error('获取豆瓣数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoubanData();
  }, []);

  const updateFavoriteItems = async (allFavorites: Record<string, any>) => {
    const allPlayRecords = await getAllPlayRecords();

    const sorted = Object.entries(allFavorites)
      .sort(([, a], [, b]) => b.save_time - a.save_time)
      .map(([key, fav]) => {
        const plusIndex = key.indexOf('+');
        const source = key.slice(0, plusIndex);
        const id = key.slice(plusIndex + 1);
        const playRecord = allPlayRecords[key];
        const currentEpisode = playRecord?.index;

        return {
          id,
          source,
          title: fav.title,
          year: fav.year,
          poster: fav.cover,
          episodes: fav.total_episodes,
          source_name: fav.source_name,
          currentEpisode,
          search_title: fav?.search_title,
        } as FavoriteItem;
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

    const unsubscribe = subscribeToDataUpdates('favoritesUpdated', (newFavorites: Record<string, any>) => {
      updateFavoriteItems(newFavorites);
    });

    return unsubscribe;
  }, [activeTab]);

  const handleCloseAnnouncement = (announcement: string) => {
    setShowAnnouncement(false);
    localStorage.setItem('hasSeenAnnouncement', announcement);
  };

  return (
    <PageLayout>
      <div className='w-full min-h-full py-6'>
        {/* 🎯 顶部 Tab 切换 - 增强样式 */}
        <div className='mb-12 flex justify-center'>
          <div className="relative">
            <CapsuleSwitch
              options={[
                { label: '首页', value: 'home' },
                { label: '收藏夹', value: 'favorites' },
              ]}
              active={activeTab}
              onChange={(value) => setActiveTab(value as 'home' | 'favorites')}
            />
            <div className="absolute -inset-2 bg-gradient-to-r from-green-400/20 via-blue-400/20 to-purple-400/20 rounded-2xl blur-xl -z-10 animate-pulse" />
          </div>
        </div>

        {/* 🔥 增强渐变大标题 */}
        {activeTab === 'home' && (
          <div className="relative mb-16">
            <h1 className='gradient-text text-5xl md:text-6xl font-black text-center tracking-tight mb-4'>
              KatelyaTV
            </h1>
            <div className="flex justify-center items-center gap-2 text-gray-600 dark:text-gray-400">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <p className="text-sm md:text-base font-medium">发现无限精彩，畅享视觉盛宴</p>
              <Sparkles className="w-4 h-4 animate-pulse animation-delay-1000" />
            </div>
            {/* 装饰性光效 */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-green-400/10 via-blue-400/10 to-purple-400/10 rounded-full blur-3xl -z-10 animate-pulse" />
          </div>
        )}

        <div className='w-full'>
          {activeTab === 'favorites' ? (
            <section className='mb-16'>
              <div className='mb-8 flex items-center justify-between'>
                <h2 className='text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2'>
                  <div className="w-1 h-8 bg-gradient-to-b from-green-400 to-blue-400 rounded-full" />
                  我的收藏
                </h2>
                {favoriteItems.length > 0 && (
                  <button
                    className='px-4 py-2 text-sm text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-red-300 dark:hover:border-red-600 transition-colors'
                    onClick={async () => {
                      await clearAllFavorites();
                      setFavoriteItems([]);
                    }}
                  >
                    清空收藏
                  </button>
                )}
              </div>
              <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6'>
                {favoriteItems.map((item, index) => (
                  <div 
                    key={item.id + item.source} 
                    className='w-full animate-fade-in'
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <VideoCard
                      query={item.search_title}
                      {...item}
                      from='favorite'
                      type={item.episodes > 1 ? 'tv' : ''}
                    />
                  </div>
                ))}
                {favoriteItems.length === 0 && (
                  <div className='col-span-full text-center py-24'>
                    <div className='relative inline-block'>
                      <div className='text-8xl mb-6 animate-bounce'>📺</div>
                      <div className="absolute -inset-4 bg-gradient-to-r from-green-400/20 via-blue-400/20 to-purple-400/20 rounded-full blur-2xl animate-pulse" />
                    </div>
                    <h3 className='text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4'>
                      暂无收藏内容
                    </h3>
                    <p className='text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto'>
                      快去发现喜欢的影视作品，打造专属于你的收藏库吧！
                    </p>
                    <Link
                      href='/search'
                      className='inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl'
                    >
                      <Zap className="w-5 h-5" />
                      开始探索
                    </Link>
                  </div>
                )}
              </div>
            </section>
          ) : (
            <>
              <ContinueWatching />

              {/* 🎬 热门电影区域 */}
              <section className='mb-16'>
                <div className='mb-8 flex items-center justify-between'>
                  <h2 className='text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-3'>
                    <div className="w-1 h-8 bg-gradient-to-b from-red-400 to-pink-400 rounded-full" />
                    <span>热门电影</span>
                    <div className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-semibold rounded-full animate-pulse">
                      HOT
                    </div>
                  </h2>
                  <Link
                    href='/douban?type=movie'
                    className='flex items-center gap-1 px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 hover:shadow-md'
                  >
                    查看更多
                    <ChevronRight className='w-4 h-4' />
                  </Link>
                </div>
                <ScrollableRow>
                  {loading
                    ? Array.from({ length: 8 }).map((_, index) => (
                        <div
                          key={index}
                          className='min-w-[120px] w-30 sm:min-w-[180px] sm:w-44'
                        >
                          <div className='relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-gray-200 animate-pulse dark:bg-gray-800'>
                            <div className='absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600'></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-400/50 to-transparent" />
                          </div>
                          <div className='mt-3 h-4 bg-gray-200 rounded animate-pulse dark:bg-gray-800'></div>
                          <div className='mt-2 h-3 w-3/4 bg-gray-200 rounded animate-pulse dark:bg-gray-800'></div>
                        </div>
                      ))
                    : hotMovies.map((movie, index) => (
                        <div
                          key={index}
                          className='min-w-[120px] w-30 sm:min-w-[180px] sm:w-44 animate-fade-in'
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <VideoCard
                            from='douban'
                            title={movie.title}
                            poster={movie.poster}
                            douban_id={movie.id}
                            rate={movie.rate}
                            year={movie.year}
                            type='movie'
                          />
                        </div>
                      ))}
                </ScrollableRow>
              </section>

              {/* 📺 热门剧集区域 */}
              <section className='mb-16'>
                <div className='mb-8 flex items-center justify-between'>
                  <h2 className='text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-3'>
                    <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full" />
                    <span>热门剧集</span>
                    <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-full animate-pulse animation-delay-1000">
                      TRENDING
                    </div>
                  </h2>
                  <Link
                    href='/douban?type=tv'
                    className='flex items-center gap-1 px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 hover:shadow-md'
                  >
                    查看更多
                    <ChevronRight className='w-4 h-4' />
                  </Link>
                </div>
                <ScrollableRow>
                  {loading
                    ? Array.from({ length: 8 }).map((_, index) => (
                        <div
                          key={index}
                          className='min-w-[120px] w-30 sm:min-w-[180px] sm:w-44'
                        >
                          <div className='relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-gray-200 animate-pulse dark:bg-gray-800'>
                            <div className='absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600'></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-400/50 to-transparent" />
                          </div>
                          <div className='mt-3 h-4 bg-gray-200 rounded animate-pulse dark:bg-gray-800'></div>
                          <div className='mt-2 h-3 w-3/4 bg-gray-200 rounded animate-pulse dark:bg-gray-800'></div>
                        </div>
                      ))
                    : hotTvShows.map((show, index) => (
                        <div
                          key={index}
                          className='min-w-[120px] w-30 sm:min-w-[180px] sm:w-44 animate-fade-in'
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <VideoCard
                            from='douban'
                            title={show.title}
                            poster={show.poster}
                            douban_id={show.id}
                            rate={show.rate}
                            year={show.year}
                          />
                        </div>
                      ))}
                </ScrollableRow>
              </section>

              {/* 🎭 探索更多区域 */}
              <section className='mb-16'>
                <div className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-purple-900/20 p-12 text-center border border-green-200/30 dark:border-green-700/30'>
                  {/* 背景装饰 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/5 via-blue-400/5 to-purple-400/5" />
                  <div className="absolute top-0 left-1/4 w-32 h-32 bg-green-400/10 rounded-full blur-2xl animate-pulse" />
                  <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-blue-400/10 rounded-full blur-2xl animate-pulse animation-delay-2000" />
                  
                  <div className='relative z-10'>
                    <div className='text-8xl mb-6 animate-bounce'>🎬</div>
                    <h3 className='text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6'>
                      发现更多精彩内容
                    </h3>
                    <p className='text-gray-600 dark:text-gray-400 mb-10 text-lg max-w-2xl mx-auto'>
                      使用强大的搜索功能探索海量影视资源，收藏你喜欢的内容，打造专属观影体验
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                      <Link
                        href='/search'
                        className='group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-xl hover:from-green-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl'
                      >
                        <Zap className="w-5 h-5 group-hover:animate-pulse" />
                        开始搜索
                        <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </Link>
                      <Link
                        href='/douban'
                        className='inline-flex items-center gap-2 px-6 py-3 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300 hover:shadow-lg'
                      >
                        <Sparkles className="w-4 h-4" />
                        浏览分类
                      </Link>
                    </div>
                  </div>
                </div>
              </section>

              {/* 🌟 统计信息区域 */}
              <section className='mb-16'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  <div className='text-center p-8 rounded-2xl glass-effect border border-white/20 dark:border-gray-700/20 hover:shadow-lg transition-all duration-300'>
                    <div className='text-4xl mb-4'>🎥</div>
                    <div className='text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2'>
                      {hotMovies.length}+
                    </div>
                    <div className='text-gray-600 dark:text-gray-400'>热门电影</div>
                  </div>
                  <div className='text-center p-8 rounded-2xl glass-effect border border-white/20 dark:border-gray-700/20 hover:shadow-lg transition-all duration-300'>
                    <div className='text-4xl mb-4'>📺</div>
                    <div className='text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2'>
                      {hotTvShows.length}+
                    </div>
                    <div className='text-gray-600 dark:text-gray-400'>热门剧集</div>
                  </div>
                  <div className='text-center p-8 rounded-2xl glass-effect border border-white/20 dark:border-gray-700/20 hover:shadow-lg transition-all duration-300'>
                    <div className='text-4xl mb-4'>❤️</div>
                    <div className='text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2'>
                      {favoriteItems.length}
                    </div>
                    <div className='text-gray-600 dark:text-gray-400'>我的收藏</div>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
      
      {/* 公告弹窗 */}
      {announcement && showAnnouncement && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm dark:bg-black/80 p-4 transition-opacity duration-300 ${
            showAnnouncement ? '' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className='w-full max-w-md rounded-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20 transform transition-all duration-300 hover:shadow-3xl'>
            <div className='flex justify-between items-start mb-6'>
              <h3 className='text-2xl font-bold tracking-tight text-gray-800 dark:text-white flex items-center gap-2'>
                <div className="w-1 h-6 bg-gradient-to-b from-green-400 to-blue-400 rounded-full" />
                重要提示
              </h3>
            </div>
            <div className='mb-8'>
              <div className='relative overflow-hidden rounded-xl mb-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 border border-green-200/30 dark:border-green-700/30'>
                <div className='absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-green-400 to-blue-400 rounded-r-full'></div>
                <p className='ml-4 text-gray-700 dark:text-gray-300 leading-relaxed'>
                  {announcement}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleCloseAnnouncement(announcement)}
              className='w-full rounded-xl bg-gradient-to-r from-green-500 to-blue-500 px-6 py-4 text-white font-semibold shadow-lg hover:shadow-xl hover:from-green-600 hover:to-blue-600 dark:from-green-600 dark:to-blue-600 dark:hover:from-green-700 dark:hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02]'
            >
              我知道了
            </button>
          </div>
        </div>
      )}
    </PageLayout>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeClient />
    </Suspense>
  );
}