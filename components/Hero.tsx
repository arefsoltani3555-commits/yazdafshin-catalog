import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="finalHero">
      <div className="finalHeroBackdrop" />
      <div className="finalHeroOverlay" />

      <div className="container finalHeroInner">
        <div className="finalHeroContent">
          <span className="finalHeroEyebrow">نساجی یزد افشین</span>

          <h1>
            اصالت در تولید
            <span>شکوه در خانه</span>
          </h1>

          <p>
            تولیدکننده انواع روفرشی، پتوفرش و زیرسفره‌ای با نیم قرن تجربه،
            طراحی ماندگار و کیفیتی شایسته خانه‌های ایرانی.
          </p>

          <div className="finalHeroActions">
            <Link href="#collections" className="finalHeroPrimary">
              مشاهده کالکشن‌ها
            </Link>

            <Link href="#inquiry" className="finalHeroSecondary">
              استعلام قیمت
            </Link>
          </div>
        </div>

        <div className="finalHeroBrand">
          <Image
            src="/yazd-afshin-logo.png"
            alt="لوگوی نساجی یزد افشین"
            width={430}
            height={430}
            priority
            className="finalHeroLogo"
          />

          <span>YAZD AFSHIN TEXTILE</span>
        </div>
      </div>

      <div className="container finalHeroStats">
        <div>
          <strong>+۵۰</strong>
          <span>سال تجربه</span>
        </div>

        <div>
          <strong>+۱۰۰</strong>
          <span>طرح متنوع</span>
        </div>

        <div>
          <strong>۹</strong>
          <span>کالکشن تخصصی</span>
        </div>
      </div>
    </section>
  );
}
