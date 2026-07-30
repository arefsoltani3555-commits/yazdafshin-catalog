"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./ProductDetailsClient.module.css";

type RelatedProduct = {
  id: string;
  product_code: string;
  title: string | null;
  image: string | null;
  dimensions: string | null;
  yarn_material: string | null;
};

type ProductDetailsClientProps = {
  product: {
    id: string;
    product_code: string;
    title: string | null;
    category: string;
    collection: string | null;
    dimensions: string | null;
    yarn_material: string | null;
    colors: string | null;
    description: string | null;
    weight: string | null;
    thickness: string | null;
    washable: boolean | null;
    anti_allergy: boolean | null;
  };
  collectionTitle: string;
  collectionHref: null | string;
  galleryImages: string[];
  colorLabels: string[];
  relatedProducts: RelatedProduct[];
};

type FeatureIcon =
  | "silk"
  | "shield"
  | "wash"
  | "palette"
  | "weave"
  | "feather"
  | "material"
  | "weight"
  | "thickness"
  | "feature"
  | "count"
  | "sizeRect"
  | "sizeRound"
  | "sizeRunner"
  | "favorite"
  | "share"
  | "download"
  | "support"
  | "search"
  | "back"
  | "chevronLeft"
  | "chevronRight";

function Icon({ name }: { name: FeatureIcon }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "back":
      return (
        <svg {...common}>
          <path d="M15 18 9 12l6-6" />
          <path d="M10 12h9" />
        </svg>
      );
    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="6.5" />
          <path d="m20 20-3.6-3.6" />
        </svg>
      );
    case "favorite":
      return (
        <svg {...common}>
          <path d="m12 20-1.1-1C6 14.6 3 11.9 3 8.5A4.5 4.5 0 0 1 7.5 4C9.2 4 10.8 4.8 12 6c1.2-1.2 2.8-2 4.5-2A4.5 4.5 0 0 1 21 8.5c0 3.4-3 6.1-7.9 10.5Z" />
        </svg>
      );
    case "share":
      return (
        <svg {...common}>
          <circle cx="6" cy="12" r="1.7" />
          <circle cx="18" cy="6" r="1.7" />
          <circle cx="18" cy="18" r="1.7" />
          <path d="m7.5 11.2 8-4.2" />
          <path d="m7.5 12.8 8 4.2" />
        </svg>
      );
    case "download":
      return (
        <svg {...common}>
          <path d="M12 4v10" />
          <path d="m8 10 4 4 4-4" />
          <path d="M5 20h14" />
        </svg>
      );
    case "support":
      return (
        <svg {...common}>
          <path d="M4 13a8 8 0 0 1 16 0" />
          <path d="M5 13v4a2 2 0 0 0 2 2h1v-6H7a2 2 0 0 0-2 2Z" />
          <path d="M19 13v4a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2Z" />
        </svg>
      );
    case "chevronLeft":
      return (
        <svg {...common}>
          <path d="m14 6-6 6 6 6" />
        </svg>
      );
    case "chevronRight":
      return (
        <svg {...common}>
          <path d="m10 6 6 6-6 6" />
        </svg>
      );
    case "material":
      return (
        <svg {...common}>
          <path d="M7 4c2 2 2 4 0 6s-2 4 0 6 2 4 0 4" />
          <path d="M12 4c2 2 2 4 0 6s-2 4 0 6 2 4 0 4" />
          <path d="M17 4c2 2 2 4 0 6s-2 4 0 6 2 4 0 4" />
        </svg>
      );
    case "weight":
      return (
        <svg {...common}>
          <path d="M8 8a4 4 0 0 1 8 0" />
          <path d="M6 9.5h12l-1.5 10a1.8 1.8 0 0 1-1.8 1.5H9.3a1.8 1.8 0 0 1-1.8-1.5Z" />
        </svg>
      );
    case "thickness":
      return (
        <svg {...common}>
          <path d="M12 4v16" />
          <path d="M6 8h12" />
          <path d="M4 12h16" />
          <path d="M6 16h12" />
        </svg>
      );
    case "feature":
      return (
        <svg {...common}>
          <path d="M12 3.5 19 7v5c0 4.4-2.6 7.5-7 8.8C7.6 19.5 5 16.4 5 12V7Z" />
          <path d="m9.5 12.2 1.7 1.7 3.4-3.7" />
        </svg>
      );
    case "count":
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="2" />
          <circle cx="16" cy="8" r="2" />
          <circle cx="8" cy="16" r="2" />
          <circle cx="16" cy="16" r="2" />
        </svg>
      );
    case "weave":
      return (
        <svg {...common}>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
          <path d="M7 4v16" />
          <path d="M12 4v16" />
          <path d="M17 4v16" />
        </svg>
      );
    case "palette":
      return (
        <svg {...common}>
          <path d="M12 20a8 8 0 1 1 8-8c0 1.6-1.1 2.5-2.5 2.5H15c-.9 0-1.5.6-1.5 1.5 0 1.7-.8 4-1.5 4Z" />
          <circle cx="8" cy="10" r="1" />
          <circle cx="12" cy="7.5" r="1" />
          <circle cx="15.5" cy="10" r="1" />
        </svg>
      );
    case "wash":
      return (
        <svg {...common}>
          <rect x="5" y="4" width="14" height="16" rx="2" />
          <circle cx="12" cy="12.5" r="3" />
          <path d="M8 7.5h8" />
        </svg>
      );
    case "silk":
      return (
        <svg {...common}>
          <path d="M6 14c4-2 5.5-6.5 6-10 2.5 4.3 2.1 9.7-.5 13.1C9.8 19.3 7.7 20 6 20c2.2-1.8 3.4-3.6 3.7-5.1C8.5 15 7.3 14.7 6 14Z" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3.5 19 7v5c0 4.4-2.6 7.5-7 8.8C7.6 19.5 5 16.4 5 12V7Z" />
          <path d="M12 8v6" />
        </svg>
      );
    case "feather":
      return (
        <svg {...common}>
          <path d="M19 5c-4.8.4-8 2.6-10 6.5-.8 1.5-1.5 4-1.5 7.5 2.2-2.1 4-3.3 5.4-3.8 3.4-1.1 5.8-4.1 6.1-10.2Z" />
          <path d="M9 14c2-1.1 4-2.9 6-5.5" />
        </svg>
      );
    case "sizeRect":
      return (
        <svg {...common}>
          <rect x="6" y="4" width="12" height="16" rx="1.2" />
          <path d="M8.5 6.5h7" />
          <path d="M8.5 17.5h7" />
        </svg>
      );
    case "sizeRunner":
      return (
        <svg {...common}>
          <rect x="8" y="3.5" width="8" height="17" rx="1" />
          <path d="M9.5 6h5" />
          <path d="M9.5 18h5" />
        </svg>
      );
    case "sizeRound":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="7.5" />
          <path d="M12 4.5v2.2" />
          <path d="M12 17.3v2.2" />
          <path d="M4.5 12h2.2" />
          <path d="M17.3 12h2.2" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}

function normalizeColor(label: string) {
  return label.trim().replace(/\s+/g, " ").toLowerCase();
}

function colorHex(label: string, index: number) {
  const value = normalizeColor(label);
  if (value.includes("زرشکی")) return "#9b1029";
  if (value.includes("سرمه")) return "#152b61";
  if (value.includes("آبی")) return "#1c4786";
  if (value.includes("سبز")) return "#0f4b38";
  if (value.includes("کرم")) return "#e2d4af";
  if (value.includes("طلایی")) return "#b58c49";
  if (value.includes("طوسی")) return "#989aa1";
  if (value.includes("نقره")) return "#b9bcc3";
  if (value.includes("نسکافه")) return "#97714a";
  if (value.includes("قهوه")) return "#6c4428";
  if (value.includes("مشکی")) return "#1b1b1d";
  if (value.includes("سفید")) return "#f1eadc";
  if (value.includes("قرمز")) return "#b11f39";
  return ["#9b1029", "#0f4b38", "#e2d4af", "#1c4786", "#989aa1", "#97714a"][index % 6];
}

function splitDimensions(dimensions: string | null) {
  const fallback = [
    "۱۲ متری (۳ × ۴)",
    "۹ متری (۲.۵ × ۳.۵)",
    "۶ متری (۲ × ۳)",
    "۳ متری (۱.۵ × ۲)",
    "۱.۵ متری (۱ × ۱.۵)",
    "پادری",
    "کناره ۲ متری (۱ × ۲)",
  ];

  const source = dimensions
    ? dimensions
        .split(/[\n،,|]+/)
        .map((item) => item.trim())
        .filter(Boolean)
    : fallback;

  return source.slice(0, 7);
}

function buildSizeCards(dimensions: string | null) {
  return splitDimensions(dimensions).map((item) => {
    const normalized = item.replace(/\s+/g, " ");
    const isRound = normalized.includes("گرد") || normalized.includes("پادری");
    const isRunner = normalized.includes("کناره");

    return {
      title: normalized.split("(")[0].trim(),
      subtitle: normalized.includes("(") ? `(${normalized.split("(")[1]}` : isRound ? "(تماس بگیرید)" : "",
      status: normalized.includes("پادری") ? "تماس" : "موجود",
      icon: isRound ? "sizeRound" : isRunner ? "sizeRunner" : "sizeRect",
    };
  });
}

function buildProductFeatures(product: ProductDetailsClientProps["product"], collectionTitle: string) {
  return [
    {
      icon: "silk" as FeatureIcon,
      title: "لطافت بالا",
      text: product.yarn_material?.includes("ابریشم")
        ? "سطحی نرم و خوش‌حس با جلوه‌ای لطیف"
        : "بافت نرم و مناسب استفاده روزمره",
    },
    {
      icon: "shield" as FeatureIcon,
      title: "ایمنی و پایداری",
      text: product.anti_allergy ? "ضد حساسیت و مطمئن برای استفاده خانگی" : "قرارگیری پایدار و ایمن روی سطوح مختلف",
    },
    {
      icon: "wash" as FeatureIcon,
      title: "نگهداری آسان",
      text: product.washable ? "قابل شستشو و مناسب استفاده مداوم" : "تمیزشوندگی مناسب و نگهداری آسان",
    },
    {
      icon: "palette" as FeatureIcon,
      title: "تنوع رنگ",
      text: "هماهنگ با دکوراسیون کلاسیک و مدرن",
    },
    {
      icon: "weave" as FeatureIcon,
      title: "بافت ماندگار",
      text: `مناسب برای کالکشن ${collectionTitle}`,
    },
    {
      icon: "feather" as FeatureIcon,
      title: "کاربری راحت",
      text: "چیدمان جمع‌وجور و مناسب فضاهای مختلف",
    },
  ];
}

function buildSpecRows(product: ProductDetailsClientProps["product"], colorCount: number) {
  return [
    { icon: "material" as FeatureIcon, label: "جنس نخ", value: product.yarn_material || "پلی‌استر + شانل" },
    { icon: "weight" as FeatureIcon, label: "وزن", value: product.weight || "۷ کیلوگرم" },
    { icon: "thickness" as FeatureIcon, label: "ضخامت", value: product.thickness || "۸ میلی‌متر" },
    {
      icon: "feature" as FeatureIcon,
      label: "ویژگی",
      value: `${product.washable ? "قابل شستشو" : "ضد لغزش"}${product.anti_allergy ? " · ضد حساسیت" : ""}`,
    },
    { icon: "count" as FeatureIcon, label: "تعداد رنگ", value: `${colorCount} رنگ` },
    {
      icon: "weave" as FeatureIcon,
      label: "نوع بافت",
      value: product.category || "مخمل",
    },
  ];
}

export default function ProductDetailsClient({
  product,
  collectionTitle,
  collectionHref,
  galleryImages,
  colorLabels,
  relatedProducts,
}: ProductDetailsClientProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const selectedImage = galleryImages[selectedIndex] ?? galleryImages[0] ?? null;
  const sizeCards = useMemo(() => buildSizeCards(product.dimensions), [product.dimensions]);
  const features = useMemo(() => buildProductFeatures(product, collectionTitle), [product, collectionTitle]);
  const specRows = useMemo(() => buildSpecRows(product, colorLabels.length || 1), [product, colorLabels.length]);
  const displayTitle = product.title || `طرح ${product.product_code}`;
  const displayCode = product.product_code.toUpperCase();

  return (
    <main className={styles.page} dir="rtl">
      <section className={styles.hero}>
        <div className={`container ${styles.container}`}>
          <header className={styles.header}>
            <div className={styles.headerRight}>
              <Link href="/" className={styles.brand}>
                <Image
                  src="/yazd-afshin-logo.png"
                  alt="لوگوی یزد افشین"
                  width={92}
                  height={92}
                  priority
                  className={styles.brandLogo}
                />
                <div className={styles.brandText}>
                  <strong>یزد افشین</strong>
                  <span>YAZD AFSHIN</span>
                  <small>SINCE 1977</small>
                </div>
              </Link>
            </div>

            <nav className={styles.nav}>
              <Link href="/">صفحه اصلی</Link>
              <Link href="/#collections">کالکشن‌ها</Link>
              <Link href="/#about">درباره ما</Link>
              <Link href="/#contact">تماس با ما</Link>
            </nav>

            <div className={styles.headerLeft}>
              <Link href="/" className={styles.backButton}>
                <Icon name="back" />
                <span>بازگشت</span>
              </Link>
            </div>
          </header>

          <div className={styles.headerDivider}>
            <span />
          </div>

          <div className={styles.breadcrumbs}>
            <Link href="/">صفحه اصلی</Link>
            <span>/</span>
            <Link href="/#collections">کالکشن‌ها</Link>
            <span>/</span>
            {collectionHref ? <Link href={collectionHref}>{collectionTitle}</Link> : <span>{collectionTitle}</span>}
            <span>/</span>
            <strong>{displayTitle}</strong>
          </div>

          <div className={styles.topSection}>
            <section className={styles.gallerySection}>
              <div className={styles.galleryShell}>
                <div
                  className={styles.mainImageCard}
                  onClick={() => selectedImage && setIsLightboxOpen(true)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setIsLightboxOpen(true);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  {selectedImage ? (
                    <Image
                      src={selectedImage}
                      alt={displayTitle}
                      fill
                      priority
                      sizes="(max-width: 900px) 100vw, 58vw"
                      className={styles.mainImage}
                    />
                  ) : (
                    <div className={styles.empty}>تصویر محصول ثبت نشده است</div>
                  )}

                  <div className={styles.imageCounter}>
                    <strong>{String(selectedIndex + 1).padStart(2, "0")}</strong>
                    <span>/</span>
                    <small>{String(galleryImages.length).padStart(2, "0")}</small>
                  </div>

                  <button
                    type="button"
                    className={`${styles.sideNav} ${styles.sideNavRight}`}
                    aria-label="تصویر بعدی"
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedIndex((prev) => (prev + 1) % galleryImages.length);
                    }}
                  >
                    <Icon name="chevronRight" />
                  </button>

                  <button
                    type="button"
                    className={`${styles.sideNav} ${styles.sideNavLeft}`}
                    aria-label="تصویر قبلی"
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
                    }}
                  >
                    <Icon name="chevronLeft" />
                  </button>

                  <button
                    type="button"
                    className={styles.zoomButton}
                    aria-label="بزرگ‌نمایی تصویر"
                    onClick={(event) => {
                      event.stopPropagation();
                      setIsLightboxOpen(true);
                    }}
                  >
                    <Icon name="search" />
                  </button>
                </div>

                <div className={styles.thumbRow}>
                  {galleryImages.slice(0, 5).map((image, index) => (
                    <button
                      key={image + index}
                      type="button"
                      className={`${styles.thumbCard} ${selectedIndex === index ? styles.thumbCardActive : ""}`}
                      onClick={() => setSelectedIndex(index)}
                      aria-label={`تصویر ${index + 1}`}
                    >
                      <Image src={image} alt={`تصویر ${index + 1}`} fill sizes="120px" className={styles.thumbImage} />
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <aside className={styles.infoSection}>
              <div className={styles.infoPanel}>
                <span className={styles.collectionBadge}>{collectionTitle}</span>

                <div className={styles.headingBlock}>
                  <h1 className={styles.title}>{displayTitle}</h1>
                  <div className={styles.productCode}>
                    <span>کد محصول:</span>
                    <strong>{displayCode}</strong>
                  </div>
                </div>

                <div className={styles.ornament}>
                  <span />
                </div>

                <div className={styles.specList}>
                  {specRows.map((item) => (
                    <div key={item.label} className={styles.specRow}>
                      <div className={styles.specText}>
                        <span className={styles.specLabel}>{item.label}:</span>
                        <strong className={styles.specValue}>{item.value}</strong>
                      </div>
                      <div className={styles.specIconWrap}>
                        <Icon name={item.icon} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.colorsBox}>
                  <h3>رنگ‌بندی</h3>
                  <div className={styles.colorDots}>
                    {colorLabels.map((label, index) => (
                      <button key={label + index} type="button" className={styles.colorDot} aria-label={label} title={label}>
                        <i style={{ backgroundColor: colorHex(label, index) }} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>

          <section className={styles.sizesSection}>
            <div className={styles.sectionTitle}>
              <span />
              <h2>سایزبندی موجود</h2>
              <span />
            </div>

            <div className={styles.sizesGrid}>
              {sizeCards.map((item, index) => (
                <div key={item.title + index} className={styles.sizeCard}>
                  <div className={styles.sizeIcon}>
                    <Icon name={item.icon as FeatureIcon} />
                  </div>
                  <strong>{item.title}</strong>
                  {item.subtitle ? <small>{item.subtitle}</small> : <small> </small>}
                  <button type="button" className={styles.sizeStatus}>
                    {item.status}
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.featuresSection}>
            <div className={styles.sectionTitle}>
              <span />
              <h2>ویژگی‌های برجسته</h2>
              <span />
            </div>

            <div className={styles.featuresGrid}>
              {features.map((item) => (
                <div key={item.title} className={styles.featureCard}>
                  <div className={styles.featureIcon}>
                    <Icon name={item.icon} />
                  </div>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.actionsBar}>
            <Link href="/#contact" className={styles.actionButton}>
              <span>دریافت کاتالوگ</span>
              <Icon name="download" />
            </Link>

            <button type="button" className={styles.actionButton}>
              <span>اشتراک‌گذاری</span>
              <Icon name="share" />
            </button>

            <button type="button" className={styles.actionButton}>
              <span>افزودن به علاقه‌مندی</span>
              <Icon name="favorite" />
            </button>

            <Link href="/#contact" className={`${styles.actionButton} ${styles.primaryAction}`}>
              <span>درخواست مشاوره</span>
              <Icon name="support" />
            </Link>
          </section>

          {product.description && (
            <section className={styles.descriptionBox}>
              <p>{product.description}</p>
            </section>
          )}

          {relatedProducts.length > 0 && (
            <section className={styles.relatedSection}>
              <div className={styles.sectionTitle}>
                <span />
                <h2>محصولات مشابه</h2>
                <span />
              </div>

              <div className={styles.relatedGrid}>
                {relatedProducts.map((item) => (
                  <Link key={item.id} href={`/products/${item.id}`} className={styles.relatedCard}>
                    <div className={styles.relatedImageWrap}>
                      {item.image ? (
                        <Image src={item.image} alt={item.title || item.product_code} fill sizes="(max-width: 900px) 100vw, 25vw" />
                      ) : (
                        <div className={styles.empty}>بدون تصویر</div>
                      )}
                    </div>
                    <div className={styles.relatedBody}>
                      <strong>{item.title || item.product_code}</strong>
                      <span>{item.dimensions || "ابعاد متنوع"}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </section>

      {isLightboxOpen && selectedImage && (
        <div className={styles.lightbox} onClick={() => setIsLightboxOpen(false)}>
          <button type="button" className={styles.lightboxClose} onClick={() => setIsLightboxOpen(false)} aria-label="بستن">
            ×
          </button>
          <div className={styles.lightboxInner} onClick={(event) => event.stopPropagation()}>
            <Image src={selectedImage} alt={displayTitle} fill sizes="90vw" className={styles.lightboxImage} />
          </div>
        </div>
      )}
    </main>
  );
}
