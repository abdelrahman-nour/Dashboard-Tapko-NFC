import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBrand } from "@/lib/brands";
import { brandSchema } from "@/lib/brand-schema";
import AdminDashboard from "@/components/admin-dashboard";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) redirect("/login");

  const { data: admin, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminError) {
    throw new Error("تعذّر التحقق من صلاحية الإدارة.");
  }

  if (!admin) redirect("/login?error=forbidden");

  const [listResult, publishedResult] = await Promise.all([
    supabase
      .from("brands")
      .select("id, slug, data, is_published", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(100),

    supabase
      .from("brands")
      .select("id", { count: "exact", head: true })
      .eq("is_published", true),
  ]);

  if (listResult.error || publishedResult.error) {
    throw new Error("تعذّر تحميل العملاء. راجع الاتصال وصلاحيات الجداول.");
  }

  const records = (listResult.data ?? []).map((row) => {
    const parsed = brandSchema.safeParse(row.data);

    if (!parsed.success) {
      throw new Error(`بيانات العميل ${row.slug} محتاجة مراجعة.`);
    }

    return {
      id: row.id as string,
      slug: row.slug as string,
      data: parsed.data,
      is_published: row.is_published as boolean,
    };
  });

  const tapkoTemplate = getBrand("tapko");

  if (!tapkoTemplate) {
    throw new Error("بيانات Tapko الأصلية مش موجودة في brands.ts.");
  }

  return (
    <AdminDashboard
      records={records}
      total={listResult.count ?? 0}
      published={publishedResult.count ?? 0}
      email={user.email ?? ""}
      tapkoTemplate={tapkoTemplate}
    />
  );
}
