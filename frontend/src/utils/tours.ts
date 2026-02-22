import { parseISO, isBefore } from 'date-fns';

type Frontmatter = {
  title: string;
  description: string;
  publishDate: string;
  featuredImage: string;
  excerpt: string;
  price?: string;
  duration?: string;
  tags?: string[];
  mapUrl?: string;
};

type TourModule = {
  frontmatter: Frontmatter;
  url: string;
};

const tourModules = import.meta.glob('../pages/**/tours/posts/*.mdx', {
  eager: true,
}) as Record<string, TourModule>;

function getLocaleFromPath(path: string): string {
  const segment = path.split('/pages/')[1]?.split('/')[0];
  return segment === 'tours' || !segment ? 'en' : segment;
}

export function getTours(locale: string) {
  return Object.entries(tourModules)
    .map(([path, mod]) => ({
      locale: getLocaleFromPath(path),
      frontmatter: mod.frontmatter,
      url: mod.url,
    }))
    .filter(({ locale: entryLocale }) => entryLocale === locale)
    .map(({ frontmatter, url }) => ({
      title: frontmatter.title,
      description: frontmatter.description,
      publishDate: parseISO(frontmatter.publishDate),
      featuredImage: frontmatter.featuredImage,
      excerpt: frontmatter.excerpt,
      price: frontmatter.price,
      duration: frontmatter.duration,
      tags: frontmatter.tags,
      mapUrl: frontmatter.mapUrl,
      href: url,
    }))
    .sort((a, b) => {
      if (isBefore(a.publishDate, b.publishDate)) return 1;
      if (isBefore(b.publishDate, a.publishDate)) return -1;
      return 0;
    });
}
