import { NextResponse } from "next/server";
import { requireAdmin, contentToHtml } from "@/lib/auth";
import {
  containsHtml,
  createSlug,
  findClash,
  publishProblems,
  titleProblem,
  type BlogPayload,
} from "@/lib/blogRules";
import { prisma } from "@/lib/prisma";
import { revalidateBlogPaths } from "@/lib/blogRevalidation";

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const blogs = await prisma.blog.findMany({
    include: { images: { orderBy: { order: "asc" } } },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(blogs);
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as BlogPayload;
    const {
      title,
      excerpt,
      content,
      metaTitle,
      metaDescription,
      published,
      images,
    } = body;

    if (!title?.trim() || !excerpt?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: "Title, excerpt, and content are required" },
        { status: 400 }
      );
    }

    const badTitle = titleProblem(title);
    if (badTitle) {
      return NextResponse.json({ error: badTitle }, { status: 400 });
    }

    if (published) {
      const problems = publishProblems({
        title,
        excerpt,
        metaTitle,
        metaDescription,
        images: images ?? [],
      });
      if (problems.length > 0) {
        return NextResponse.json({ error: problems.join(" ") }, { status: 400 });
      }
    }

    const slug = createSlug(title);
    if (!slug) {
      return NextResponse.json(
        { error: "The title needs some English letters or numbers for its URL." },
        { status: 400 }
      );
    }

    const posts = await prisma.blog.findMany({
      select: { id: true, title: true, slug: true },
    });
    const clash = findClash(posts, title, slug);
    if (clash) {
      return NextResponse.json(
        {
          error: `A post like this already exists: "${clash.title}". Edit that post instead of creating a new one.`,
          existingId: clash.id,
        },
        { status: 409 }
      );
    }

    const htmlContent = containsHtml(content)
      ? content
      : contentToHtml(content);

    const blog = await prisma.blog.create({
      data: {
        title: title.trim(),
        slug,
        excerpt: excerpt.trim(),
        content: htmlContent,
        metaTitle: metaTitle?.trim() || title.trim(),
        metaDescription: metaDescription?.trim() || excerpt.trim(),
        published: Boolean(published),
        adminId: session.adminId,
        images: {
          create: (images ?? []).map((img, i) => ({
            url: img.url,
            publicId: img.publicId,
            alt: img.alt?.trim() || title.trim(),
            order: i,
          })),
        },
      },
      include: { images: true },
    });

    revalidateBlogPaths(blog.slug);
    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error("Create blog error:", error);
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
  }
}
