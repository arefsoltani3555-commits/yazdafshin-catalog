"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard, { Product } from "@/components/ProductCard";
import SearchBox from "@/components/SearchBox";
import { supabase } from "@/lib/supabase";

type SearchProduct = Product & {
  title?: string | null;
  collection?: string | null;
  dimensions?: string | null;
  colors?: string | null;
};

function splitValues(value: string | null | undefined) {
  return value
    ? value.split(/[,،]/).map((item) => item.trim()).filter(Boolean)
    : [];
}

export default function CatalogSearchSection() {
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [collection, setCollection] = useState("");
  const [size, setSize] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadSearchCatalog() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1000);

      if (error) {
        setErrorMessage(error.message);
      } else {
        setProducts((data || []) as SearchProduct[]);
      }

      setLoading(false);
    }

    loadSearchCatalog();
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category).filter(Boolean))) as string[],
    [products]
  );

  const collections = useMemo(
    () => Array.from(new Set(products.map((product) => product.collection).filter(Boolean))) as string[],
    [products]
  );

  const sizes = useMemo(
    () => Array.from(new Set(products.flatMap((product) => splitValues(product.dimensions || product.size)))) as string[],
    [products]
  );

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const searchableText = [
        product.product_code,
        product.title,
        product.category,
        product.collection,
        product.yarn_material,
        product.colors,
        product.color,
        product.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        (!query || searchableText.includes(query)) &&
        (!category || product.category === category) &&
        (!collection || product.collection === collection) &&
        (!size || splitValues(product.dimensions || product.size).includes(size))
      );
    });
  }, [category, collection, products, searchTerm, size]);

  function clearFilters() {
    setSearchTerm("");
    setCategory("");
    setCollection("");
    setSize("");
  }

  return (
    <>
      <SearchBox
        searchTerm={searchTerm}
        category={category}
        collection={collection}
        size={size}
        categories={categories}
        collections={collections}
        sizes={sizes}
        onSearchChange={setSearchTerm}
        onCategoryChange={setCategory}
        onCollectionChange={setCollection}
        onSizeChange={setSize}
        onClear={clearFilters}
      />

      <section className="searchResultsSection">
        <div className="container">
          <div className="searchResultsHeading">
            <div>
              <span className="sectionEyebrow">نتیجه جستجوی کاتالوگ</span>
              <h2>{loading ? "در حال آماده‌سازی کاتالوگ" : `${filteredProducts.length} محصول پیدا شد`}</h2>
            </div>
            <span className="searchResultsHint">جستجو در کد، عنوان، کالکشن، رنگ و مشخصات</span>
          </div>

          {errorMessage && <div className="productsStatus productsError">خطا در دریافت کاتالوگ: {errorMessage}</div>}
          {!loading && !errorMessage && filteredProducts.length === 0 && (
            <div className="productsStatus">محصولی با این مشخصات پیدا نشد؛ فیلترها را تغییر دهید.</div>
          )}
          {!loading && !errorMessage && filteredProducts.length > 0 && (
            <div className="productsGrid searchResultsGrid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id ?? product.product_code} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
