import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOGS_DIR = join(__dirname, "..", "content", "blogs");

export interface BlogFileMeta {
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  featuredImage: string;
  slug: string;
}

export interface BlogFilePost extends BlogFileMeta {
  content: string;
}

function parseMetaComment(raw: string): BlogFileMeta {
  const meta: Record<string, string> = {};
  for (const line of raw.split("\n")) {
    const match = line.match(/^\s*([a-zA-Z]+):\s*(.+)\s*$/);
    if (match) {
      meta[match[1]] = match[2].trim();
    }
  }

  return {
    title: meta.title || "",
    excerpt: meta.excerpt || "",
    category: meta.category || "",
    author: meta.author || "RealState Properties Team",
    date: meta.date || "",
    featuredImage: meta.featuredImage || "",
    slug: meta.slug || "",
  };
}

export function loadBlogFile(slug: string): BlogFilePost | null {
  const filePath = join(BLOGS_DIR, `${slug}.html`);
  try {
    const source = readFileSync(filePath, "utf-8");
    const commentMatch = source.match(/^<!--([\s\S]*?)-->/);
    if (!commentMatch) return null;

    const meta = parseMetaComment(commentMatch[1]);
    // Take everything after the opening body div through the last closing div
    // so nested <div> tags inside articles are not truncated.
    const openTag = '<div class="blog-article-body">';
    const openIndex = source.indexOf(openTag);
    let content = "";
    if (openIndex !== -1) {
      const bodyStart = openIndex + openTag.length;
      const closeIndex = source.lastIndexOf("</div>");
      if (closeIndex > bodyStart) {
        content = source.slice(bodyStart, closeIndex).trim();
      }
    }

    return { ...meta, slug, content };
  } catch {
    return null;
  }
}

export function loadAllBlogFiles(): BlogFilePost[] {
  const files = readdirSync(BLOGS_DIR).filter((file) => file.endsWith(".html"));
  const posts: BlogFilePost[] = [];

  for (const file of files) {
    const slug = file.replace(".html", "");
    const post = loadBlogFile(slug);
    if (post) posts.push(post);
  }

  return posts.sort((a, b) => a.title.localeCompare(b.title));
}

export function toDbImage(featuredImage: string): string {
  return featuredImage;
}
