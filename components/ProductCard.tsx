import Image from "next/image";
import Link from "next/link";

export type Product = {
  id?: string | number;
  product_code?: string | null;
  title?: string | null;
  category?: string | null;
  collection?: string | null;
  size?: string | null;
  dimensions?: string | null;
  yarn_material?: string | null;
  color?: string | null;
  colors?: string | null;
  description?: string | null;
  image?: string | null;
};

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const productCode = product.product_code?.trim() || "بدون کد";
  const productTitle = product.title?.trim() || "طرح یزد افشین";
  const category = product.collection?.trim() || product.category?.trim() || "محصول ویژه";
  const size = product.dimensions?.trim() || product.size?.trim() || "برای استعلام تماس بگیرید";
  const yarnMaterial = product.yarn_material?.trim() || "ثبت نشده";
  const color = product.colors?.trim() || product.color?.trim() || "متنوع";

  const content = (
    <>
      <div className="productImageWrapper">
        {product.image ? (
          <Image
            src={product.image}
            alt={`محصول ${productTitle}`}
            fill
            sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"
            className="productImage"
          />
        ) : (
          <div className="productImagePlaceholder">
            <span>YAZD AFSHIN</span>
            <strong>تصویر محصول</strong>
          </div>
        )}

        <span className="productCategoryBadge">{category}</span>
      </div>

      <div className="productCardContent">
        <div className="productCardHeading">
          <div>
            <span className="productCodeLabel">{productTitle}</span>
            <h3>{productCode}</h3>
          </div>

          <span className="productCardArrow" aria-hidden="true">
            ←
          </span>
        </div>

        <div className="productDetails">
          <div>
            <span>ابعاد</span>
            <strong>{size}</strong>
          </div>

          <div>
            <span>جنس نخ</span>
            <strong>{yarnMaterial}</strong>
          </div>

          <div>
            <span>رنگ‌بندی</span>
            <strong>{color}</strong>
          </div>
        </div>

        {product.description && <p className="productDescription">{product.description}</p>}

        <span className="productInquiryButton">مشاهده محصول</span>
      </div>
    </>
  );

  if (product.id == null) {
    return <article className="productCard">{content}</article>;
  }

  return (
    <Link href={`/products/${product.id}`} className="productCard" aria-label={`مشاهده ${productTitle}`}>
      {content}
    </Link>
  );
}
