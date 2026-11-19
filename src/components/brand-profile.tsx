"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { IconType } from "react-icons";
import {
  FaArrowLeft,
  FaCheck,
  FaCopy,
  FaFacebookF,
  FaGlobe,
  FaGoogle,
  FaInstagram,
  FaMoon,
  FaShareAlt,
  FaSun,
  FaTiktok,
  FaTimes,
  FaUtensils,
  FaWhatsapp,
  FaAddressBook,
  FaClock,
  FaMapMarkerAlt,
  FaChevronDown,
} from "react-icons/fa";
import { SiVodafone } from "react-icons/si";
import type { Brand } from "@/lib/brands";

type Payment = {
  name: string;
  value: string;
  beneficiary: string;
};

type Tile = {
  id: string;
  label: string;
  subtitle: string;
  icon: IconType;
  color: string;
  background: string;
  href?: string;
  payment?: Payment;
  action?: "save-contact";
};

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.5 22H2.3l7.3-8.5L1 2h6.5l4.5 6.8L18.9 2Zm-1.1 18h1.7L6.6 3.9H4.8L17.8 20Z" />
    </svg>
  );
}

function InstaPayIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 11h21m-6-6 6 6-6 6" />
      <path d="M27 22H6m6-6-6 6 6 6" />
    </svg>
  );
}

function safeUrl(value?: string) {
  if (!value?.trim()) return undefined;

  try {
    const url = new URL(value.trim());

    return ["https:", "http:"].includes(url.protocol) ? url.href : undefined;
  } catch {
    return undefined;
  }
}

export default function BrandProfile({ brand }: { brand: Brand }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [darkMode, setDarkMode] = useState(true);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [notice, setNotice] = useState("");
  const [copied, setCopied] = useState(false);

  const theme = {
    "--brand": brand.theme.primary,
    "--on-brand": brand.theme.onPrimary,
    "--cover": brand.theme.cover,
    "--page": darkMode ? "#111214" : brand.theme.background,
    "--surface": darkMode ? "#1B1D20" : "#FFFFFF",
    "--tile": darkMode ? "#25272B" : "#FCFCFA",
    "--tile-hover": darkMode ? "#303238" : "#FFFFFF",
    "--text": darkMode ? "#F3F3EF" : "#242421",
    "--muted": darkMode ? "#B4B6BD" : "#78716C",
    "--border": darkMode ? "#34363C" : "#E7E5E4",
  } as CSSProperties;

  useEffect(() => {
    if (!notice) return;

    const timer = window.setTimeout(() => {
      setNotice("");
    }, 3500);

    return () => window.clearTimeout(timer);
  }, [notice]);

  const instaUrl = safeUrl(brand.payments.instapay);
  const cashValue = brand.payments.vodafoneCash?.trim();
  const cashName = brand.payments.vodafoneCashName?.trim();

  const contactPhone = brand.contact?.phone.trim();

  const mapsUrl = safeUrl(brand.location?.mapsUrl);
  const locationAddress = brand.location?.address.trim();

  const workingHours =
    brand.workingHours?.filter(
      (item) => item.days.trim() && item.hours.trim(),
    ) ?? [];

  const tiles: Tile[] = [
    {
      id: "whatsapp",
      label: "واتساب",
      subtitle: "كلّمنا مباشرة",
      icon: FaWhatsapp,
      color: "#128C4A",
      background: "#EAF8EE",
      href: safeUrl(brand.links.whatsapp),
    },
    {
      id: "facebook",
      label: "فيسبوك",
      subtitle: "تابع أخبارنا",
      icon: FaFacebookF,
      color: "#1877F2",
      background: "#EBF3FF",
      href: safeUrl(brand.links.facebook),
    },
    {
      id: "instagram",
      label: "إنستجرام",
      subtitle: "شوف جديدنا",
      icon: FaInstagram,
      color: "#C13584",
      background: "#FCEEF5",
      href: safeUrl(brand.links.instagram),
    },
    {
      id: "x",
      label: "X",
      subtitle: "تابعنا على إكس",
      icon: XIcon,
      color: "#202020",
      background: "#EFEFED",
      href: safeUrl(brand.links.x),
    },
    {
      id: "tiktok",
      label: "تيك توك",
      subtitle: "شاهد فيديوهاتنا",
      icon: FaTiktok,
      color: "#202020",
      background: "#EFEFED",
      href: safeUrl(brand.links.tiktok),
    },
    {
      id: "website",
      label: "الموقع",
      subtitle: "تصفّح واطلب",
      icon: FaGlobe,
      color: "#476A95",
      background: "#EDF3FA",
      href: safeUrl(brand.links.website),
    },
    {
      id: "menu",
      label: "المنيو",
      subtitle: "اختار طلبك",
      icon: FaUtensils,
      color: "#B27625",
      background: "#FCF3E6",
      href: safeUrl(brand.links.menu),
    },
    {
      id: "google",
      label: "تقييم جوجل",
      subtitle: "شاركنا تجربتك",
      icon: FaGoogle,
      color: "#4285F4",
      background: "#EDF3FF",
      href: safeUrl(brand.links.googleReview),
    },
    {
      id: "instapay",
      label: "إنستاباي",
      subtitle: "ادفع مباشرة",
      icon: InstaPayIcon,
      color: "#713390",
      background: "#F4EDF9",
      href: instaUrl,
    },
    {
      id: "cash",
      label: "فودافون كاش",
      subtitle: "بيانات المحفظة",
      icon: SiVodafone,
      color: "#E60000",
      background: "#FDEDED",
      payment:
        cashValue && cashName
          ? {
              name: "Vodafone Cash",
              value: cashValue,
              beneficiary: cashName,
            }
          : undefined,
    },
    {
      id: "location",
      label: "موقعنا",
      subtitle: "افتح الاتجاهات",
      icon: FaMapMarkerAlt,
      color: "#D95F43",
      background: "#FFF0EB",
      href: locationAddress ? mapsUrl : undefined,
    },
    {
      id: "save-contact",
      label: "احفظ رقمنا",
      subtitle: "جهة اتصال جاهزة",
      icon: FaAddressBook,
      color: "#398079",
      background: "#EAF6F3",
      action: contactPhone ? "save-contact" : undefined,
    },
  ];

  const visibleTiles = tiles.filter((tile) =>
    Boolean(tile.href || tile.payment || tile.action),
  );

  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: brand.name,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setNotice("تم نسخ رابط الصفحة");
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      setNotice("تعذّرت المشاركة. تقدر تنسخ الرابط من المتصفح.");
    }
  }

  function openPayment(method: Payment) {
    setPayment(method);
    setCopied(false);
    setNotice("");
    dialogRef.current?.showModal();
  }

  function closePayment() {
    dialogRef.current?.close();
  }

  async function copyPayment() {
    if (!payment) return;

    try {
      await navigator.clipboard.writeText(payment.value);
      setCopied(true);
      setNotice("تم نسخ رقم المحفظة");
    } catch {
      setNotice("تعذّر النسخ التلقائي. حدّد الرقم وانسخه يدويًا.");
    }
  }

  function saveContact() {
    if (!contactPhone) return;

    function escapeVCard(value: string) {
      return value
        .replace(/\\/g, "\\\\")
        .replace(/\r\n|\r|\n/g, "\\n")
        .replace(/;/g, "\\;")
        .replace(/,/g, "\\,");
    }

    const phone = contactPhone.replace(/[^\d+]/g, "");

    if (!/\d/.test(phone)) {
      setNotice("رقم التواصل غير صالح.");
      return;
    }

    const lines = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${escapeVCard(brand.name)}`,
      `ORG:${escapeVCard(brand.name)}`,
      `TEL;TYPE=WORK,VOICE:${phone}`,
    ];

    const website = safeUrl(brand.links.website);

    if (website) {
      lines.push(`URL:${escapeVCard(website)}`);
    }

    lines.push("END:VCARD");

    const file = new Blob([lines.join("\r\n") + "\r\n"], {
      type: "text/vcard;charset=utf-8",
    });

    const url = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${brand.slug}.vcf`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div
      style={theme}
      data-theme={darkMode ? "dark" : "light"}
      className="tapko-profile min-h-dvh bg-[var(--page)] px-3 py-5 text-[var(--text)] sm:px-6 sm:py-10"
    >
      <main className="mx-auto max-w-4xl">
        <article className="overflow-hidden rounded-[28px] border border-black/[0.06] bg-white shadow-[0_15px_65px_-35px_rgba(0,0,0,0.2)] sm:rounded-[36px]">
          {/* الغلاف وأزرار التحكم */}
          <div className="relative aspect-[2.7/1] bg-[var(--cover)] sm:aspect-[3.3/1]">
            {brand.coverImage && (
              <Image
                src={brand.coverImage}
                alt={`غلاف ${brand.name}`}
                fill
                priority
                sizes="(max-width: 896px) 100vw, 896px"
                className="object-cover object-center"
              />
            )}

            <button
              type="button"
              onClick={() => setDarkMode((current) => !current)}
              aria-label={
                darkMode ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"
              }
              aria-pressed={darkMode}
              className="absolute right-4 top-4 z-10 grid size-10 place-items-center rounded-full border border-white/40 bg-white/95 text-stone-800 shadow-sm transition hover:scale-105 sm:right-5 sm:top-5"
            >
              {darkMode ? <FaSun size={17} /> : <FaMoon size={16} />}
            </button>

            <button
              type="button"
              onClick={share}
              aria-label="مشاركة الصفحة"
              className="absolute left-4 top-4 z-10 grid size-10 place-items-center rounded-full border border-white/40 bg-white/95 text-stone-800 shadow-sm transition hover:scale-105 sm:left-5 sm:top-5"
            >
              <FaShareAlt size={15} />
            </button>
          </div>

          {/* صورة البراند وبياناته */}
          <section className="relative px-4 text-center sm:px-8">
            <div className="relative z-10 mx-auto -mt-11 size-24 overflow-hidden rounded-full border-[5px] border-white bg-white shadow-md sm:-mt-14 sm:size-30 sm:border-[6px]">
              {brand.logo && (
                <Image
                  src={brand.logo}
                  alt={`شعار ${brand.name}`}
                  fill
                  priority
                  sizes="120px"
                  className="object-contain"
                />
              )}
            </div>

            {brand.category && (
              <p className="mt-4 text-[10px] font-medium tracking-wide text-stone-400 sm:text-xs">
                {brand.category}
              </p>
            )}

            <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
              {brand.name}
            </h1>

            {brand.description && (
              <p className="mx-auto mt-3 max-w-md text-xs leading-7 text-stone-500 sm:text-sm">
                {brand.description}
              </p>
            )}

            {brand.demo && (
              <span className="mt-3 inline-block rounded-full bg-stone-100 px-3 py-1 text-[10px] text-stone-500">
                صفحة تجريبية
              </span>
            )}

            <div
              aria-hidden="true"
              className="mx-auto mt-5 h-1 w-9 rounded-full bg-[var(--brand)]"
            />
          </section>

          {/* عرض الخدمات المضافة فقط */}
          {visibleTiles.length > 0 && (
            <section
              aria-labelledby="links-title"
              className="px-4 pb-6 pt-7 sm:px-8 sm:pb-8 sm:pt-8"
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <h2
                  id="links-title"
                  className="text-sm font-bold text-stone-800"
                >
                  تواصل معانا وأكثر
                </h2>

                <span className="text-[10px] text-stone-400 sm:text-xs">
                  كل اللي تحتاجه، بلمسة
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 min-[360px]:grid-cols-3 sm:grid-cols-4 sm:gap-3 lg:grid-cols-5">
                {visibleTiles.map((tile) => {
                  const Icon = tile.icon;

                  const cardClass = [
                    "group relative flex min-h-31 min-w-0 flex-col",
                    "items-center justify-center rounded-[20px]",
                    "border border-stone-100 bg-[#FCFCFA]",
                    "px-2 py-4 text-center",
                    "transition duration-200",
                    "hover:-translate-y-1 hover:border-stone-300",
                    "hover:bg-white hover:shadow-lg",
                    "hover:shadow-black/[0.04]",
                    "motion-reduce:transform-none",
                    "motion-reduce:transition-none",
                  ].join(" ");

                  const content = (
                    <>
                      <span
                        style={{
                          color: tile.color,
                          backgroundColor: tile.background,
                        }}
                        className="grid size-11 place-items-center rounded-[15px] sm:size-12"
                      >
                        <Icon className="size-5 sm:size-6" />
                      </span>

                      <span className="mt-3 text-xs font-bold text-stone-800">
                        {tile.label}
                      </span>

                      <span className="mt-1 text-[9px] leading-4 text-stone-400 sm:text-[10px]">
                        {tile.subtitle}
                      </span>
                    </>
                  );

                  if (tile.href) {
                    return (
                      <a
                        key={tile.id}
                        href={tile.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cardClass}
                      >
                        {content}
                      </a>
                    );
                  }

                  return (
                    <button
                      key={tile.id}
                      type="button"
                      onClick={() => {
                        if (tile.action === "save-contact") {
                          saveContact();
                          return;
                        }

                        if (tile.payment) {
                          openPayment(tile.payment);
                        }
                      }}
                      className={cardClass}
                    >
                      {content}
                    </button>
                  );
                })}
              </div>
            </section>
          )}
          {((mapsUrl && locationAddress) || workingHours.length > 0) && (
            <section
              aria-label="العنوان ومواعيد العمل"
              className="mx-4 mt-5 space-y-3 sm:mx-8"
            >
              {mapsUrl && locationAddress && (
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-2xl border border-stone-100 bg-[#FCFCFA] p-4 transition hover:bg-white"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#FFF0EB] text-[#D95F43]">
                    <FaMapMarkerAlt size={18} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-stone-800">عنواننا</p>

                    <p className="mt-1 text-xs leading-6 text-stone-500">
                      {locationAddress}
                    </p>
                  </div>

                  <FaArrowLeft
                    aria-hidden="true"
                    className="shrink-0 text-xs text-stone-400"
                  />
                </a>
              )}

              {workingHours.length > 0 && (
                <details className="group rounded-2xl border border-stone-100 bg-[#FCFCFA]">
                  <summary className="flex cursor-pointer list-none items-center gap-4 rounded-2xl p-4 [&::-webkit-details-marker]:hidden">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#EDF3FA] text-[#476A95]">
                      <FaClock size={18} />
                    </span>

                    <div className="flex-1">
                      <h2 className="text-xs font-bold text-stone-800">
                        مواعيد العمل
                      </h2>

                      <p className="mt-1 text-[11px] text-stone-500">
                        اعرف مواعيد زيارتنا
                      </p>
                    </div>

                    <FaChevronDown
                      aria-hidden="true"
                      className="text-xs text-stone-400 transition-transform group-open:rotate-180"
                    />
                  </summary>

                  <dl className="mx-4 border-t border-stone-100 pb-2">
                    {workingHours.map((item, index) => (
                      <div
                        key={`${item.days}-${index}`}
                        className="flex flex-wrap justify-between gap-2 py-3 text-xs"
                      >
                        <dt className="font-bold text-stone-800">
                          {item.days}
                        </dt>

                        <dd className="text-stone-500">{item.hours}</dd>
                      </div>
                    ))}
                  </dl>
                </details>
              )}
            </section>
          )}

          <div className="mx-4 mt-5 flex items-center justify-center gap-2 border-t border-stone-100 py-4 text-[10px] text-stone-400 sm:mx-8">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-[var(--brand)]"
            />
            صفحة واحدة. وكل حاجة متوصّلة.
          </div>
        </article>

        <footer
          dir="ltr"
          className="flex items-center justify-center gap-2 py-6 text-[10px] text-stone-400"
        >
          Powered by
          <a
            href="https://tapko.link"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold tracking-tight text-stone-700"
          >
            tapko
            <span className="text-[#849225]">.</span>
          </a>
        </footer>
      </main>

      {/* نافذة فودافون كاش */}
      <dialog
        ref={dialogRef}
        aria-labelledby="payment-title"
        onClose={() => {
          setPayment(null);
          setCopied(false);
          setNotice("");
        }}
        className="m-auto w-[calc(100%_-_32px)] max-w-sm rounded-[28px] border-0 bg-white p-6 text-stone-800 shadow-2xl backdrop:bg-black/40 backdrop:backdrop-blur-sm"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 id="payment-title" className="text-lg font-bold">
            {payment?.name ?? "فودافون كاش"}
          </h2>

          <button
            type="button"
            onClick={closePayment}
            aria-label="إغلاق"
            className="grid size-9 place-items-center rounded-full bg-stone-100 transition hover:bg-stone-200"
          >
            <FaTimes size={13} />
          </button>
        </div>

        <p className="mt-4 text-xs leading-7 text-stone-500">
          انسخ رقم المحفظة وأكمل التحويل من تطبيقك.
        </p>

        <div className="mt-5 rounded-2xl border border-stone-200 bg-stone-50 p-4 text-center">
          <p className="text-[11px] text-stone-500">رقم المحفظة</p>

          <p dir="ltr" className="mt-2 select-all break-all text-lg font-bold">
            {payment?.value}
          </p>
        </div>

        <div className="mt-3 rounded-2xl bg-stone-50 p-4 text-center">
          <p className="text-[11px] text-stone-500">اسم المستفيد</p>

          <p className="mt-2 wrap-break-word text-sm font-bold text-stone-800">
            {payment?.beneficiary}
          </p>
        </div>

        <button
          type="button"
          onClick={copyPayment}
          className="mt-4 flex min-h-12 w-full items-center justify-center gap-3 rounded-2xl bg-[var(--brand)] text-sm font-bold text-[var(--on-brand)] transition hover:brightness-95"
        >
          {copied ? <FaCheck /> : <FaCopy />}
          {copied ? "تم نسخ الرقم" : "نسخ رقم المحفظة"}
        </button>

        <button
          type="button"
          onClick={closePayment}
          className="mx-auto mt-5 flex items-center gap-2 text-xs text-stone-500"
        >
          الرجوع للصفحة
          <FaArrowLeft size={10} />
        </button>

        <p className="mt-5 text-center text-[10px] leading-6 text-stone-400">
          تأكد من اسم المستفيد داخل تطبيق الدفع قبل تأكيد التحويل.
        </p>

        <p
          role="status"
          aria-live="polite"
          className="mt-3 text-center text-xs leading-6 text-stone-500"
        >
          {payment ? notice : ""}
        </p>
      </dialog>

      {/* إشعارات المشاركة والنسخ خارج النافذة */}
      <div
        role="status"
        aria-live="polite"
        className={
          notice && !payment
            ? "fixed bottom-5 left-1/2 z-50 w-max max-w-[90vw] -translate-x-1/2 rounded-2xl bg-stone-900 px-5 py-3 text-center text-xs leading-6 text-white shadow-xl"
            : "sr-only"
        }
      >
        {!payment ? notice : ""}
      </div>
    </div>
  );
}
