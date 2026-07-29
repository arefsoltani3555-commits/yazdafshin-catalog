import Image from "next/image";
import Link from "next/link";

export default function Header({ overlay = false }: { overlay?: boolean }) {
  return (
    <header className={`finalHeader${overlay ? " finalHeaderOverlayMode" : ""}`} dir="rtl">
      <div className="container finalHeaderInner">
        <Link
          href="/"
          className="finalHeaderBrand"
          aria-label="صفحه اصلی یزد افشین"
        >
          <Image
            src="/yazd-afshin-logo.png"
            alt="لوگوی یزد افشین"
            width={78}
            height={78}
            priority
            className="finalHeaderLogo"
          />

          <div className="finalHeaderBrandText">
            <strong>یزد افشین</strong>
            <span>نیم قرن تجربه در نساجی</span>
          </div>
        </Link>

        <div className="finalHeaderActions">
        <nav className="finalHeaderNav" aria-label="منوی اصلی">
          <Link href="/" className="active">
            صفحه اصلی
          </Link>

          <Link href="#collections">کالکشن‌ها</Link>

          <Link href="#about">درباره ما</Link>

          <Link href="#contact">تماس با ما</Link>
        </nav>

        <Link href="#inquiry" className="finalHeaderButton">
          استعلام قیمت
        </Link>
        </div>
      </div>
    </header>
  );
}
