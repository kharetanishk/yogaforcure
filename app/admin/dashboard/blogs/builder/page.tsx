import { redirect } from "next/navigation";

// The Blog Builder now lives inside "New blog"; keep old links working.
export default function BlogBuilderPage() {
  redirect("/admin/dashboard/blogs/new");
}
