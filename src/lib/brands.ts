export type Brand = {
  slug: string;
  name: string;
  description: string;
  category: string;
  demo?: boolean;

  contact?: {
    phone: string;
  };

  location?: {
    address: string;
    mapsUrl: string;
  };

  workingHours?: {
    days: string;
    hours: string;
  }[];

  theme: {
    primary: string;
    onPrimary: string;
    background: string;
    cover: string;
  };

  logo?: string;
  coverImage?: string;

  links: {
    website?: string;
    menu?: string;
    facebook?: string;
    whatsapp?: string;
    instagram?: string;
    tiktok?: string;
    x?: string;
    googleReview?: string;
  };

  payments: {
    instapay?: string;
    vodafoneCash?: string;
    vodafoneCashName?: string;
  };
};

export const brands: Brand[] = [
  {
    slug: "tapko",
    name: "Tapko",
    description: "لمسة واحدة، وكل طرق التواصل في مكان واحد.",
    category: "NFC • Smart Connections",

    contact: {
      phone: "+201055855469",
    },

    // شيل التعليقات بعد كتابة العنوان ورابط المكان الحقيقيين:
    // location: {
    //   address: "عنوان الفرع",
    //   mapsUrl: "رابط المكان الكامل من جوجل مابس",
    // },

    // شيل التعليقات بعد تعديل المواعيد لبيانات النشاط الفعلية:
    workingHours: [
      {
        days: "السبت – الخميس",
        hours: "من 12 صباحًا إلى 12 مساءً",
      },
      {
        days: "الجمعة",
        hours: "من 6 مساءً إلى 12 مساءً",
      },
    ],

    theme: {
      primary: "#CDDE54",
      onPrimary: "#22201F",
      background: "#F5F5F0",
      cover: "#22201F",
    },

    logo: "/images/tapko/logo.png",
    coverImage: "/images/tapko/Cover-tapko.jpg",

    links: {
      website: "https://tapko.link",
      whatsapp: "https://wa.me/201055855469",
      facebook: "https://www.facebook.com/tapko.link/",
      instagram: "https://www.instagram.com/tapko.link/",
      tiktok: "https://www.tiktok.com/@tapko.link",

      // menu: "https://...",
      // googleReview: "https://...",
    },

    payments: {
      instapay: "https://ipn.eg/S/nourverse/instapay/3zmxKo",
      vodafoneCash: "01055855469",
      vodafoneCashName: "عبدالرحمن م**** م**** ن***",
    },
  },

  {
    slug: "restaurant-demo",
    name: "مطعم تجريبي",
    description: "مثال لتطبيق نفس القالب على نشاط مطعم.",
    category: "مطاعم وكافيهات",
    demo: true,

    theme: {
      primary: "#F6B65B",
      onPrimary: "#302015",
      background: "#FAF6F0",
      cover: "#35251D",
    },

    links: {},
    payments: {},
  },

  {
    slug: "store-demo",
    name: "متجر تجريبي",
    description: "مثال لتطبيق نفس القالب على متجر.",
    category: "تسوّق ومنتجات",
    demo: true,

    theme: {
      primary: "#C9B9FF",
      onPrimary: "#2D2049",
      background: "#F5F3FA",
      cover: "#292033",
    },

    links: {},
    payments: {},
  },
];

export function getBrand(slug: string) {
  return brands.find((brand) => brand.slug === slug);
}
