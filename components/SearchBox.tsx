"use client";

type SearchBoxProps = {
  searchTerm: string;
  category: string;
  collection: string;
  size: string;
  categories: string[];
  collections: string[];
  sizes: string[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onCollectionChange: (value: string) => void;
  onSizeChange: (value: string) => void;
  onClear: () => void;
};

export default function SearchBox({
  searchTerm,
  category,
  collection,
  size,
  categories,
  collections,
  sizes,
  onSearchChange,
  onCategoryChange,
  onCollectionChange,
  onSizeChange,
  onClear,
}: SearchBoxProps) {
  const hasActiveFilter =
    searchTerm.trim() !== "" || category !== "" || collection !== "" || size !== "";

  return (
    <section className="searchSection">
      <div className="container">
        <div className="searchBox">
          <div className="searchHeading">
            <div>
              <span className="sectionEyebrow">جست‌وجوی هوشمند محصولات</span>
              <h2>محصول مورد نظر خود را سریع‌تر پیدا کنید</h2>
            </div>

            <p>
              براساس کد، نام طرح، کالکشن، دسته‌بندی و سایز جست‌وجو کنید و
              نتیجه دقیق‌تری بگیرید.
            </p>
          </div>

          <div className="searchFields">
            <label className="searchField searchTextField">
              <span>جست‌وجوی محصول</span>

              <input
                type="search"
                value={searchTerm}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="مثلاً YA-101 یا طرح افشان"
              />
            </label>

            <label className="searchField">
              <span>دسته‌بندی</span>

              <select
                value={category}
                onChange={(event) => onCategoryChange(event.target.value)}
              >
                <option value="">همه دسته‌بندی‌ها</option>

                {categories.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="searchField">
              <span>کالکشن</span>

              <select
                value={collection}
                onChange={(event) => onCollectionChange(event.target.value)}
              >
                <option value="">همه کالکشن‌ها</option>

                {collections.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="searchField">
              <span>سایز</span>

              <select
                value={size}
                onChange={(event) => onSizeChange(event.target.value)}
              >
                <option value="">همه سایزها</option>

                {sizes.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              className="clearSearchButton"
              onClick={onClear}
              disabled={!hasActiveFilter}
            >
              پاک‌کردن فیلترها
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
