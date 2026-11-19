import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BrandProfile from "@/components/brand-profile";
import { getPublicBrand } from "@/lib/public-brand";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getPublicBrand(slug);

  return {
    title: brand ? `${brand.name} | Tapko` : "الصفحة غير موجودة",
    description: brand?.description,
  };
}

export default async function BrandPage({ params }: Props) {
  const { slug } = await params;
  const brand = await getPublicBrand(slug);

  if (!brand) notFound();

  return <BrandProfile brand={brand} />;
}
