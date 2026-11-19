"use client";

import { useActionState, useState } from "react";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaExternalLinkAlt,
  FaFileAlt,
  FaMoon,
  FaPen,
  FaPlus,
  FaSearch,
  FaSignOutAlt,
  FaSun,
  FaTimes,
  FaUsers,
} from "react-icons/fa";

import type { Brand } from "@/lib/brands";
import { saveBrand } from "@/app/admin/actions";
import { logout } from "@/app/login/actions";
import BrandImageUpload from "@/components/brand-image-upload";
export type BrandRecord = {
  id: string;
  slug: string;
  data: Brand;
  is_published: boolean;
};

type EditorData = {
  id?: string;
  data: Brand;
  is_published: boolean;
};

type Props = {
  records: BrandRecord[];
  total: number;
  published: number;
  email: string;
  tapkoTemplate: Brand;
};

const emptyBrand: Brand = {
  slug: "",
  name: "",
  description: "",
  category: "",

  theme: {
    primary: "#CDDE54",
    onPrimary: "#22201F",
    background: "#F5F5F0",
    cover: "#22201F",
  },

  links: {},
  payments: {},
};

function flatten(brand: Brand): Record<string, string> {
  return {
    name: brand.name,
    slug: brand.slug,
    description: brand.description,
    category: brand.category,

    logo: brand.logo ?? "",
    coverImage: brand.coverImage ?? "",

    primary: brand.theme.primary,
    onPrimary: brand.theme.onPrimary,
    background: brand.theme.background,
    cover: brand.theme.cover,

    phone: brand.contact?.phone ?? "",
    address: brand.location?.address ?? "",
    mapsUrl: brand.location?.mapsUrl ?? "",

    workingHours:
      brand.workingHours
        ?.map((item) => `${item.days} | ${item.hours}`)
        .join("\n") ?? "",

    website: brand.links.website ?? "",
    menu: brand.links.menu ?? "",
    whatsapp: brand.links.whatsapp ?? "",
    facebook: brand.links.facebook ?? "",
    instagram: brand.links.instagram ?? "",
    tiktok: brand.links.tiktok ?? "",
    x: brand.links.x ?? "",
    googleReview: brand.links.googleReview ?? "",

    instapay: brand.payments.instapay ?? "",
    vodafoneCash: brand.payments.vodafoneCash ?? "",
    vodafoneCashName: brand.payments.vodafoneCashName ?? "",
  };
}

/* =========================
   فورم إضافة وتعديل العميل
   ========================= */

function BrandEditor({
  initial,
  onClose,
}: {
  initial: EditorData;
  onClose: () => void;
}) {
  const [fields, setFields] = useState(() => flatten(initial.data));

  const [published, setPublished] = useState(initial.is_published);
  const [demo, setDemo] = useState(Boolean(initial.data.demo));
  const [uploadingImages, setUploadingImages] = useState({
    logo: false,
    coverImage: false,
  });

  const imagesBusy = uploadingImages.logo || uploadingImages.coverImage;
  const [state, action, pending] = useActionState(saveBrand, {});

  function updateField(key: string, value: string) {
    setFields((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function field(key: string, label: string, type = "text", placeholder = "") {
    const useLTR =
      type === "url" ||
      type === "tel" ||
      key === "slug" ||
      key === "logo" ||
      key === "coverImage";

    return (
      <label key={key} className="block text-xs font-medium text-stone-600">
        {label}

        <input
          name={key}
          type={type}
          value={fields[key] ?? ""}
          required={key === "name" || key === "slug"}
          readOnly={key === "slug" && Boolean(initial.id)}
          dir={useLTR ? "ltr" : undefined}
          placeholder={placeholder}
          onChange={(event) => updateField(key, event.target.value)}
          className="mt-2 min-h-12 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 text-sm text-stone-900 outline-none transition focus:border-[#A4B833] read-only:text-stone-400"
        />
      </label>
    );
  }

  if (state.success) {
    return (
      <div className="py-14 text-center sm:py-20">
        <span className="mx-auto grid size-20 place-items-center rounded-3xl bg-[#F2F5E5] text-[#849225]">
          <FaCheckCircle size={36} />
        </span>

        <h2 className="mt-6 text-2xl font-bold">تم حفظ بيانات العميل</h2>

        <p className="mt-3 text-sm leading-7 text-stone-500">
          {published
            ? "الصفحة منشورة وجاهزة للزيارة."
            : "الصفحة محفوظة كمسودة ومش ظاهرة للزوار."}
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {published && (
            <a
              href={`/${fields.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-[#CDDE54] px-5 py-3 text-sm font-bold text-[#22201F]"
            >
              افتح صفحة العميل
              <FaExternalLinkAlt size={12} />
            </a>
          )}

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-stone-200 px-5 py-3 text-sm"
          >
            الرجوع للعملاء
          </button>
        </div>
      </div>
    );
  }

  return (
    <form action={action}>
      <input type="hidden" name="id" value={initial.id ?? ""} />

      <fieldset
        disabled={pending || imagesBusy}
        className="min-w-0 space-y-7 disabled:opacity-70"
      >
        <section>
          <h3 className="mb-4 font-bold">بيانات النشاط</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            {field("name", "اسم العميل")}
            {field("slug", "رابط الصفحة", "text", "brand-name")}
            {field("category", "نوع النشاط")}
            {field("phone", "رقم حفظ جهة الاتصال", "tel")}
          </div>

          <p className="mt-3 text-[11px] leading-6 text-stone-400">
            الرابط بيبقى ثابت بعد إنشاء العميل للحفاظ على رابط الستاند والـQR.
          </p>

          <label className="mt-4 block text-xs font-medium text-stone-600">
            نبذة قصيرة
            <textarea
              name="description"
              value={fields.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              rows={3}
              maxLength={500}
              className="mt-2 w-full resize-y rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm text-stone-900 outline-none focus:border-[#A4B833]"
            />
          </label>
        </section>

        <section className="border-t border-stone-100 pt-6">
          <h3 className="mb-4 font-bold">هوية العميل</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <BrandImageUpload
              name="logo"
              label="لوجو العميل"
              value={fields.logo}
              onChange={(value) => updateField("logo", value)}
              onUploadingChange={(uploading) =>
                setUploadingImages((current) => ({
                  ...current,
                  logo: uploading,
                }))
              }
            />

            <BrandImageUpload
              name="coverImage"
              label="صورة الغلاف"
              value={fields.coverImage}
              onChange={(value) => updateField("coverImage", value)}
              onUploadingChange={(uploading) =>
                setUploadingImages((current) => ({
                  ...current,
                  coverImage: uploading,
                }))
              }
            />
          </div>

          <p className="mt-3 text-[11px] leading-6 text-stone-400">
            بعد اكتمال الرفع، اضغط «حفظ بيانات العميل» لتطبيق الصور على الصفحة.
          </p>

          <p className="mt-3 text-[11px] leading-6 text-stone-400">
            الصور تكون موجودة داخل public/images، والمسار يبدأ بـ /images/.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["primary", "اللون الأساسي"],
              ["onPrimary", "نص الزر"],
              ["background", "خلفية اللايت"],
              ["cover", "خلفية الغلاف"],
            ].map(([key, label]) => (
              <label
                key={key}
                className="rounded-2xl border border-stone-200 p-3 text-[11px] text-stone-600"
              >
                {label}

                <input
                  name={key}
                  type="color"
                  value={fields[key]}
                  onChange={(event) => updateField(key, event.target.value)}
                  className="mt-3 h-10 w-full cursor-pointer rounded-lg border-0 bg-transparent"
                />

                <span
                  dir="ltr"
                  className="mt-2 block text-center text-[10px] text-stone-400"
                >
                  {fields[key]}
                </span>
              </label>
            ))}
          </div>
        </section>

        <section className="border-t border-stone-100 pt-6">
          <h3 className="mb-2 font-bold">الروابط</h3>

          <p className="mb-5 text-xs leading-6 text-stone-500">
            أي رابط تسيبه فاضي، الكارت بتاعه هيختفي من صفحة العميل.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["website", "الموقع الإلكتروني"],
              ["menu", "المنيو"],
              ["whatsapp", "رابط واتساب"],
              ["facebook", "فيسبوك"],
              ["instagram", "إنستجرام"],
              ["tiktok", "تيك توك"],
              ["x", "X"],
              ["googleReview", "رابط تقييم جوجل"],
            ].map(([key, label]) => field(key, label, "url", "https://"))}
          </div>
        </section>

        <section className="border-t border-stone-100 pt-6">
          <h3 className="mb-4 font-bold">وسائل الدفع</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            {field("instapay", "رابط إنستاباي", "url", "https://")}

            {field("vodafoneCash", "رقم فودافون كاش", "tel")}

            {field("vodafoneCashName", "اسم المستفيد")}
          </div>
        </section>

        <section className="border-t border-stone-100 pt-6">
          <h3 className="mb-4 font-bold">العنوان والمواعيد</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            {field("address", "العنوان")}

            {field("mapsUrl", "رابط جوجل مابس", "url", "https://")}
          </div>

          <label className="mt-4 block text-xs font-medium text-stone-600">
            مواعيد العمل
            <textarea
              name="workingHours"
              value={fields.workingHours}
              onChange={(event) =>
                updateField("workingHours", event.target.value)
              }
              placeholder={
                "السبت – الخميس | 10 صباحًا – 10 مساءً\nالجمعة | مغلق"
              }
              rows={4}
              className="mt-2 w-full resize-y rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm leading-7 text-stone-900 outline-none focus:border-[#A4B833]"
            />
          </label>

          <p className="mt-2 text-[11px] leading-6 text-stone-400">
            كل مجموعة أيام في سطر، وبين الأيام والمواعيد علامة |.
          </p>
        </section>

        <section className="space-y-4 rounded-2xl border border-stone-200 bg-stone-50 p-5">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              name="is_published"
              type="checkbox"
              checked={published}
              onChange={(event) => setPublished(event.target.checked)}
              className="mt-1 size-4 shrink-0 accent-[#849225]"
            />

            <span>
              <span className="block text-sm font-bold">نشر الصفحة للزوار</span>

              <span className="mt-1 block text-xs leading-6 text-stone-500">
                لو الخيار مقفول، الصفحة تتحفظ كمسودة.
              </span>
            </span>
          </label>

          <label className="flex cursor-pointer items-center gap-3 text-xs text-stone-500">
            <input
              name="demo"
              type="checkbox"
              checked={demo}
              onChange={(event) => setDemo(event.target.checked)}
              className="size-4 accent-[#849225]"
            />
            عرض علامة «صفحة تجريبية»
          </label>
        </section>

        {state.error && (
          <p
            role="alert"
            className="rounded-xl bg-red-50 p-4 text-xs leading-7 text-red-700"
          >
            {state.error}
          </p>
        )}

        <button
          type="submit"
          className="flex min-h-13 w-full items-center justify-center gap-3 rounded-xl bg-[#CDDE54] text-sm font-bold text-[#22201F] transition hover:brightness-95 disabled:opacity-60"
        >
          {pending && (
            <span
              aria-hidden="true"
              className="size-4 animate-spin rounded-full border-2 border-[#22201F]/20 border-t-[#22201F]"
            />
          )}

          {pending ? "جاري الحفظ..." : "حفظ بيانات العميل"}
        </button>
      </fieldset>
    </form>
  );
}

/* =========================
   لوحة الإدارة
   ========================= */

export default function AdminDashboard({
  records,
  total,
  published,
  email,
  tapkoTemplate,
}: Props) {
  const [darkMode, setDarkMode] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [editor, setEditor] = useState<EditorData | null>(null);

  const filtered = records.filter((record) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      record.data.name.toLowerCase().includes(query) ||
      record.slug.toLowerCase().includes(query);

    const matchesStatus =
      filter === "all" ||
      (filter === "published" && record.is_published) ||
      (filter === "drafts" && !record.is_published);

    return matchesSearch && matchesStatus;
  });

  const stats = [
    {
      label: "إجمالي العملاء",
      value: total,
      icon: FaUsers,
    },
    {
      label: "صفحات منشورة",
      value: published,
      icon: FaCheckCircle,
    },
    {
      label: "مسودات",
      value: total - published,
      icon: FaFileAlt,
    },
  ];

  function openNewClient() {
    setEditor({
      data: emptyBrand,
      is_published: false,
    });
  }

  return (
    <div
      data-theme={darkMode ? "dark" : "light"}
      className="tapko-admin min-h-dvh text-[#252620]"
    >
      <header className="border-b border-stone-200/70 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <div className="flex items-center gap-4">
            <span
              dir="ltr"
              className="rounded-xl bg-[#22201F] px-4 py-2 text-2xl font-black tracking-[-2px] text-white"
            >
              tap<span className="text-[#CDDE54]">ko</span>
            </span>

            <div className="hidden sm:block">
              <p className="text-sm font-bold">مساحة إدارة Tapko</p>

              <p className="mt-1 text-[11px] text-stone-400">
                كل عملائك، من مكان واحد
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDarkMode((current) => !current)}
              aria-label={
                darkMode ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"
              }
              aria-pressed={darkMode}
              className="admin-theme-toggle grid size-10 place-items-center rounded-xl border border-stone-200 bg-white"
            >
              <span
                key={darkMode ? "sun" : "moon"}
                className="admin-theme-icon"
              >
                {darkMode ? <FaSun size={17} /> : <FaMoon size={16} />}
              </span>
            </button>

            <form action={logout}>
              <button
                type="submit"
                className="flex min-h-10 items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 text-xs text-stone-600"
              >
                <FaSignOutAlt />
                خروج
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="admin-main mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
        {editor ? (
          <section className="mx-auto max-w-3xl">
            <button
              type="button"
              onClick={() => setEditor(null)}
              className="mb-5 flex items-center gap-2 text-xs text-stone-500"
            >
              <FaArrowLeft />
              الرجوع للعملاء
            </button>

            <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
              <div className="mb-7 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold text-[#849225]">
                    إدارة صفحات العملاء
                  </p>

                  <h1 className="mt-2 text-xl font-bold">
                    {editor.id ? "تعديل بيانات العميل" : "إضافة عميل جديد"}
                  </h1>

                  <p className="mt-2 text-xs leading-6 text-stone-500">
                    البيانات اللي تضيفها هنا تظهر في صفحة العميل.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setEditor(null)}
                  aria-label="إغلاق"
                  className="grid size-9 shrink-0 place-items-center rounded-full bg-stone-100"
                >
                  <FaTimes size={13} />
                </button>
              </div>

              <BrandEditor
                key={editor.id ?? "new"}
                initial={editor}
                onClose={() => setEditor(null)}
              />
            </div>
          </section>
        ) : (
          <>
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="text-xs font-bold text-[#849225]">لوحة التحكم</p>

                <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
                  صفحات عملائك
                </h1>

                <p className="mt-3 text-sm leading-7 text-stone-500">
                  أضف، عدّل وانشر. والستاند يفضل بنفس الرابط.
                </p>
              </div>

              <button
                type="button"
                onClick={openNewClient}
                className="flex min-h-12 items-center gap-3 rounded-xl bg-[#CDDE54] px-5 text-sm font-bold text-[#22201F] shadow-sm hover:brightness-95"
              >
                <FaPlus size={13} />
                إضافة عميل
              </button>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <section
                  key={stat.label}
                  className="flex items-center justify-between rounded-2xl border border-stone-200/80 bg-white p-5 sm:p-6"
                >
                  <div>
                    <p className="text-xs text-stone-500">{stat.label}</p>

                    <p className="mt-3 text-3xl font-bold">{stat.value}</p>
                  </div>

                  <span className="grid size-12 place-items-center rounded-2xl bg-[#F2F5E5] text-[#849225]">
                    <stat.icon size={20} />
                  </span>
                </section>
              ))}
            </div>

            <section className="mt-7 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 p-5">
                <div className="relative w-full sm:max-w-xs">
                  <FaSearch
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3 top-3.5 text-xs text-stone-400"
                  />

                  <input
                    aria-label="البحث عن عميل"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="ابحث باسم العميل أو الرابط..."
                    className="min-h-10 w-full rounded-xl border border-stone-200 bg-stone-50 pr-9 pl-3 text-xs text-stone-900 outline-none focus:border-[#A4B833]"
                  />
                </div>

                <select
                  aria-label="حالة الصفحة"
                  value={filter}
                  onChange={(event) => setFilter(event.target.value)}
                  className="min-h-10 rounded-xl border border-stone-200 bg-white px-3 text-xs text-stone-700"
                >
                  <option value="all">كل الصفحات</option>

                  <option value="published">المنشور</option>

                  <option value="drafts">المسودات</option>
                </select>
              </div>

              {filtered.length > 0 ? (
                <div className="divide-y divide-stone-100">
                  {filtered.map((record) => (
                    <div
                      key={record.id}
                      className="flex flex-wrap items-center justify-between gap-4 p-5"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          style={{
                            backgroundColor: record.data.theme.primary,
                            color: record.data.theme.onPrimary,
                          }}
                          aria-hidden="true"
                          className="grid size-11 shrink-0 place-items-center rounded-xl font-bold"
                        >
                          {record.data.name.slice(0, 1)}
                        </span>

                        <div className="min-w-0">
                          <h2 className="wrap-break-word text-sm font-bold">
                            {record.data.name}
                          </h2>

                          <p
                            dir="ltr"
                            className="mt-1 break-all text-right text-xs text-stone-400"
                          >
                            /{record.slug}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={
                            record.is_published
                              ? "rounded-full bg-green-50 px-3 py-1.5 text-[10px] text-green-700"
                              : "rounded-full bg-amber-50 px-3 py-1.5 text-[10px] text-amber-700"
                          }
                        >
                          {record.is_published ? "منشور" : "مسودة"}
                        </span>

                        {record.is_published && (
                          <a
                            href={`/${record.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`فتح صفحة ${record.data.name}`}
                            className="grid size-9 place-items-center rounded-lg border border-stone-200 text-stone-500"
                          >
                            <FaExternalLinkAlt size={12} />
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => setEditor(record)}
                          className="flex min-h-9 items-center gap-2 rounded-lg border border-stone-200 px-3 text-xs text-stone-700"
                        >
                          <FaPen size={11} />
                          تعديل
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-5 py-16 text-center">
                  <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-[#F2F5E5] text-[#849225]">
                    <FaUsers size={26} />
                  </span>

                  <h2 className="mt-5 text-lg font-bold">
                    {records.length > 0
                      ? "مفيش نتائج مطابقة"
                      : "أول عميل يبدأ من هنا"}
                  </h2>

                  <p className="mx-auto mt-3 max-w-sm text-xs leading-7 text-stone-500">
                    {records.length > 0
                      ? "جرّب اسم مختلف أو غيّر الفلتر."
                      : "ابدأ ببيانات Tapko الحالية، أو أضف أول عميل جديد."}
                  </p>

                  {records.length === 0 ? (
                    <button
                      type="button"
                      onClick={() =>
                        setEditor({
                          data: tapkoTemplate,
                          is_published: false,
                        })
                      }
                      className="mt-6 rounded-xl bg-[#CDDE54] px-5 py-3 text-xs font-bold text-[#22201F]"
                    >
                      ابدأ ببيانات Tapko
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setSearch("");
                        setFilter("all");
                      }}
                      className="mt-5 rounded-xl border border-stone-200 px-4 py-2 text-xs text-stone-600"
                    >
                      مسح البحث والفلاتر
                    </button>
                  )}
                </div>
              )}

              <div className="border-t border-stone-100 p-4 text-[11px] leading-6 text-stone-400">
                عرض {filtered.length} من أحدث {records.length} صفحة محمّلة.
                {total > records.length && (
                  <span className="mr-1">
                    البحث والفلاتر على الصفحات المحمّلة فقط.
                  </span>
                )}
              </div>
            </section>

            <footer className="mt-6 flex flex-wrap items-center justify-between gap-3 text-[11px] text-stone-400">
              <p className="break-all">حساب الإدارة: {email}</p>

              <p dir="ltr">Tapko Management</p>
            </footer>
          </>
        )}
      </main>
    </div>
  );
}
