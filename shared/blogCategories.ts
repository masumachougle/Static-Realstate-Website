export const BLOG_CATEGORIES = [
  "Market Insights",
  "Investment Tips",
  "Property Guide",
  "Dubai Living",
  "Lifestyle",
  "Legal & Regulations",
  "Industry News",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export function getBlogFilterCategories(posts: { category: string }[]): string[] {
  const postCategories = new Set(posts.map((post) => post.category).filter(Boolean));
  const ordered = BLOG_CATEGORIES.filter((category) => postCategories.has(category));
  const extra = [...postCategories].filter(
    (category) => !BLOG_CATEGORIES.includes(category as BlogCategory),
  );

  return ["All", ...ordered, ...extra.sort()];
}
