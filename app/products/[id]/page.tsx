import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import ProductDetailsClient from "@/components/ProductDetailsClient";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type Product = {
  id: string;
  product_code: string;
  category: string;
  collection: string | null;
  dimensions: string | null;
  yarn_material: string | null;
  colors: string | null;
  washable: boolean | null;
  anti_allergy: boolean | null;
  description: string | null;
  image: string | null;
  images: string[] | null;
  title: string | null;
  weight: string | null;
  thickness: string | null;
  is_active: boolean | null;
};

type RelatedProduct = {
  id: string;
  product_code: string;
  title: string | null;
  image: string | null;
  dimensions: string | null;
  yarn_material: string | null;
};

const collectionNames: Record<string, string> = {
  velvet: "مخمل",
  "lurex-velvet": "مخمل زرکدار",
  "silk-velvet": "مخمل ابریشم",
  "vintage-silk": "مخمل ابریشم وینتیج",
  "double-chenille": "مخمل ابریشم دوشانل",
  "reversible-velvet": "مخمل دوشانل دورو",
  "koblen-reversible": "مخمل دوشانل کوبلنی",
  "full-velvet": "تمام مخمل (پتوفرش)",
  "table-cover": "زیر سفره ای",
};

const collectionAliases: Record<string, string[]> = {
  velvet: ["velvet", "مخمل"],
  "lurex-velvet": ["lurex-velvet", "مخمل زرکدار"],
  "silk-velvet": ["silk-velvet", "مخمل ابریشم"],
  "vintage-silk": ["vintage-silk", "مخمل ابریشم وینتیج", "ابریشم پتینه"],
  "double-chenille": ["double-chenille", "مخمل ابریشم دوشانل", "مخمل دوشانل"],
  "reversible-velvet": ["reversible-velvet", "double-chenille-reversible", "مخمل دوشانل دورو"],
  "koblen-reversible": ["koblen-reversible", "double-chenille-koblen", "مخمل دوشانل کوبلنی", "دوشانل کوبلنی"],
  "full-velvet": ["full-velvet", "تمام مخمل", "تمام مخمل (پتوفرش)", "پتوفرش"],
  "table-cover": ["table-cover", "زیر سفره ای", "زیرسفره‌ای", "زیر سفره‌ای"],
};

function normalizeCollectionValue(value: string | null | undefined) {
  if (!value) return "";

  return value
    .trim()
    .replace(/\u200c/g, " ")
    .replace(/\s+/g, " ")
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .toLowerCase();
}

function normalizeCollectionSlug(value: string | null) {
  const normalized = normalizeCollectionValue(value);
  if (!normalized) return null;

  for (const [slug, aliases] of Object.entries(collectionAliases)) {
    if (aliases.some((alias) => normalizeCollectionValue(alias) === normalized)) {
      return slug;
    }
  }

  return value;
}

function getRelatedCollectionKeys(value: string | null) {
  const normalized = normalizeCollectionSlug(value);
  if (!normalized) return [];
  return Array.from(new Set(collectionAliases[normalized] ?? [normalized]));
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("products")
    .select(
      "id, product_code, category, collection, dimensions, yarn_material, colors, washable, anti_allergy, description, image, images, title, weight, thickness, is_active"
    )
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (error || !data) notFound();

  const product = data as Product;
  const normalizedCollection = normalizeCollectionSlug(product.collection);
  const relatedCollectionKeys = getRelatedCollectionKeys(product.collection);

  const { data: relatedData } = relatedCollectionKeys.length > 0
    ? await supabase
        .from("products")
        .select("id, product_code, title, image, dimensions, yarn_material")
        .in("collection", relatedCollectionKeys)
        .eq("is_active", true)
        .neq("id", product.id)
        .order("created_at", { ascending: false })
        .limit(4)
    : { data: [] as RelatedProduct[] };

  const { data: galleryData } = await supabase
    .from("product_images")
    .select("url, sort_order")
    .eq("product_id", product.id)
    .order("sort_order", { ascending: true });

  const primaryGallery = Array.from(
    new Set(
      [product.image, ...(Array.isArray(product.images) ? product.images : [])].filter((item): item is string => Boolean(item))
    )
  );

  const fallbackGalleryImages = Array.from(new Set((galleryData ?? []).map((item) => item.url).filter(Boolean)));

  const galleryImages = primaryGallery.length > 0 ? primaryGallery : fallbackGalleryImages;

  const fallbackGallery =
    normalizedCollection === "koblen-reversible"
      ? "/collections/koblen-reversible-hero.png"
      : normalizedCollection === "double-chenille"
        ? "/collections/double-chenille-hero.png"
        : normalizedCollection === "silk-velvet"
          ? "/collections/silk-velvet-hero.png"
          : "/collections/velvet-hero.png";

  const finalGallery = galleryImages.length > 0 ? galleryImages : [fallbackGallery];

  const collectionTitle = normalizedCollection
    ? collectionNames[normalizedCollection] ?? normalizedCollection
    : product.category;
  const collectionHref = normalizedCollection ? `/collections/${normalizedCollection}` : null;

  const colorLabels = product.colors
    ? product.colors
        .split(/[،,|/]+/)
        .map((color) => color.trim())
        .filter(Boolean)
    : ["زرشکی", "سرمه‌ای", "کرم", "طوسی", "نسکافه‌ای"];

  return (
    <>
      <ProductDetailsClient
        product={product}
        collectionTitle={collectionTitle}
        collectionHref={collectionHref}
        galleryImages={finalGallery}
        colorLabels={colorLabels}
        relatedProducts={(relatedData ?? []) as RelatedProduct[]}
      />
      <Footer />
    </>
  );
}
