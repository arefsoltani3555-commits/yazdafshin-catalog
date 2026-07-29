import Image from "next/image";
import Link from "next/link";

const collections = [
  {
    number: "01",
    title: "مخمل",
    englishTitle: "VELVET COLLECTION",
    slug: "velvet",
    image: "/collections/velvet-hero.png",
    material: "پلی‌استر و شانل",
    feature: "نرم و کاربردی",
    description:
      "بافت نرم، وزن مناسب و تنوع طرح برای استفاده روزمره و دکوراسیون خانه.",
  },
  {
    number: "02",
    title: "مخمل زرکدار",
    englishTitle: "LUREX VELVET",
    slug: "lurex-velvet",
    image: "/collections/lurex-velvet-hero.png",
    material: "شانل و نخ زرکدار",
    feature: "درخشش لوکس",
    description:
      "ترکیب لطافت مخمل و درخشش نخ زرکدار برای جلوه‌ای لوکس و چشم‌نواز.",
  },
  {
    number: "03",
    title: "مخمل ابریشم",
    englishTitle: "SILK VELVET",
    slug: "silk-velvet",
    image: "/collections/silk-velvet-hero.png",
    material: "شانل ابریشمی",
    feature: "کیفیت ممتاز",
    description:
      "بافت ممتاز با شانل ابریشمی، لطافت بالا و ظاهری ظریف و درخشان.",
  },
  {
    number: "04",
    title: "مخمل ابریشم وینتیج",
    englishTitle: "VINTAGE SILK",
    slug: "vintage-silk",
    image: "/collections/vintage-silk-hero.png",
    material: "شانل ابریشمی",
    feature: "جلوه وینتیج",
    description:
      "ترکیب لطافت ابریشم و اصالت طرح‌های وینتیج برای فضاهای خاص و ماندگار.",
  },
  {
    number: "05",
    title: "مخمل ابریشم دوشانل",
    englishTitle: "DOUBLE CHENILLE",
    slug: "double-chenille",
    image: "/collections/double-chenille-hero.png",
    material: "دوشانل مخملی",
    feature: "بافت متراکم",
    description:
      "بافت متراکم و لوکس با لطافت ابریشم و دوام بالای دوشانل.",
  },
  {
    number: "06",
    title: "مخمل دوشانل دورو",
    englishTitle: "REVERSIBLE VELVET",
    slug: "reversible-velvet",
    image: "/collections/reversible-velvet-hero.png",
    material: "شانل مخملی",
    feature: "قابل استفاده از دو طرف",
    description:
      "روفرشی دورو با بافت مخملی و طراحی هماهنگ در هر دو سمت محصول.",
  },
  {
    number: "07",
    title: "مخمل دوشانل کوبلنی",
    englishTitle: "KOBLEN REVERSIBLE",
    slug: "koblen-reversible",
    image: "/collections/koblen-reversible-hero.png",
    material: "پلی‌استر و شانل",
    feature: "کیفیت فوق ممتاز",
    description:
      "بافت کوبلنی با جزئیات ظریف، استحکام بالا و جلوه‌ای اصیل و باشکوه.",
  },
  {
    number: "08",
    title: "تمام مخمل (پتوفرش)",
    englishTitle: "FULL VELVET",
    slug: "full-velvet",
    image: "/collections/full-velvet-hero.jpeg",
    material: "تمام شانل مخملی",
    feature: "پتوفرش",
    description:
      "بافت کاملاً مخملی، بسیار نرم و سنگین برای تجربه‌ای متفاوت و ممتاز.",
  },
  {
    number: "09",
    title: "زیر سفره ای",
    englishTitle: "TABLE COVER",
    slug: "table-cover",
    image: "/collections/table-cover-hero.jpeg",
    material: "بافت مقاوم",
    feature: "کاربردی و بادوام",
    description:
      "محصولی مقاوم و کاربردی با طرح‌های متنوع برای محافظت از سطح زیر سفره.",
  },
];

export default function CategorySection() {
  return (
    <section id="collections" className="cinematicCollections">
      <div className="container">
        <div className="cinematicCollectionsHeading">
          <div>
            <span className="cinematicCollectionsEyebrow">
              کالکشن‌های یزد افشین
            </span>

            <h2>
              برای هر خانه،
              <span>یک انتخاب ماندگار</span>
            </h2>
          </div>

          <p>
            مجموعه‌ای کامل از روفرشی‌های مخمل، ابریشم، دوشانل، دورو، پتینه
            و زیرسفره‌ای با طراحی اصیل، بافت حرفه‌ای و کیفیت تولید ماندگار.
          </p>
        </div>

        <div className="cinematicCollectionsGrid">
          {collections.map((collection) => (
            <Link
              key={collection.slug}
              href={`/collections/${collection.slug}`}
              className="cinematicCollectionCard"
              aria-label={`مشاهده کالکشن ${collection.title}`}
            >
              <Image
                src={collection.image}
                alt={`کالکشن ${collection.title} یزد افشین`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw"
                className="cinematicCollectionImage"
              />

              <div className="cinematicCollectionShade" />

              <div className="cinematicCollectionTop">
                <span>{collection.number}</span>
                <span>{collection.englishTitle}</span>
              </div>

              <div className="cinematicCollectionBody">
                <span className="cinematicCollectionBadge">
                  کالکشن ویژه یزد افشین
                </span>

                <h3>{collection.title}</h3>

                <p>{collection.description}</p>

                <div className="cinematicCollectionSpecs">
                  <div>
                    <span>جنس بافت</span>
                    <strong>{collection.material}</strong>
                  </div>

                  <div>
                    <span>ویژگی</span>
                    <strong>{collection.feature}</strong>
                  </div>
                </div>

                <div className="cinematicCollectionLink">
                  مشاهده کالکشن
                  <span aria-hidden="true">←</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
