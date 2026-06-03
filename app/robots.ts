import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bitbrief.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/watchlist', '/newsletter', '/upgrade', '/account', '/billing', '/notifications'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
