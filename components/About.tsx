import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="finalAbout">
      <div className="container finalAboutInner">
        <div className="finalAboutContent">
          <span className="finalAboutEyebrow">درباره یزد افشین</span>

          <h2>
            نیم قرن تجربه،
            <span> همراه با کیفیت ماندگار</span>
          </h2>

          <p>
            نساجی یزد افشین با تکیه بر تجربه چندین دهه فعالیت در صنعت نساجی، تولیدکننده انواع
            روفرشی، پتوفرش، زیرسفره‌ای و فرشینه‌های باکیفیت ایرانی است.
          </p>

          <p>
            این مجموعه با مدیریت آقای افشین سلطانی، همواره تلاش کرده است اصالت طرح‌های ایرانی را
            با کیفیت بافت، دوام بالا و نیاز خانه‌های امروزی ترکیب کند.
          </p>

          <div className="finalAboutSignature">
            <strong>نساجی یزد افشین</strong>
            <span>نیم قرن اعتماد، کیفیت و نوآوری</span>
          </div>
        </div>

        <div className="finalAboutFeatures">
          <article className="finalAboutCard">
            <span>01</span>
            <h3>کیفیت ماندگار</h3>
            <p>
              کنترل دقیق مراحل تولید و استفاده از مواد اولیه مناسب برای محصولی خوش‌ساخت و بادوام.
            </p>
          </article>

          <article className="finalAboutCard">
            <span>02</span>
            <h3>تنوع در طراحی</h3>
            <p>
              مجموعه‌ای متنوع از طرح‌های اصیل ایرانی، مدرن، وینتیج و رنگ‌بندی‌های کاربردی.
            </p>
          </article>

          <article className="finalAboutCard">
            <span>03</span>
            <h3>بافت تخصصی</h3>
            <p>
              تولید روفرشی‌های مخمل، ابریشم، دوشانل و محصولات دورو با ساختاری حرفه‌ای.
            </p>
          </article>

          <article className="finalAboutCard">
            <span>04</span>
            <h3>اعتماد بازار</h3>
            <p>
              سال‌ها همکاری با بنکداران، فروشندگان و فعالان بازار داخل و صادرات.
            </p>
          </article>
        </div>
      </div>

      <div className="container finalAboutContactWrap">
        <div className="finalAboutContactPanel">
          <div className="finalAboutContactText">
            <span className="finalAboutContactEyebrow">اطلاعات تماس و ارتباط</span>
            <h3>راه‌های ارتباط با نساجی یزد افشین</h3>

            <div className="finalAboutContactList">
              <div className="finalAboutContactItem">
                <strong>آدرس</strong>
                <p>یزد-شاهدیه-بلوارسعادت-نبش کوچه کار -نساجی یزدافشین</p>
              </div>

              <div className="finalAboutContactItem">
                <strong>شماره تماس جهت استعلام قیمت عمده</strong>
                <p dir="ltr">09134575712</p>
                <p dir="ltr">09137479398</p>
              </div>
            </div>
          </div>

          <div className="finalAboutQrCard">
            <div className="finalAboutQrFrame">
              <Image
                src="/instagram-qr.jpeg"
                alt="QR اینستاگرام یزد افشین"
                width={320}
                height={320}
                className="finalAboutQrImage"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
