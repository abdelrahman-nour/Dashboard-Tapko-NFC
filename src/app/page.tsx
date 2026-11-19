import BrandProfile from "@/components/brand-profile";
import { getBrand } from "@/lib/brands";

export default function HomePage() {
  const brand = getBrand("tapko");

  if (!brand) return null;

  return <BrandProfile brand={brand} />;
}
