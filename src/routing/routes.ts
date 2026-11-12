import { blogPosts } from '../content/blogPosts';
import { projectsBySlug } from '../content/realPortfolio';

export const routes = [
  '/',
  '/projects',
  ...Object.keys(projectsBySlug).map(slug => `/projects/${slug}`),
  '/blog',
  ...blogPosts.map(({ slug }) => `/blog/${slug}`),
  '/resume',
  '/about',
];
