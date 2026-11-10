import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BlogForm from "@/components/admin/BlogForm";
import BlogBuilder from "@/components/admin/BlogBuilder";
import { parseDoc } from "@/lib/blogBuilder";

type Props = { params: Promise<{ id: string }> };

export default async function EditBlogPage({ params }: Props) {
  const { id } = await params;
  const blog = await prisma.blog.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });

  if (!blog) notFound();

  const images = blog.images.map((img) => ({
    url: img.url,
    publicId: img.publicId,
    alt: img.alt,
  }));

  const doc = parseDoc(blog.content);
  if (doc) {
    return (
      <BlogBuilder
        initial={{
          id: blog.id,
          title: blog.title,
          excerpt: blog.excerpt,
          metaTitle: blog.metaTitle ?? "",
          metaDescription: blog.metaDescription ?? "",
          published: blog.published,
          images,
          doc,
        }}
      />
    );
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-semibold text-[#1a3a1a] mb-6">
        Edit blog
      </h1>
      <BlogForm
        initial={{
          id: blog.id,
          title: blog.title,
          excerpt: blog.excerpt,
          content: blog.content,
          metaTitle: blog.metaTitle ?? "",
          metaDescription: blog.metaDescription ?? "",
          published: blog.published,
          images,
        }}
      />
    </div>
  );
}
