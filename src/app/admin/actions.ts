"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { brandSchema } from "@/lib/brand-schema";

export type SaveState = {
  error?: string;
  success?: boolean;
};

export async function saveBrand(
  _previous: SaveState,
  form: FormData,
): Promise<SaveState> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "الجلسة انتهت. سجّل دخولك تاني." };
  }

  const { data: admin, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminError || !admin) {
    return { error: "تعذّر التحقق من صلاحية الإدارة." };
  }

  const text = (key: string) => {
    const value = form.get(key);
    return typeof value === "string" ? value.trim() : "";
  };

  const id = text("id");

  if (id && !z.uuid().safeParse(id).success) {
    return { error: "معرّف العميل غير صالح." };
  }

  const hoursLines = text("workingHours")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (hoursLines.some((line) => line.split("|").length !== 2)) {
    return {
      error:
        "كل سطر في المواعيد يكون بالشكل: السبت – الخميس | 10 صباحًا – 10 مساءً",
    };
  }

  const parsed = brandSchema.safeParse({
    slug: text("slug"),
    name: text("name"),
    description: text("description"),
    category: text("category"),
    demo: form.get("demo") === "on",

    logo: text("logo"),
    coverImage: text("coverImage"),

    theme: {
      primary: text("primary"),
      onPrimary: text("onPrimary"),
      background: text("background"),
      cover: text("cover"),
    },

    contact: text("phone") ? { phone: text("phone") } : undefined,

    location:
      text("address") || text("mapsUrl")
        ? {
            address: text("address"),
            mapsUrl: text("mapsUrl"),
          }
        : undefined,

    workingHours: hoursLines.map((line) => {
      const [days, hours] = line.split("|");

      return {
        days: days.trim(),
        hours: hours.trim(),
      };
    }),

    links: {
      website: text("website"),
      menu: text("menu"),
      facebook: text("facebook"),
      whatsapp: text("whatsapp"),
      instagram: text("instagram"),
      tiktok: text("tiktok"),
      x: text("x"),
      googleReview: text("googleReview"),
    },

    payments: {
      instapay: text("instapay"),
      vodafoneCash: text("vodafoneCash"),
      vodafoneCashName: text("vodafoneCashName"),
    },
  });

  if (!parsed.success) {
    const issue = parsed.error.issues[0];

    return {
      error: `${issue.path.join(".")}: ${issue.message}`,
    };
  }

  const brand = parsed.data;

  // الرابط ثابت بعد الإنشاء عشان NFC وQR يفضلوا شغالين.
  if (id) {
    const { data: existing, error } = await supabase
      .from("brands")
      .select("slug")
      .eq("id", id)
      .single();

    if (error || !existing) {
      return { error: "تعذّر العثور على العميل." };
    }

    if (existing.slug !== brand.slug) {
      return { error: "رابط العميل ثابت بعد الإنشاء." };
    }
  }

  const payload = {
    slug: brand.slug,
    data: brand,
    is_published: form.get("is_published") === "on",
  };

  const result = id
    ? await supabase
        .from("brands")
        .update(payload)
        .eq("id", id)
        .select("id")
        .single()
    : await supabase.from("brands").insert(payload).select("id").single();

  if (result.error) {
    return {
      error:
        result.error.code === "23505"
          ? "الرابط مستخدم بالفعل. اختار رابط مختلف."
          : "تعذّر الحفظ. راجع الاتصال وصلاحيات قاعدة البيانات.",
    };
  }

  revalidatePath("/admin");
  revalidatePath(`/${brand.slug}`);

  return { success: true };
}
