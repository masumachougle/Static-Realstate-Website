import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import BlogCard from "@/components/BlogCard";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getImageUrl } from "@/lib/imageMap";
import { getBlogFilterCategories } from "@shared/blogCategories";
import type { BlogPost } from "@shared/schema";

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { data: blogPosts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  const categories = useMemo(
    () => getBlogFilterCategories(blogPosts),
    [blogPosts],
  );

  const filteredPosts = useMemo(() => {
    if (selectedCategory === "All") return blogPosts;
    return blogPosts.filter((post) => post.category === selectedCategory);
  }, [blogPosts, selectedCategory]);

  return (
    <div className="pt-20">
      <div className="page-hero">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="page-container-wide page-hero-content">
          <div className="page-hero-text page-hero-text-standalone">
            <h1 className="page-hero-title">
              Market Trends &{" "}
              <span className="text-gradient-highlight">
                Updates
              </span>
            </h1>
            <p className="page-hero-description">
              Discover Dubai's real estate updates, luxury property tips & market Insights.
            </p>
          </div>
        </div>
      </div>

      <div className="page-container-wide pt-5 pb-12">
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={category === selectedCategory ? "default" : "outline"}
              className="cursor-pointer hover-elevate px-4 py-1"
              data-testid={`badge-${category.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Card key={i} className="h-96 animate-pulse bg-muted" />
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">
              No posts found in this category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredPosts.map((post) => (
              <BlogCard
                key={post.id}
                id={post.id}
                title={post.title}
                excerpt={post.excerpt}
                category={post.category}
                author={post.author}
                date={post.date}
                image={getImageUrl(post.image)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
