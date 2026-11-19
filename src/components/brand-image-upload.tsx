"use client";

import { useId, useState, type ChangeEvent } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { FaCloudUploadAlt, FaImage, FaTimes } from "react-icons/fa";

type Props = {
  name: "logo" | "coverImage";
  label: string;
  value: string;
  onChange: (value: string) => void;
  onUploadingChange: (uploading: boolean) => void;
};

const extensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const maxSize = 5 * 1024 * 1024;

export default function BrandImageUpload({
  name,
  label,
  value,
  onChange,
  onUploadingChange,
}: Props) {
  const inputId = useId();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    // يسمح باختيار نفس الملف مرة ثانية.
    event.target.value = "";

    if (!file) return;

    setError("");

    const extension = extensions[file.type];

    if (!extension) {
      setError("اختار صورة بصيغة JPG أو PNG أو WEBP.");
      return;
    }

    if (file.size === 0 || file.size > maxSize) {
      setError("الصورة لازم تكون أقل من أو تساوي 5 ميجابايت.");
      return;
    }

    setUploading(true);
    onUploadingChange(true);

    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key =
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!url || !key) {
        throw new Error("إعدادات Supabase ناقصة في ملف البيئة.");
      }

      const supabase = createBrowserClient(url, key);

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("الجلسة انتهت. سجّل دخولك مرة ثانية.");
      }

      const path = `${user.id}/${name}/${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("brand-images")
        .upload(path, file, {
          contentType: file.type,
          cacheControl: "31536000",
          upsert: false,
        });

      if (uploadError) {
        throw new Error("تعذّر رفع الصورة. راجع الاتصال وصلاحيات Storage.");
      }

      const { data } = supabase.storage.from("brand-images").getPublicUrl(path);

      onChange(data.publicUrl);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "حصل خطأ أثناء رفع الصورة.",
      );
    } finally {
      setUploading(false);
      onUploadingChange(false);
    }
  }

  return (
    <div
      className="rounded-2xl border border-stone-200 bg-stone-50 p-4"
      aria-busy={uploading}
    >
      {/* ده الرابط اللي بيتبعت إلى saveBrand */}
      <input type="hidden" name={name} value={value} />

      <p className="mb-3 text-xs font-bold">{label}</p>

      <div
        className={`relative flex items-center justify-center overflow-hidden rounded-xl border border-dashed border-stone-200 bg-white ${
          name === "logo" ? "h-40" : "aspect-video"
        }`}
      >
        {value ? (
          // المعاينة تستخدم img عشان تدعم الصور المحلية والمرفوعة.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt={`معاينة ${label}`}
            className={`h-full w-full ${
              name === "logo" ? "object-contain p-4" : "object-cover"
            }`}
          />
        ) : (
          <div className="text-center text-stone-400">
            <FaImage className="mx-auto text-3xl" />

            <p className="mt-3 text-[11px]">
              {name === "logo" ? "يفضل صورة مربعة" : "يفضل صورة أفقية"}
            </p>
          </div>
        )}

        {uploading && (
          <div
            role="status"
            className="absolute inset-0 grid place-items-center bg-black/60 text-white"
          >
            <div className="text-center">
              <span className="mx-auto block size-7 animate-spin rounded-full border-2 border-white/30 border-t-white" />

              <p className="mt-3 text-xs">جاري رفع الصورة...</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <input
          id={inputId}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={uploading}
          onChange={uploadImage}
          className="peer sr-only"
        />

        <label
          htmlFor={inputId}
          className={`flex min-h-10 items-center gap-2 rounded-xl bg-[#CDDE54] px-4 text-xs font-bold text-[#22201F] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-[#849225] ${
            uploading ? "pointer-events-none opacity-60" : "cursor-pointer"
          }`}
        >
          <FaCloudUploadAlt size={16} />
          {value ? "تغيير الصورة" : "اختيار صورة"}
        </label>

        {value && (
          <button
            type="button"
            disabled={uploading}
            onClick={() => {
              onChange("");
              setError("");
            }}
            className="flex min-h-10 items-center gap-2 rounded-xl border border-stone-200 px-3 text-xs text-stone-600"
          >
            <FaTimes size={11} />
            إزالة
          </button>
        )}
      </div>

      <p className="mt-3 text-[10px] leading-6 text-stone-400">
        JPG / PNG / WEBP — بحد أقصى 5 ميجابايت
      </p>

      {error && (
        <p
          role="alert"
          className="mt-3 rounded-lg bg-red-50 p-3 text-xs leading-6 text-red-700"
        >
          {error}
        </p>
      )}
    </div>
  );
}
