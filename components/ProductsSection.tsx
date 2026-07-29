"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProductCard, { Product } from "@/components/ProductCard";
import { supabase } from "@/lib/supabase";

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadLatestProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(4);

      if (error) {
        console.error("Supabase latest products error:", error);
        setErrorMessage(error.message);
      } else {
        setProducts(data || []);
      }

      setLoading(false);
    }

    loadLatestProducts();
  }, []);

  return (
    <section id="latest-products" className="productsSection">
      <div className="container">
        <div className="productsHeading">
          <div>
            <h2>جدیدترین محصولات</h2>
          </div>

          <Link href="#collections" className="productsViewAll">
            مشاهده کالکشن‌ها <span aria-hidden="true">←</span>
          </Link>
        </div>

        {loading && <div className="productsStatus">در حال دریافت جدیدترین محصولات...</div>}

        {!loading && errorMessage && (
          <div className="productsStatus productsError">{errorMessage}</div>
        )}

        {!loading && !errorMessage && products.length === 0 && (
          <div className="productsStatus">هنوز محصولی ثبت نشده است.</div>
        )}

        {!loading && !errorMessage && products.length > 0 && (
          <div className="productsGrid">
            {products.map((product) => (
              <ProductCard key={product.id ?? product.product_code} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
