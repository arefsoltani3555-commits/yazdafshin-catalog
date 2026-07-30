import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer id="contact" className="siteFooter">
      <div className="container footerInner">
        <div className="footerBrand">
          <Image
            src="/yazd-afshin-logo.png"
            alt="لوگوی یزد افشین"
            width={96}
            height={96}
            className="footerLogo"
          />

          <div>
            <h2>نساجی یزد افشین</h2>
            <p>
              تولیدکننده انواع روفرشی، پتوفرش و زیرسفره‌ای با نیم قرن تجربه در صنعت نساجی ایران.
            </p>
          </div>
        </div>

        <div className="footerLinks">
          <h3>دسترسی سریع</h3>

          <Link href="/">صفحه اصلی</Link>
          <Link href="#collections">کالکشن‌ها</Link>
          <Link href="#about">درباره ما</Link>
          <Link href="#inquiry">استعلام قیمت</Link>
        </div>

        <div id="inquiry" className="footerInquiry">
          <span>فروش عمده و همکاری</span>
          <h3>برای دریافت قیمت و اطلاعات محصولات با ما در ارتباط باشید.</h3>

          <Link href="#contact" className="footerButton">
            ارتباط برای همکاری و سفارش
          </Link>
        </div>
      </div>

      <div className="container footerBottom">
        <p>تمام حقوق این وب‌سایت متعلق به نساجی یزد افشین است.</p>
        <span>YAZD AFSHIN TEXTILE</span>
      </div>
    </footer>
  );
}
