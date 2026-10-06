import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { getImageUrl } from "@/lib/imageMap";
import type { BlogPost } from "@shared/schema";

export default function BlogDetail() {
  const [, params] = useRoute("/blog/:id");
  
  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: [`/api/blog/${params?.id}`],
    enabled: !!params?.id,
  });

  if (isLoading) {
    return (
      <div className="pt-[var(--nav-height)] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="pt-[var(--nav-height)] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-heading font-semibold mb-2">Article Not Found</h2>
          <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist.</p>
          <Link href="/blog">
            <Button data-testid="button-back-to-blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[var(--nav-height)] bg-background">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="page-subnav -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pt-1 pb-1 mb-1">
          <Link href="/blog">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full shadow-sm"
              aria-label="Back to blog"
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <article className="pb-12">
          <div className="max-w-4xl mx-auto">
            <div className="mb-4">
              <Badge className="mb-2" data-testid="badge-category">{post.category}</Badge>
              <h1 className="text-3xl md:text-4xl font-heading font-semibold mb-3" data-testid="text-title">
                {post.title}
              </h1>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span data-testid="text-author">{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span data-testid="text-date">{post.date}</span>
                </div>
              </div>
            </div>

            <div className="aspect-[16/9] rounded-md overflow-hidden mb-4">
              <img
                src={getImageUrl(post.image)}
                alt={post.title}
                className="w-full h-full object-cover"
                data-testid="img-featured"
              />
            </div>

            <Card className="p-6 md:p-8">
              <div className="prose prose-sm md:prose-base max-w-none blog-article">
                {post.excerpt ? (
                  <p className="text-base text-muted-foreground mb-6 leading-relaxed" data-testid="text-excerpt">
                    {post.excerpt}
                  </p>
                ) : null}

                <div
                  className="blog-article-body text-foreground leading-relaxed text-[0.95rem]"
                  data-testid="text-content"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
            </Card>

            <div className="mt-12 text-center">
              <Link href="/blog">
                <Button size="lg" data-testid="button-more-articles">
                  Read More Articles
                </Button>
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
