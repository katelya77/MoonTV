import type { Metadata, Viewport } from 'next';
import { Urbanist } from 'next/font/google';

import './globals.css';
import 'sweetalert2/dist/sweetalert2.min.css';

import { getConfig } from '@/lib/config';
import { SiteProvider } from '../components/SiteProvider';
import { ThemeProvider } from '../components/ThemeProvider';

const urbanist = Urbanist({ subsets: ['latin'], weight: ['400','600','700'] });

export async function generateMetadata(): Promise<Metadata> {
  let siteName = process.env.SITE_NAME || 'KatelyaTV';
  if (process.env.NEXT_PUBLIC_STORAGE_TYPE !== 'd1') {
    const config = await getConfig();
    siteName = config.SiteConfig.SiteName;
  }
  return {
    title: siteName,
    description: '影视聚合',
    manifest: '/manifest.json',
  };
}

export const viewport: Viewport = { themeColor: '#000000' };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let siteName = process.env.SITE_NAME || 'KatelyaTV';
  let announcement = process.env.ANNOUNCEMENT || '本网站仅提供影视信息搜索服务，所有内容均来自第三方网站。本站不存储任何视频资源，不对任何内容的准确性、合法性、完整性负责。';
  let enableRegister = process.env.NEXT_PUBLIC_ENABLE_REGISTER === 'true';
  let imageProxy = process.env.NEXT_PUBLIC_IMAGE_PROXY || '';

  if (process.env.NEXT_PUBLIC_STORAGE_TYPE !== 'd1') {
    const config = await getConfig();
    siteName = config.SiteConfig.SiteName;
    announcement = config.SiteConfig.Announcement;
    enableRegister = config.UserConfig.AllowRegister;
    imageProxy = config.SiteConfig.ImageProxy;
  }

  const runtimeConfig = {
    STORAGE_TYPE: process.env.NEXT_PUBLIC_STORAGE_TYPE || 'localstorage',
    ENABLE_REGISTER: enableRegister,
    IMAGE_PROXY: imageProxy,
  };

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `window.RUNTIME_CONFIG = ${JSON.stringify(runtimeConfig)};` }} />
      </head>
      <body className={`${urbanist.className} min-h-screen text-gray-900 dark:text-gray-200 bg-grid animate-fade-in`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SiteProvider siteName={siteName} announcement={announcement}>
            {children}
          </SiteProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
