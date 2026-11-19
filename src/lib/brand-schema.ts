import { z } from "zod";

const optionalText = z.string().trim().max(200).optional();

const optionalUrl = z
  .union([z.literal(""), z.httpUrl().max(2000)])
  .optional()
  .transform((value) => value || undefined);

const imagePath = z
  .string()
  .trim()
  .max(500)
  .refine(
    (value) =>
      !value ||
      (value.startsWith("/images/") &&
        !value.includes("..") &&
        /\.(png|jpe?g|webp|avif|gif)$/i.test(value)),
    "مسار الصورة لازم يبدأ بـ /images/ وينتهي بامتداد صورة.",
  )
  .optional()
  .transform((value) => value || undefined);

const phone = z
  .string()
  .trim()
  .regex(/^\+?[0-9 ()-]{7,25}$/, "رقم الهاتف غير صالح.");

export const brandSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      "الرابط يقبل حروف إنجليزية صغيرة وأرقام وشرطات بين الكلمات.",
    )
    .refine(
      (value) => !["admin", "login", "api", "auth", "images"].includes(value),
      "اسم الرابط ده محجوز.",
    ),

  name: z.string().trim().min(1, "اسم العميل مطلوب.").max(100),
  description: z.string().trim().max(500),
  category: z.string().trim().max(100),

  demo: z.boolean().optional(),

  logo: imagePath,
  coverImage: imagePath,

  theme: z.object({
    primary: z.string().regex(/^#[0-9a-f]{6}$/i),
    onPrimary: z.string().regex(/^#[0-9a-f]{6}$/i),
    background: z.string().regex(/^#[0-9a-f]{6}$/i),
    cover: z.string().regex(/^#[0-9a-f]{6}$/i),
  }),

  contact: z
    .object({
      phone,
    })
    .optional(),

  location: z
    .object({
      address: z.string().trim().min(1).max(300),
      mapsUrl: z.httpUrl().max(2000),
    })
    .optional(),

  workingHours: z
    .array(
      z.object({
        days: z.string().trim().min(1).max(100),
        hours: z.string().trim().min(1).max(150),
      }),
    )
    .max(14)
    .optional(),

  links: z.object({
    website: optionalUrl,
    menu: optionalUrl,
    facebook: optionalUrl,
    whatsapp: optionalUrl,
    instagram: optionalUrl,
    tiktok: optionalUrl,
    x: optionalUrl,
    googleReview: optionalUrl,
  }),

  payments: z
    .object({
      instapay: optionalUrl,
      vodafoneCash: optionalText,
      vodafoneCashName: optionalText,
    })
    .superRefine((value, context) => {
      const number = value.vodafoneCash?.trim();
      const name = value.vodafoneCashName?.trim();

      if (Boolean(number) !== Boolean(name)) {
        context.addIssue({
          code: "custom",
          message: "ضيف رقم فودافون كاش واسم المستفيد مع بعض.",
        });
      }

      if (number && !phone.safeParse(number).success) {
        context.addIssue({
          code: "custom",
          message: "رقم فودافون كاش غير صالح.",
        });
      }
    }),
});
