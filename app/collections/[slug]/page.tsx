import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

type Product = {
  id: string;
  product_code: string;
  category: string;
  collection: string | null;
  dimensions: string | null;
  yarn_material: string | null;
  colors: string | null;
  description: string | null;
  image: string | null;
  title: string | null;
  weight: string | null;
  thickness: string | null;
  is_active: boolean | null;
};

type IconName =
  | "yarn"
  | "grip"
  | "palette"
  | "durability"
  | "pattern"
  | "swatches"
  | "sizes"
  | "quality";

type Feature = {
  title: string;
  description: string;
  icon: IconName;
};

type CollectionContent = {
  title: string;
  summaryLines: string[];
  features: Feature[];
  highlights: Feature[];
  cta: string;
};

const navItems = [
  { label: "صفحه اصلی", href: "/" },
  { label: "کالکشن‌ها", href: "/#collections" },
  { label: "درباره ما", href: "/#about" },
  { label: "تماس با ما", href: "/#contact" },
];

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

const legacySlugMap: Record<string, string> = {
  "double-chenille-reversible": "reversible-velvet",
  "double-chenille-koblen": "koblen-reversible",
};

const collectionImages: Record<string, string> = {
  velvet: "/collections/velvet-hero.png",
  "lurex-velvet": "/collections/lurex-velvet-hero.png",
  "silk-velvet": "/collections/silk-velvet-hero.png",
  "vintage-silk": "/collections/vintage-silk-hero.png",
  "double-chenille": "/collections/double-chenille-hero.png",
  "reversible-velvet": "/collections/reversible-velvet-hero.png",
  "koblen-reversible": "/collections/koblen-reversible-hero.png",
  "full-velvet": "/collections/full-velvet-hero.jpeg",
  "table-cover": "/collections/table-cover-hero.jpeg",
};

const fallbackCollectionImage = "/collections/velvet-hero.png";

const collectionContent: Record<string, CollectionContent> = {
  velvet: {
    title: "مخمل",
    summaryLines: [
      "کالکشن مخمل یزد افشین، تلفیقی از لطافت،",
      "زیبایی و اصالت ایرانی است. طراحی‌های",
      "منحصربه‌فرد با نخ‌های باکیفیت، مناسب",
      "برای هر سلیقه و دکوراسیونی.",
    ],
    features: [
      { title: "نخ‌های باکیفیت", description: "استفاده از بهترین نخ‌های پلی‌استر و متالیک", icon: "yarn" },
      { title: "ضد لغزش", description: "ایمنی و ثبات بیشتر در تمام سطوح", icon: "grip" },
      { title: "تنوع رنگ‌بندی", description: "هماهنگ با سلیقه و دکوراسیون شما", icon: "palette" },
      { title: "دوام و ماندگاری", description: "مناسب برای استفاده روزمره و طولانی‌مدت", icon: "durability" },
    ],
    highlights: [
      { title: "طرح‌های متنوع", description: "از کلاسیک تا مدرن", icon: "pattern" },
      { title: "رنگ‌بندی خاص", description: "هماهنگ با هر سلیقه", icon: "swatches" },
      { title: "سایزهای مختلف", description: "متناسب با هر فضایی", icon: "sizes" },
      { title: "کیفیت ممتاز", description: "تضمین زیبایی و ماندگاری", icon: "quality" },
    ],
    cta: "مشاهده محصولات این کالکشن",
  },
  "lurex-velvet": {
    title: "مخمل زرکدار",
    summaryLines: [
      "کالکشن مخمل زرکدار یزد افشین، ترکیبی از ظرافت",
      "مخمل و درخشش نخ‌های زرکدار است. طراحی‌های",
      "لوکس و اصیل ایرانی با جلوه‌ای چشمگیر، مناسب",
      "برای فضاهای فاخر و دکوراسیون‌های خاص.",
    ],
    features: [
      { title: "نخ‌های زرکدار درخشان", description: "استفاده از نخ‌های زرکدار با جلوه‌ای خاص", icon: "yarn" },
      { title: "نقش‌های اصیل ایرانی", description: "طراحی‌های فاخر و الهام‌گرفته از هنر ایرانی", icon: "pattern" },
      { title: "لطافت و نرمی بی‌نظیر", description: "احساس لوکس و راحتی در هر قدم", icon: "palette" },
      { title: "دوام و کیفیت بالا", description: "مناسب استفاده روزمره و طولانی‌مدت", icon: "durability" },
    ],
    highlights: [
      { title: "طرح‌های متنوع", description: "از کلاسیک تا مدرن", icon: "pattern" },
      { title: "رنگ‌بندی خاص", description: "هماهنگ با هر سلیقه", icon: "swatches" },
      { title: "سایزهای مختلف", description: "متناسب با هر فضایی", icon: "sizes" },
      { title: "کیفیت ممتاز", description: "تضمین زیبایی و ماندگاری", icon: "quality" },
    ],
    cta: "مشاهده محصولات این کالکشن",
  },
  "silk-velvet": {
    title: "مخمل ابریشم",
    summaryLines: [
      "کالکشن مخمل ابریشم یزد افشین، اوج لطافت و",
      "زیبایی است. طراحی‌های اصیل ایرانی با درخشش",
      "ابریشمی و سطحی لطیف، انتخابی خاص و دلنشین",
      "برای خانه‌هایی با سلیقه لوکس.",
    ],
    features: [
      { title: "لطافت ابریشم", description: "سطحی نرم و لطیف برای آرامش بیشتر", icon: "yarn" },
      { title: "درخشش خاص", description: "جلوه‌ای براق و چشم‌نواز در نور", icon: "quality" },
      { title: "نخ شانل ابریشمی", description: "کیفیت بالا و ماندگاری طولانی‌مدت", icon: "pattern" },
      { title: "ضد لغزش و بادوام", description: "ایمنی و دوام بالا همراه با لطافت", icon: "durability" },
    ],
    highlights: [
      { title: "طرح‌های اصیل ایرانی", description: "الهام گرفته از هنر و فرهنگ اصیل", icon: "pattern" },
      { title: "رنگ‌بندی متنوع و خاص", description: "هماهنگ با هر سبک دکوراسیون", icon: "swatches" },
      { title: "سایزهای مختلف", description: "مناسب با هر فضای خانه", icon: "sizes" },
      { title: "کیفیت ممتاز", description: "تضمین زیبایی و ماندگاری", icon: "quality" },
    ],
    cta: "مشاهده محصولات این کالکشن",
  },
  "vintage-silk": {
    title: "مخمل ابریشم وینتیج",
    summaryLines: [
      "کالکشن مخمل ابریشم وینتیج، ترکیبی از لطافت",
      "ابریشم و اصالت طرح‌های کلاسیک وینتیج است.",
      "رنگ‌بندی گرم و کهنه‌نما، حس لوکس و نوستالژیک",
      "را به فضاهای مدرن و کلاسیک می‌آورد.",
    ],
    features: [
      { title: "لطافت ابریشم", description: "سطحی نرم و لطیف برای آرامش بیشتر", icon: "yarn" },
      { title: "طرح‌های وینتیج", description: "الهام‌گرفته از طرح‌های کلاسیک و اصیل", icon: "quality" },
      { title: "جلوه کهنه‌نما", description: "حس نوستالژی در هر نقش و رنگ", icon: "pattern" },
      { title: "دوام و کیفیت بالا", description: "ایمنی و دوام همراه با لطافت بی‌نظیر", icon: "durability" },
    ],
    highlights: [
      { title: "طرح‌های وینتیج", description: "الهام گرفته از فرش‌های اصیل", icon: "pattern" },
      { title: "رنگ‌بندی گرم و عمیق", description: "هماهنگ با دکوراسیون کلاسیک", icon: "swatches" },
      { title: "سایزهای متنوع", description: "مناسب با هر فضای خانه", icon: "sizes" },
      { title: "کیفیت ممتاز", description: "تضمین زیبایی و ماندگاری", icon: "quality" },
    ],
    cta: "مشاهده محصولات این کالکشن",
  },
  "double-chenille": {
    title: "مخمل ابریشم دوشانل",
    summaryLines: [
      "کالکشن مخمل ابریشم دوشانل، ترکیبی از لطافت",
      "ابریشم و دوام بالای بافت دوشانل است. این",
      "کالکشن با تراکم بالا و طراحی اصیل ایرانی،",
      "برای خانه‌هایی با سلیقه خاص و باشکوه ساخته شده است.",
    ],
    features: [
      { title: "لطافت ابریشم", description: "سطحی نرم و لطیف برای آرامش بیشتر", icon: "yarn" },
      { title: "دوام دوشانل", description: "مقاوم در برابر فشار و استفاده روزمره", icon: "grip" },
      { title: "تراکم بالا", description: "بافت متراکم برای دوام و زیبایی بیشتر", icon: "pattern" },
      { title: "ضد لغزش و بدون پرز", description: "ایمنی و نظافت آسان در استفاده روزانه", icon: "durability" },
    ],
    highlights: [
      { title: "طرح‌های اصیل ایرانی", description: "الهام گرفته از هنر و فرهنگ اصیل", icon: "pattern" },
      { title: "تراکم و بافت فوق‌العاده", description: "همراه با دوام و لطافت بالا", icon: "swatches" },
      { title: "سایزهای متنوع", description: "مناسب با هر فضای خانه", icon: "sizes" },
      { title: "کیفیت ممتاز", description: "تضمین زیبایی و ماندگاری", icon: "quality" },
    ],
    cta: "مشاهده محصولات این کالکشن",
  },
  "reversible-velvet": {
    title: "مخمل دوشانل دورو",
    summaryLines: [
      "کالکشن مخمل دوشانل دورو، با طراحی دوطرفه و",
      "بافت لطیف و مقاوم، انتخابی ایده‌آل برای",
      "خانه‌هایی است که دوام، کاربردپذیری و زیبایی",
      "را در کنار هم می‌خواهند.",
    ],
    features: [
      { title: "طراحی دو رو", description: "استفاده از هر دو طرف با کیفیت یکسان", icon: "swatches" },
      { title: "بافت مقاوم و بادوام", description: "مناسب استفاده روزمره و طولانی‌مدت", icon: "yarn" },
      { title: "لطافت بی‌نظیر", description: "احساس نرمی و راحتی در هر قدم", icon: "palette" },
      { title: "ضد لغزش و بدون پرز", description: "ایمنی بالا همراه با نظافت آسان", icon: "durability" },
    ],
    highlights: [
      { title: "طرح‌های متنوع", description: "تناسب با هر سلیقه و دکوراسیون", icon: "pattern" },
      { title: "دوام و استحکام بالا", description: "مقاوم در برابر سایش و فشار", icon: "swatches" },
      { title: "سایزهای مختلف", description: "مناسب برای فضاهای گوناگون", icon: "sizes" },
      { title: "کیفیت ممتاز", description: "تضمین زیبایی و ماندگاری", icon: "quality" },
    ],
    cta: "مشاهده محصولات این کالکشن",
  },
  "koblen-reversible": {
    title: "مخمل دوشانل کوبلنی",
    summaryLines: [
      "کالکشن مخمل دوشانل کوبلنی، ترکیبی از اصالت",
      "طرح‌های کوبلنی و دوام دوشانل است. این",
      "کالکشن با الهام از نقوش سنتی و رنگ‌های گرم،",
      "حس باشکوه و نوستالژیک را به خانه می‌آورد.",
    ],
    features: [
      { title: "طرح‌های کوبلنی اصیل", description: "الهام‌گرفته از نقوش سنتی و هنر ایرانی", icon: "yarn" },
      { title: "دوام و استحکام بالا", description: "مقاوم در برابر فشار و استفاده روزمره", icon: "grip" },
      { title: "رنگ‌های گرم و ماندگار", description: "هماهنگ با دکوراسیون‌های کلاسیک و سنتی", icon: "palette" },
      { title: "بافت نرم و لطیف", description: "احساس راحتی و گرما در هر قدم", icon: "durability" },
    ],
    highlights: [
      { title: "طرح‌های اصیل کوبلنی", description: "بر پایه هنر و فرهنگ ایرانی", icon: "pattern" },
      { title: "دوام و بافت دوشانل", description: "مقاوم در برابر فشار و استفاده", icon: "swatches" },
      { title: "سایزهای مختلف", description: "مناسب با هر فضای خانه", icon: "sizes" },
      { title: "کیفیت ممتاز", description: "تضمین زیبایی و ماندگاری", icon: "quality" },
    ],
    cta: "مشاهده محصولات این کالکشن",
  },
  "full-velvet": {
    title: "تمام مخمل (پتوفرش)",
    summaryLines: [
      "کالکشن تمام مخمل، انتخابی بی‌نظیر برای فصل‌های",
      "سرد سال است. این پتوفرش‌های لوکس با بافتی",
      "بسیار نرم و لطیف، گرمایی دلنشین و تجربه‌ای",
      "آرامش‌بخش را برای خانه شما فراهم می‌کنند.",
    ],
    features: [
      { title: "لطافت بی‌نظیر", description: "بافت فوق‌نرم با احساس راحتی کامل", icon: "yarn" },
      { title: "گرمای فوق‌العاده", description: "حفظ گرما و ایجاد فضایی گرم و دلنشین", icon: "palette" },
      { title: "بافت تمام مخمل", description: "تراکم بالا برای دوام و لطافت بیشتر", icon: "pattern" },
      { title: "راحتی و آرامش", description: "مناسب برای استراحت، نشیمن و خواب", icon: "durability" },
    ],
    highlights: [
      { title: "طرح‌های متنوع و زیبا", description: "هماهنگ با سلیقه و دکوراسیون شما", icon: "pattern" },
      { title: "دوام و ماندگاری بالا", description: "مقاوم در برابر شست‌وشو و استفاده", icon: "swatches" },
      { title: "سایزهای مختلف", description: "مناسب با هر فضای خانه", icon: "sizes" },
      { title: "کیفیت ممتاز", description: "تضمین زیبایی و ماندگاری", icon: "quality" },
    ],
    cta: "مشاهده محصولات این کالکشن",
  },
  "table-cover": {
    title: "زیر سفره ای",
    summaryLines: [
      "کالکشن زیر سفره ای یزد افشین، ترکیبی از زیبایی",
      "کلاسیک و کاربرد روزمره است. این طرح‌ها با بافت",
      "مقاوم و لطیف، از سطح میز شما در برابر حرارت،",
      "خش و لک محافظت می‌کنند و جلوه‌ای شیک می‌سازند.",
    ],
    features: [
      { title: "محافظت کامل از میز", description: "مقاوم در برابر حرارت، خش و انواع لک", icon: "durability" },
      { title: "بافت مقاوم و بادوام", description: "طول عمر بالا برای استفاده روزمره", icon: "pattern" },
      { title: "قابل شست‌وشو و آسان", description: "نظافت سریع با دستمال مرطوب یا شست‌وشو", icon: "palette" },
      { title: "ضد لغزش و ثابت", description: "دارای لایه مناسب برای عدم حرکت", icon: "grip" },
    ],
    highlights: [
      { title: "طرح‌های متنوع", description: "هماهنگ با سلیقه و دکوراسیون شما", icon: "pattern" },
      { title: "جنس باکیفیت", description: "الیاف مرغوب با دوام بالا", icon: "swatches" },
      { title: "ضد لغزش", description: "ثابت و ایمن روی میز", icon: "sizes" },
      { title: "قابل شست‌وشو", description: "نظافت آسان و بدون دردسر", icon: "quality" },
    ],
    cta: "مشاهده محصولات این کالکشن",
  },
};

const labels = {
  products: "محصولات این کالکشن",
  available: "طرح موجود",
  dimensions: "ابعاد",
  yarn: "جنس نخ",
  weight: "وزن",
  thickness: "ضخامت",
  contact: "تماس بگیرید",
  noImage: "تصویر محصول",
  productError: "خطا در دریافت محصولات",
  productEmpty: "هنوز محصولی برای این کالکشن ثبت نشده است.",
};

function fallbackContent(title: string): CollectionContent {
  return {
    title,
    summaryLines: [
      `در کالکشن ${title}، ترکیبی از کیفیت بافت،`,
      "هماهنگی رنگ و طراحی چشم‌نواز ارائه شده",
      "تا برای فضاهای مختلف، انتخابی لوکس و",
      "ماندگار در اختیار شما باشد.",
    ],
    features: [
      { title: "کیفیت بافت", description: "متریال مناسب برای جلوه‌ای ماندگار", icon: "yarn" },
      { title: "ضد لغزش", description: "ثبات بیشتر در استفاده روزمره", icon: "grip" },
      { title: "تنوع رنگ", description: "هماهنگ با سبک‌های مختلف", icon: "palette" },
      { title: "دوام بالا", description: "مناسب برای استفاده مستمر", icon: "durability" },
    ],
    highlights: [
      { title: "طرح‌های متنوع", description: "متناسب با سلیقه‌های گوناگون", icon: "pattern" },
      { title: "رنگ‌بندی خاص", description: "هماهنگ با سبک چیدمان", icon: "swatches" },
      { title: "سایزهای مختلف", description: "برای فضاهای کوچک تا بزرگ", icon: "sizes" },
      { title: "کیفیت ممتاز", description: "ترکیب دوام و زیبایی", icon: "quality" },
    ],
    cta: "مشاهده محصولات این کالکشن",
  };
}

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

function resolveSlugFromValue(value: string | null | undefined) {
  const normalized = normalizeCollectionValue(value);

  if (!normalized) return null;

  for (const [slug, aliases] of Object.entries(collectionAliases)) {
    if (aliases.some((alias) => normalizeCollectionValue(alias) === normalized)) {
      return slug;
    }
  }

  return null;
}

function GoldOrnament({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d="M0 18h106" stroke="currentColor" strokeOpacity=".48" />
      <path d="M214 18h106" stroke="currentColor" strokeOpacity=".48" />
      <path d="M106 18h26m56 0h26" stroke="currentColor" strokeWidth="1.2" strokeOpacity=".8" />
      <path d="M133 18 145 8l12 10-12 10-12-10Zm30 0 12-10 12 10-12 10-12-10Z" stroke="currentColor" strokeWidth="1.2" />
      <path d="M145 18 160 3l15 15-15 15-15-15Z" stroke="currentColor" strokeWidth="1.35" />
      <path d="M160 9v18M151 18h18M154 12l12 12M166 12l-12 12" stroke="currentColor" strokeWidth="1.05" strokeLinecap="round" />
    </svg>
  );
}

function RefIcon({ name, className }: { name: IconName; className?: string }) {
  const props = {
    viewBox: "0 0 32 32",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className,
    "aria-hidden": true,
  };

  switch (name) {
    case "yarn":
      return (
        <svg {...props}>
          <circle cx="16" cy="16" r="12.2" stroke="currentColor" strokeWidth="1.45" />
          <path d="M10.6 10.8 21.4 21.6M16 8.8l7.4 7.4M8.9 16l7.3 7.3M10.8 21.3l10.5-10.5M9.1 13.7l4.8-4.8M18.2 22.8l4.8-4.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12.4 11.7h7.3M10.6 16h10.8M12.4 20.3h7.3" stroke="currentColor" strokeWidth="1.05" strokeLinecap="round" />
        </svg>
      );
    case "grip":
      return (
        <svg {...props}>
          <circle cx="16" cy="12.2" r="6.2" stroke="currentColor" strokeWidth="1.45" />
          <path d="M12.2 18.3 10.7 24l5.3-2.5 5.3 2.5-1.5-5.7" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12.4 8.4h7.2M10.9 11.3h10.3M11.6 14.2h8.8" stroke="currentColor" strokeWidth="1.05" strokeLinecap="round" />
          <circle cx="16" cy="12.2" r="2" stroke="currentColor" strokeWidth="1.15" />
        </svg>
      );
    case "palette":
      return (
        <svg {...props}>
          <path d="M16.4 6C22 6 26 9.5 26 14.4c0 3.8-2.6 6.4-6.3 6.4h-1.1c-.8 0-1.3.5-1.3 1.2 0 1.3-.9 2.2-2.2 2.2-5.4 0-9.3-3.9-9.3-8.9C5.8 10.1 10.3 6 16.4 6Z" stroke="currentColor" strokeWidth="1.45" strokeLinejoin="round" />
          <circle cx="11.6" cy="12" r="1" fill="currentColor" />
          <circle cx="15.2" cy="10.1" r="1" fill="currentColor" />
          <circle cx="19.1" cy="11.5" r="1" fill="currentColor" />
          <circle cx="12.1" cy="16.1" r="1" fill="currentColor" />
        </svg>
      );
    case "durability":
      return (
        <svg {...props}>
          <path d="M16 6.1 24.1 8.9v5.8c0 5-3.4 8.7-8.1 10.3-4.7-1.6-8.1-5.3-8.1-10.3V8.9L16 6.1Z" stroke="currentColor" strokeWidth="1.55" strokeLinejoin="round" />
          <path d="M12.7 15.4 15 17.7l4.9-4.9" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "pattern":
      return (
        <svg {...props}>
          <rect x="5.3" y="5.3" width="21.4" height="21.4" rx="1.7" stroke="currentColor" strokeWidth="1.45" />
          <path d="M10.1 5.5v3.2M21.9 5.5v3.2M5.5 10.1h3.2M5.5 21.9h3.2M23.3 10.1h3.2M23.3 21.9h3.2M10.1 26.5v-3.2M21.9 26.5v-3.2" stroke="currentColor" strokeWidth="1.05" strokeLinecap="round" />
          <path d="M16 10.5 17.8 13l2.9-.1-2.2 2 1 2.8-2.5-1.4-2.5 1.4 1-2.8-2.2-2 2.9.1L16 10.5Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
          <circle cx="16" cy="14.9" r="1.1" fill="currentColor" />
        </svg>
      );
    case "swatches":
      return (
        <svg {...props}>
          <path d="M10 24.3V12c0-.8.6-1.4 1.4-1.4h3.1v13.7H10Zm5.2 0V9.8c0-.8.7-1.5 1.5-1.5h2.9v16h-4.4Zm5.1 0V12.8c0-.7.5-1.3 1.2-1.3h2.7c.7 0 1.2.6 1.2 1.3v11.5h-5.1Z" stroke="currentColor" strokeWidth="1.45" strokeLinejoin="round" />
          <path d="M7.9 23.5c1.9-5 5.1-8.7 9-10.9 2.8-1.6 5.8-2.5 9.3-2.8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
          <circle cx="9.7" cy="23.5" r="1.1" fill="currentColor" />
        </svg>
      );
    case "sizes":
      return (
        <svg {...props}>
          <ellipse cx="15.7" cy="11.9" rx="7.2" ry="4.2" stroke="currentColor" strokeWidth="1.45" />
          <ellipse cx="15.7" cy="11.9" rx="2.1" ry="1.2" stroke="currentColor" strokeWidth="1.05" />
          <path d="M22.9 11.9v8.7c0 2.3-1.9 4.2-4.2 4.2h-1.4" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M17.1 24.8h-6c-1.2 0-2.1-.9-2.1-2v-5.4h8.1v7.4Z" stroke="currentColor" strokeWidth="1.45" strokeLinejoin="round" />
          <path d="M11.7 18.8v2.2M14.1 18.3v3.3M16.2 18.8v2.2" stroke="currentColor" strokeWidth="1.05" strokeLinecap="round" />
        </svg>
      );
    case "quality":
      return (
        <svg {...props}>
          <path d="M16 5.8 24.9 11.4 20.6 24.8H11.4L7.1 11.4 16 5.8Z" stroke="currentColor" strokeWidth="1.45" strokeLinejoin="round" />
          <path d="M7.1 11.4h17.8M11.4 24.8 16 17.8l4.6 7M12.2 10.1l3.8 7.7 3.8-7.7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
}

export default async function CollectionPage({
  params,
}: {
  params: { slug: string } | Promise<{ slug: string }>;
}) {
  const resolvedParams = await Promise.resolve(params);
  const slug = legacySlugMap[resolvedParams.slug] ?? resolvedParams.slug;

  if (resolvedParams.slug !== slug) {
    redirect(`/collections/${slug}`);
  }

  const collectionTitle = collectionNames[slug] ?? slug;
  const collectionImage = collectionImages[slug] ?? fallbackCollectionImage;
  const isTableCover = slug === "table-cover";
  const content = collectionContent[slug] ?? fallbackContent(collectionTitle);
  const { data, error } = await supabase
    .from("products")
    .select(`
      id, product_code, category, collection, dimensions, yarn_material,
      colors, description, image, title, weight, thickness, is_active
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  const products = ((data ?? []) as Product[]).filter((product) => {
    const collectionSlug = resolveSlugFromValue(product.collection ?? product.category);
    return collectionSlug === slug;
  });

  return (
    <>
      <main className={styles.page} dir="rtl">
        <section className={styles.hero}>
          <div className={styles.frame}>
            <header className={styles.header}>
              <Link href="/" className={styles.brand} aria-label="صفحه اصلی یزد افشین">
                <Image
                  src="/yazd-afshin-logo.png"
                  alt="لوگوی یزد افشین"
                  width={220}
                  height={96}
                  priority
                  className={styles.brandImage}
                />
              </Link>

              <nav className={styles.nav} aria-label="منوی اصلی">
                {navItems.map((item) => (
                  <Link key={item.label} href={item.href}>
                    {item.label}
                  </Link>
                ))}
              </nav>

              <Link href="/#inquiry" className={styles.topButton}>
                استعلام قیمت
              </Link>
            </header>

            <div className={styles.heroBody}>
              <aside className={styles.panel}>
                <div className={styles.panelTexture} aria-hidden="true" />
                <div className={styles.panelInner}>
                  <span className={styles.label}>کالکشن</span>
                  <h1 className={`${styles.title} ${isTableCover ? styles.titleTableCover : ""}`.trim()}>
                    {content.title}
                  </h1>
                  <GoldOrnament className={styles.titleOrnament} />

                  <div className={styles.summary}>
                    {content.summaryLines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>

                  <div className={styles.featureList}>
                    {content.features.map((feature) => (
                      <div key={feature.title} className={styles.feature}>
                        <div className={styles.featureIcon}>
                          <RefIcon name={feature.icon} className={styles.featureSvg} />
                        </div>
                        <div className={styles.featureText}>
                          <strong>{feature.title}</strong>
                          <p>{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>

              <div className={styles.media}>
                <div className={styles.mediaGlow} aria-hidden="true" />
                <svg
                  className={styles.divider}
                  viewBox="0 0 220 1500"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="divider-gold" x1="40" y1="0" x2="210" y2="1500" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#F6DDA6" />
                      <stop offset=".5" stopColor="#D0A35A" />
                      <stop offset="1" stopColor="#A87436" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M202 0C130 44 90 120 64 254c-27 142-37 304-35 482 2 184 18 342 49 468 26 108 65 202 124 296"
                    stroke="url(#divider-gold)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M182 6C126 44 92 122 71 256c-24 152-30 312-25 482 5 171 24 319 58 444 20 74 45 143 87 214"
                    stroke="#F7E3B4"
                    strokeOpacity=".72"
                    strokeWidth="1.15"
                    strokeLinecap="round"
                  />
                </svg>

                <div className={styles.photoWrap}>
                  <Image
                    src={collectionImage}
                    alt={collectionTitle}
                    fill
                    priority
                    sizes="(max-width: 1100px) 100vw, 64vw"
                    className={styles.photo}
                  />
                  <div className={styles.photoShade} aria-hidden="true" />
                </div>
              </div>
            </div>

            <section className={styles.bottom}>
              <div className={styles.bottomHeading}>
                <span className={styles.headingLine} />
                <h2>در این کالکشن</h2>
                <span className={`${styles.headingLine} ${styles.headingLineRight}`} />
              </div>

              <div className={styles.bottomGrid}>
                {content.highlights.map((item) => (
                  <div key={item.title} className={styles.bottomItem}>
                    <div className={styles.bottomIcon}>
                      <RefIcon name={item.icon} className={styles.bottomSvg} />
                    </div>
                    <strong>{item.title}</strong>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>

              <a href="#collection-products" className={styles.cta}>
                <span className={styles.ctaArrow} aria-hidden="true">
                  ‹
                </span>
                <span>{content.cta}</span>
              </a>
            </section>
          </div>
        </section>

        <section className="collectionProducts" id="collection-products">
          <div className="container">
            <div className="collectionProductsHeading">
              <div>
                <span>{labels.products}</span>
                <h2>
                  {products.length} {labels.available}
                </h2>
              </div>
            </div>

            {error ? (
              <div className="collectionState">{labels.productError}</div>
            ) : products.length === 0 ? (
              <div className="collectionState">{labels.productEmpty}</div>
            ) : (
              <div className="collectionProductGrid">
                {products.map((product) => (
                  <Link key={product.id} href={`/products/${product.id}`} className="collectionProductCard">
                    <div className="collectionProductImage">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.title || product.product_code}
                          fill
                          sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="collectionProductPlaceholder">{labels.noImage}</div>
                      )}
                    </div>

                    <div className="collectionProductBody">
                      <span className="collectionProductCode">{product.product_code}</span>
                      <h3>{product.title || collectionTitle}</h3>
                      {product.description && <p>{product.description}</p>}
                      <div className="collectionProductMeta">
                        <div>
                          <span>{labels.dimensions}</span>
                          <strong>{product.dimensions || labels.contact}</strong>
                        </div>
                        <div>
                          <span>{labels.yarn}</span>
                          <strong>{product.yarn_material || "-"}</strong>
                        </div>
                        <div>
                          <span>{labels.weight}</span>
                          <strong>{product.weight || "-"}</strong>
                        </div>
                        <div>
                          <span>{labels.thickness}</span>
                          <strong>{product.thickness || "-"}</strong>
                        </div>
                      </div>
                      {product.colors && <div className="collectionProductColors">{product.colors}</div>}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
