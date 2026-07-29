import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import CategorySection from "@/components/CategorySection";
import ProductsSection from "@/components/ProductsSection";
import CatalogSearchSection from "@/components/CatalogSearchSection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main>
      <Header overlay />

      <Hero />

      <ProductsSection />

      <About />

      <CategorySection />

      <CatalogSearchSection />

      <Footer />
    </main>
  );
}
