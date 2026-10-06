import "./envSetup.js";
import { db } from "./db";
import { blogPosts } from "@shared/schema";
import { eq } from "drizzle-orm";
import { loadAllBlogFiles, toDbImage } from "./blogContent";

async function seedBlogs() {
  console.log("Seeding blogs from content/blogs/*.html ...\n");

  const files = loadAllBlogFiles();
  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  for (const post of files) {
    const payload = {
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      author: post.author,
      date: post.date,
      image: toDbImage(post.featuredImage),
    };

    const [existing] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.title, post.title));

    if (existing) {
      await db.update(blogPosts).set(payload).where(eq(blogPosts.id, existing.id));
      console.log(`↻  Updated: ${post.title}`);
      updated++;
      continue;
    }

    await db.insert(blogPosts).values(payload);
    console.log(`✓  Inserted: ${post.title}`);
    inserted++;
  }

  console.log(`\n✅ Done! ${inserted} inserted, ${updated} updated, ${skipped} skipped.`);
  process.exit(0);
}

seedBlogs().catch((error) => {
  console.error("Error seeding blogs:", error);
  process.exit(1);
});
