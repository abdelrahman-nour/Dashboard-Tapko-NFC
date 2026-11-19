import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { brandSchema } from "@/lib/brand-schema";

export const getPublicBrand = cache(async (slug: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("brands")
    .select("data")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    throw new Error("تعذّر تحميل الصفحة. حاول مرة أخرى.");
  }

  if (!data) return null;

  const parsed = brandSchema.safeParse(data.data);

  if (!parsed.success) {
    throw new Error("بيانات الصفحة محتاجة مراجعة.");
  }

  return parsed.data;
});
