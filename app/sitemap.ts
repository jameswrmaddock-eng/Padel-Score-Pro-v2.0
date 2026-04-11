import { MetadataRoute } from 'next';
import { BLOG_POSTS } from '@/data/blogPosts';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.padelscorepro.com';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base,               lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/score`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/features`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/rules`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog`,     lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
  ];

  const blogRoutes: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url:             `${base}/blog/${post.slug}`,
    lastModified:    new Date(),
    changeFrequency: 'monthly',
    priority:        0.6,
  }));

  return [...staticRoutes, ...blogRoutes];
}
