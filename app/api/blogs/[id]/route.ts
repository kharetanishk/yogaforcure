import { NextResponse } from "next/server";
import { requireAdmin, contentToHtml } from "@/lib/auth";
import {
  containsHtml,
  findClash,
  publishProblems,
  titleProblem,
  type BlogPayload,
} from "@/lib/blogRules";
import { prisma } from "@/lib/prisma";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { revalidateBlogPaths } from "@/lib/blogRevalidation";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const blog = await prisma.blog.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });

  if (!blog) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(blog);
}

export async function PUT(request: Request, context: RouteContext) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

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

    const existing = await prisma.blog.findUnique({
      where: { id },
      include: { images: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // The URL stays the same when a title is edited, so links and rankings
    // keep working. To move a post, change its slug and add a redirect.
    if (title && title.trim() !== existing.title) {
      const badTitle = titleProblem(title);
      if (badTitle) {
        return NextResponse.json({ error: badTitle }, { status: 400 });
      }

      const others = await prisma.blog.findMany({
        where: { NOT: { id } },
        select: { id: true, title: true, slug: true },
      });
      const clash = findClash(others, title);
      if (clash) {
        return NextResponse.json(
          {
            error: `Another post already has this title: "${clash.title}".`,
            existingId: clash.id,
          },
          { status: 409 }
        );
      }
    }

    // Full checks apply when a post goes live, so a small edit to an older
    // post isn't blocked by SEO fields that were written before these rules.
    if (published && !existing.published) {
      const problems = publishProblems({
        title: title ?? existing.title,
        excerpt: excerpt ?? existing.excerpt,
        metaTitle: metaTitle ?? existing.metaTitle,
        metaDescription: metaDescription ?? existing.metaDescription,
        images: images ?? existing.images,
      });
      if (problems.length > 0) {
        return NextResponse.json({ error: problems.join(" ") }, { status: 400 });
      }
    }

    const htmlContent =
      content && !containsHtml(content) ? contentToHtml(content) : content;

    if (images) {
      const newPublicIds = new Set(images.map((i) => i.publicId));
      for (const img of existing.images) {
        if (!newPublicIds.has(img.publicId)) {
          try {
            await deleteFromCloudinary(img.publicId);
          } catch {
            /* ignore */
          }
        }
      }
      await prisma.blogImage.deleteMany({ where: { blogId: id } });
    }

    const blog = await prisma.blog.update({
      where: { id },
      data: {
        ...(title && { title: title.trim() }),
        ...(excerpt && { excerpt: excerpt.trim() }),
        ...(htmlContent && { content: htmlContent }),
        ...(metaTitle !== undefined && {
          metaTitle: metaTitle?.trim() || title?.trim(),
        }),
        ...(metaDescription !== undefined && {
          metaDescription: metaDescription?.trim() || excerpt?.trim(),
        }),
        ...(published !== undefined && { published: Boolean(published) }),
        ...(images && {
          images: {
            create: images.map((img, i) => ({
              url: img.url,
              publicId: img.publicId,
              alt: img.alt?.trim() || title?.trim() || existing.title,
              order: i,
            })),
          },
        }),
      },
      include: { images: { orderBy: { order: "asc" } } },
    });

    revalidateBlogPaths(blog.slug);
    return NextResponse.json(blog);
  } catch (error) {
    console.error("Update blog error:", error);
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const body = await request.json();
    const { published } = body;

    if (published === undefined) {
      return NextResponse.json(
        { error: "published field is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.blog.findUnique({
      where: { id },
      include: { images: { orderBy: { order: "asc" } } },
    });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (published && !existing.published) {
      const problems = publishProblems(existing);
      if (problems.length > 0) {
        return NextResponse.json({ error: problems.join(" ") }, { status: 400 });
      }
    }

    const blog = await prisma.blog.update({
      where: { id },
      data: { published: Boolean(published) },
    });

    revalidateBlogPaths(blog.slug);
    return NextResponse.json(blog);
  } catch (error) {
    console.error("Toggle publish error:", error);
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const blog = await prisma.blog.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!blog) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  for (const img of blog.images) {
    try {
      await deleteFromCloudinary(img.publicId);
    } catch {
      /* ignore */
    }
  }

  await prisma.blog.delete({ where: { id } });
  revalidateBlogPaths(blog.slug);
  return NextResponse.json({ success: true });
}
