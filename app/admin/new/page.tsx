"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import AdminAuthGate from "@/components/AdminAuthGate";
import AdminLogoutButton from "@/components/AdminLogoutButton";
import { supabase } from "@/lib/supabase";

const collectionOptions = [
  "مخمل",
  "مخمل زرکدار",
  "مخمل ابریشم",
  "مخمل ابریشم وینتیج",
  "مخمل ابریشم دوشانل",
  "مخمل دوشانل دورو",
  "مخمل دوشانل کوبلنی",
  "تمام مخمل (پتوفرش)",
  "زیر سفره ای",
];

const weaveTypeOptions = [
  "مخمل",
  "ابریشم",
  "دوشانل",
  "دورو (دو طرف قابل استفاده)",
  "کوبلنی",
  "پتوفرش",
  "زیرسفره‌ای",
];

const sizeOptions = [
  "۱۲ متری",
  "۹ متری",
  "۶ متری",
  "۳ متری",
  "۱.۵ متری",
  "پادری",
  "کناره",
  "گرد",
];

const presetColors = [
  { title: "کرم", value: "#dfd1b8" },
  { title: "طوسی", value: "#8c8c8c" },
  { title: "سرمه‌ای", value: "#293247" },
  { title: "زرشکی", value: "#7f2031" },
  { title: "نسکافه‌ای", value: "#9c7557" },
  { title: "قهوه‌ای", value: "#60452f" },
  { title: "سبز", value: "#1f5b46" },
  { title: "آبی", value: "#244a96" },
];

type CustomColor = {
  title: string;
  value: string;
};

type GalleryItem = {
  id: string;
  url: string;
  name: string;
  kind: "local" | "remote";
  file?: File;
};

type ProductRecord = {
  id: string;
  product_code: string | null;
  title: string | null;
  category: string | null;
  collection: string | null;
  dimensions: string | null;
  yarn_material: string | null;
  colors: string | null;
  description: string | null;
  image: string | null;
  images: string[] | null;
  weight: string | null;
  thickness: string | null;
  washable: boolean | null;
  anti_allergy: boolean | null;
  is_active: boolean | null;
};

function inferWeaveType(collection: string | null | undefined, category: string | null | undefined) {
  const collectionValue = collection?.trim() || "";
  const categoryValue = category?.trim() || "";

  if (categoryValue && categoryValue !== collectionValue) {
    return categoryValue;
  }

  if (collectionValue.includes("دورو")) return "دورو (دو طرف قابل استفاده)";
  if (collectionValue.includes("کوبلنی")) return "کوبلنی";
  if (collectionValue.includes("دوشانل")) return "دوشانل";
  if (collectionValue.includes("ابریشم")) return "ابریشم";
  if (collectionValue.includes("پتوفرش")) return "پتوفرش";
  if (collectionValue.includes("زیر")) return "زیرسفره‌ای";
  if (collectionValue.includes("مخمل")) return "مخمل";

  return categoryValue || "مخمل";
}

function splitMultiValue(value: string | null | undefined) {
  return value
    ? value
        .split(/[|،,\n]+/)
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
}

function makeRemoteGalleryItems(urls: string[]) {
  return urls.slice(0, 10).map((url, index) => ({
    id: `remote-${index}-${url}`,
    url,
    name: `image-${index + 1}`,
    kind: "remote" as const,
  }));
}

export default function NewProductPage() {
  const router = useRouter();
  const [editId, setEditId] = useState<string | null>(null);
  const isEditing = Boolean(editId);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [collection, setCollection] = useState(collectionOptions[0]);
  const [productCode, setProductCode] = useState("");
  const [productTitle, setProductTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [yarnMaterial, setYarnMaterial] = useState("");
  const [weaveType, setWeaveType] = useState("مخمل");
  const [weight, setWeight] = useState("");
  const [thickness, setThickness] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [washable, setWashable] = useState(false);
  const [antiAllergy, setAntiAllergy] = useState(false);

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [customColors, setCustomColors] = useState<CustomColor[]>([]);
  const [customColorName, setCustomColorName] = useState("");
  const [customColorValue, setCustomColorValue] = useState("#d5b466");

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [galleryUrlInput, setGalleryUrlInput] = useState("");

  const galleryItemsRef = useRef<GalleryItem[]>([]);

  useEffect(() => {
    galleryItemsRef.current = galleryItems;
  }, [galleryItems]);

  useEffect(() => {
    return () => {
      galleryItemsRef.current.forEach((item) => {
        if (item.kind === "local") {
          URL.revokeObjectURL(item.url);
        }
      });
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const currentId = new URLSearchParams(window.location.search).get("id");
    if (currentId) setEditId(currentId);
  }, []);

  useEffect(() => {
    if (!editId) return;

    async function loadProduct() {
      setIsLoading(true);
      setErrorMessage("");

      const { data, error } = await supabase
        .from("products")
        .select(
          "id, product_code, title, category, collection, dimensions, yarn_material, colors, description, image, images, weight, thickness, washable, anti_allergy, is_active"
        )
        .eq("id", editId)
        .single();

      const { data: productImagesData } = await supabase
        .from("product_images")
        .select("url, sort_order")
        .eq("product_id", editId)
        .order("sort_order", { ascending: true });

      if (error || !data) {
        setErrorMessage("اطلاعات محصول برای ویرایش پیدا نشد.");
        setIsLoading(false);
        return;
      }

      const product = data as ProductRecord;
      const dbColors = splitMultiValue(product.colors);
      const presetNames = presetColors.map((item) => item.title);
      const customFromDb = dbColors
        .filter((item) => !presetNames.includes(item))
        .slice(0, 10)
        .map((title) => ({ title, value: "#d5b466" }));

      const primaryGallery = Array.from(
        new Set([product.image, ...(Array.isArray(product.images) ? product.images : [])].filter(Boolean))
      ) as string[];

      const fallbackGallery = Array.from(
        new Set(((productImagesData || []).map((item) => item.url)).filter(Boolean))
      ) as string[];

      const mergedGallery = primaryGallery.length > 0 ? primaryGallery : fallbackGallery;

      setCollection(product.collection || collectionOptions[0]);
      setProductCode(product.product_code || "");
      setProductTitle(product.title || "");
      setShortDescription(product.description || "");
      setYarnMaterial(product.yarn_material || "");
      setWeaveType(inferWeaveType(product.collection, product.category));
      setWeight(product.weight || "");
      setThickness(product.thickness || "");
      setIsActive(product.is_active !== false);
      setWashable(Boolean(product.washable));
      setAntiAllergy(Boolean(product.anti_allergy));
      setSelectedSizes(splitMultiValue(product.dimensions));
      setSelectedColors(dbColors);
      setCustomColors(customFromDb);
      setGalleryItems(makeRemoteGalleryItems(mergedGallery));
      setIsLoading(false);
    }

    loadProduct();
  }, [editId]);

  const allColors = useMemo(() => [...presetColors, ...customColors], [customColors]);
  const selectedSizesLabel =
    selectedSizes.length > 0 ? selectedSizes.join(" | ") : "هنوز سایزی انتخاب نشده است";

  function toggleSize(size: string) {
    setSelectedSizes((current) =>
      current.includes(size) ? current.filter((item) => item !== size) : [...current, size]
    );
  }

  function toggleColor(color: string) {
    setSelectedColors((current) =>
      current.includes(color) ? current.filter((item) => item !== color) : [...current, color]
    );
  }

  function addCustomColor() {
    const name = customColorName.trim();
    if (!name) return;

    if (customColors.length >= 10) {
      setErrorMessage("حداکثر ۱۰ رنگ ترکیبی می‌توانید اضافه کنید.");
      return;
    }

    if (allColors.some((item) => item.title === name)) {
      setErrorMessage("این رنگ قبلاً اضافه شده است.");
      return;
    }

    setCustomColors((current) => [...current, { title: name, value: customColorValue }]);
    setSelectedColors((current) => [...current, name]);
    setCustomColorName("");
    setErrorMessage("");
  }

  function removeCustomColor(title: string) {
    setCustomColors((current) => current.filter((item) => item.title !== title));
    setSelectedColors((current) => current.filter((item) => item !== title));
  }

  function handleImageSelection(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const nextItems = files
      .slice(0, Math.max(0, 10 - galleryItems.length))
      .map((file) => ({
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        url: URL.createObjectURL(file),
        name: file.name,
        kind: "local" as const,
        file,
      }));

    setGalleryItems((current) => [...current, ...nextItems].slice(0, 10));
    setMessage("");
    setErrorMessage("");
    event.target.value = "";
  }

  function addGalleryUrl() {
    const url = galleryUrlInput.trim();
    if (!url) return;

    if (galleryItems.length >= 10) {
      setErrorMessage("حداکثر ۱۰ تصویر می‌توانید برای هر محصول قرار دهید.");
      return;
    }

    if (galleryItems.some((item) => item.url === url)) {
      setErrorMessage("این تصویر قبلاً اضافه شده است.");
      return;
    }

    setGalleryItems((current) => [
      ...current,
      {
        id: `remote-link-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        url,
        name: `link-${current.length + 1}`,
        kind: "remote",
      },
    ]);
    setGalleryUrlInput("");
    setErrorMessage("");
  }

  function removeGalleryItem(id: string) {
    setGalleryItems((current) => {
      const found = current.find((item) => item.id === id);
      if (found?.kind === "local") {
        URL.revokeObjectURL(found.url);
      }
      return current.filter((item) => item.id !== id);
    });
  }

  function moveGalleryItem(id: string, direction: "left" | "right") {
    setGalleryItems((current) => {
      const index = current.findIndex((item) => item.id === id);
      if (index === -1) return current;
      const targetIndex = direction === "left" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= current.length) return current;
      const copy = [...current];
      const [item] = copy.splice(index, 1);
      copy.splice(targetIndex, 0, item);
      return copy;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");

    if (!productCode.trim() || !productTitle.trim() || !collection.trim()) {
      setErrorMessage("کد محصول، نام محصول و کالکشن را کامل کنید.");
      return;
    }

    setIsSaving(true);

    const bucketName = process.env.NEXT_PUBLIC_SUPABASE_PRODUCT_BUCKET || "product-images";
    const finalGalleryUrls: string[] = [];

    for (const item of galleryItems) {
      if (item.kind === "remote") {
        finalGalleryUrls.push(item.url);
        continue;
      }

      if (!item.file) continue;

      const fileExt = item.file.name.split(".").pop() || "jpg";
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, item.file, { upsert: true });

      if (uploadError) {
        setErrorMessage(`آپلود عکس در باکت "${bucketName}" انجام نشد: ${uploadError.message}`);
        setIsSaving(false);
        return;
      }

      const { data: publicData } = supabase.storage.from(bucketName).getPublicUrl(filePath);
      if (publicData.publicUrl) {
        finalGalleryUrls.push(publicData.publicUrl);
      }
    }

    const payload = {
      product_code: productCode.trim(),
      title: productTitle.trim(),
      category: weaveType.trim(),
      collection: collection.trim(),
      dimensions: selectedSizes.join(" | "),
      yarn_material: yarnMaterial.trim(),
      colors: selectedColors.join(" | "),
      description: shortDescription.trim(),
      image: finalGalleryUrls[0] || null,
      images: finalGalleryUrls.slice(1),
      weight: weight.trim(),
      thickness: thickness.trim(),
      washable,
      anti_allergy: antiAllergy,
      is_active: isActive,
    };

    let savedId = editId;

    if (isEditing) {
      const { error } = await supabase.from("products").update(payload).eq("id", editId);
      if (error) {
        setErrorMessage("ذخیره تغییرات انجام نشد.");
        setIsSaving(false);
        return;
      }
    } else {
      const { data, error } = await supabase
        .from("products")
        .insert(payload)
        .select("id")
        .single();

      if (error || !data) {
        setErrorMessage("ثبت محصول جدید انجام نشد.");
        setIsSaving(false);
        return;
      }

      savedId = data.id as string;
    }

    if (savedId) {
      const { error: deleteGalleryError } = await supabase.from("product_images").delete().eq("product_id", savedId);

      if (deleteGalleryError) {
        setErrorMessage("حذف تصاویر قبلی محصول کامل انجام نشد. لطفاً دوباره ذخیره کن.");
        setIsSaving(false);
        return;
      }

      if (finalGalleryUrls.length > 0) {
        const galleryPayload = finalGalleryUrls.map((url, index) => ({
          product_id: savedId,
          url,
          sort_order: index,
          is_cover: index === 0,
        }));
        const { error: insertGalleryError } = await supabase.from("product_images").insert(galleryPayload);

        if (insertGalleryError) {
          setErrorMessage("تصاویر جدید محصول کامل ذخیره نشدند. لطفاً دوباره ذخیره کن.");
          setIsSaving(false);
          return;
        }
      }
    }

    setGalleryItems((current) => {
      current.forEach((item) => {
        if (item.kind === "local") {
          URL.revokeObjectURL(item.url);
        }
      });
      return makeRemoteGalleryItems(finalGalleryUrls);
    });

    setMessage(isEditing ? "محصول با موفقیت ویرایش شد." : "محصول با موفقیت ثبت شد.");
    setIsSaving(false);

    if (!isEditing && savedId) {
      router.replace(`/admin/new?id=${savedId}`);
    }
  }

  return (
    <AdminAuthGate>
    <main dir="rtl" className="min-h-screen bg-[#050505] px-4 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] text-white/35">مدیریت محصولات یزد افشین</p>
            <h1 className="mt-1 text-2xl font-black text-white">
              {isEditing ? "ویرایش محصول" : "افزودن محصول جدید"}
            </h1>
          </div>

          <div className="flex gap-2">
            <AdminLogoutButton className="rounded-xl border border-[#d5b466]/25 bg-[#d5b466]/10 px-4 py-2 text-xs font-bold text-[#f1d799] transition hover:border-[#d5b466]/60 hover:bg-[#d5b466]/15" />
            <Link
              href="/admin-v2"
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-bold text-white/60"
            >
              بازگشت به پنل
            </Link>
            <Link
              href="/"
              className="rounded-xl bg-gradient-to-r from-[#b88b3b] to-[#d7b76e] px-4 py-2 text-xs font-black text-black"
            >
              مشاهده سایت
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_360px]">
          <section className="space-y-5">
            <Panel title="اطلاعات اصلی" subtitle="این بخش برای مشخصات پایه محصول است.">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-[11px] font-bold text-white/55">کالکشن</span>
                  <select
                    value={collection}
                    onChange={(event) => setCollection(event.target.value)}
                    className="min-h-11 w-full rounded-xl border border-white/10 bg-black/40 px-3 text-xs outline-none focus:border-[#d5b466]/60"
                  >
                    {collectionOptions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>

                <FormInput label="کد محصول" placeholder="YA-350" value={productCode} onChange={setProductCode} />
                <FormInput label="نام محصول" placeholder="مثلاً مخمل دوشانل دورو" value={productTitle} onChange={setProductTitle} />
                <FormInput label="جنس نخ" placeholder="پلی استر + شانل" value={yarnMaterial} onChange={setYarnMaterial} />
                <label className="block">
                  <span className="mb-2 block text-[11px] font-bold text-white/55">نوع بافت</span>
                  <input
                    list="weave-type-options"
                    value={weaveType}
                    onChange={(event) => setWeaveType(event.target.value)}
                    placeholder="مثلاً دورو (دو طرف قابل استفاده)"
                    className="min-h-11 w-full rounded-xl border border-white/10 bg-black/40 px-3 text-xs outline-none focus:border-[#d5b466]/60"
                  />
                  <datalist id="weave-type-options">
                    {weaveTypeOptions.map((item) => (
                      <option key={item} value={item} />
                    ))}
                  </datalist>
                </label>
                <FormInput label="وزن" placeholder="۷ کیلوگرم" value={weight} onChange={setWeight} />
                <FormInput label="ضخامت" placeholder="۸ میلی‌متر" value={thickness} onChange={setThickness} />
              </div>

              <label className="mt-4 block">
                <span className="mb-2 block text-[11px] font-bold text-white/55">توضیحات کوتاه</span>
                <textarea
                  value={shortDescription}
                  onChange={(event) => setShortDescription(event.target.value)}
                  className="min-h-28 w-full resize-none rounded-xl border border-white/10 bg-black/40 p-3 text-xs outline-none placeholder:text-white/20 focus:border-[#d5b466]/60"
                  placeholder="توضیحات محصول..."
                />
              </label>
            </Panel>

            <Panel title="رنگ‌بندی" subtitle="رنگ‌های قابل تولید را انتخاب یا اضافه کن.">
              <div className="grid gap-3 md:grid-cols-2">
                {allColors.map((color) => {
                  const active = selectedColors.includes(color.title);
                  return (
                    <button
                      key={color.title}
                      type="button"
                      onClick={() => toggleColor(color.title)}
                      className={`flex items-center gap-3 rounded-xl border p-3 text-xs font-bold transition ${
                        active
                          ? "border-[#d5b466] bg-[#d5b466]/10 text-[#e2c77f]"
                          : "border-white/10 bg-black/30 text-white/55"
                      }`}
                    >
                      <span className="h-6 w-6 rounded-full border border-white/20" style={{ backgroundColor: color.value }} />
                      <span>{color.title}</span>
                      {active && <span className="mr-auto text-[#d5b466]">✓</span>}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-bold text-[#e2c77f]">ساخت رنگ ترکیبی یا اختصاصی</p>
                <div className="mt-3 grid gap-2 md:grid-cols-[minmax(0,1fr)_70px_120px]">
                  <input
                    value={customColorName}
                    onChange={(event) => setCustomColorName(event.target.value)}
                    placeholder="مثلاً کرم-طلایی"
                    className="min-h-10 rounded-xl border border-white/10 bg-black/40 px-3 text-xs outline-none focus:border-[#d5b466]/60"
                  />
                  <input
                    type="color"
                    value={customColorValue}
                    onChange={(event) => setCustomColorValue(event.target.value)}
                    className="h-10 w-full cursor-pointer rounded-xl border border-white/10 bg-black/40 p-1"
                    aria-label="انتخاب رنگ"
                  />
                  <button
                    type="button"
                    onClick={addCustomColor}
                    className="rounded-xl border border-[#d5b466]/40 bg-[#d5b466]/10 px-3 py-2 text-xs font-bold text-[#e2c77f]"
                  >
                    افزودن رنگ
                  </button>
                </div>

                {customColors.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {customColors.map((color) => (
                      <button
                        key={color.title}
                        type="button"
                        onClick={() => removeCustomColor(color.title)}
                        className="flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[11px] text-white/75"
                      >
                        <span className="h-4 w-4 rounded-full border border-white/20" style={{ backgroundColor: color.value }} />
                        <span>{color.title}</span>
                        <span className="text-red-300">×</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </Panel>

            <Panel title="سایزبندی" subtitle="سایزهای انتخاب‌شده باید همین‌جا واضح دیده شوند.">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {sizeOptions.map((size) => {
                  const active = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`min-h-12 rounded-2xl border px-3 text-sm font-bold transition ${
                        active
                          ? "border-[#d5b466] bg-[#d5b466]/10 text-[#e2c77f] shadow-[0_0_0_1px_rgba(213,180,102,0.12)]"
                          : "border-white/10 bg-black/30 text-white/70 hover:border-[#d5b466]/30 hover:text-white"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 rounded-[26px] border border-[#d5b466]/20 bg-[linear-gradient(180deg,rgba(213,180,102,0.06),rgba(0,0,0,0.18))] p-5">
                <p className="text-[11px] font-bold text-[#e2c77f]">سایزهای انتخاب‌شده</p>
                <p className="mt-2 text-xs leading-6 text-white/75">{selectedSizesLabel}</p>

                {selectedSizes.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {selectedSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className="inline-flex items-center gap-2 rounded-full border border-[#d5b466]/30 bg-[#d5b466]/10 px-3.5 py-2 text-xs font-bold text-[#f1ddb0] transition hover:border-[#d5b466]/60 hover:bg-[#d5b466]/14"
                      >
                        <span>{size}</span>
                        <span className="rounded-full border border-[#d5b466]/25 px-1.5 py-0.5 text-[10px] leading-none text-[#e2c77f]">
                          ×
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </Panel>

            <Panel title="تصاویر محصول" subtitle="عکس‌ها را مستقیم انتخاب کن تا همان لحظه پیش‌نمایش ببینی.">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-white">آپلود مستقیم تصاویر</p>
                  <p className="mt-1 text-[11px] text-white/45">تا ۱۰ تصویر، با امکان حذف و جابه‌جایی.</p>
                </div>

                  <label
                    htmlFor="direct-image-upload"
                    className="inline-flex cursor-pointer items-center rounded-xl border border-[#d5b466]/35 bg-[#d5b466]/8 px-4 py-3 text-xs font-bold text-[#e2c77f] hover:border-[#d5b466]"
                  >
                    انتخاب مستقیم عکس
                  </label>
                </div>

                <input
                  id="direct-image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelection}
                  className="mt-4 block w-full cursor-pointer rounded-xl border border-white/10 bg-black/35 px-3 py-3 text-xs text-white/70 file:ml-3 file:rounded-lg file:border-0 file:bg-[#d5b466] file:px-3 file:py-2 file:text-xs file:font-bold file:text-black"
                />

                <p className="mt-2 text-[11px] text-white/35">
                  فایل‌ها را مستقیم از سیستم انتخاب کن؛ بعد از انتخاب، پیش‌نمایش پایین همین بخش ظاهر می‌شود.
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-[11px]">
                <span className="text-white/55">تعداد تصاویر انتخاب‌شده</span>
                <span className="font-bold text-[#e2c77f]">{galleryItems.length} / 10</span>
              </div>

              <div className="mt-4 flex gap-2">
                <input
                  value={galleryUrlInput}
                  onChange={(event) => setGalleryUrlInput(event.target.value)}
                  placeholder="اگر خواستی لینک عکس هم می‌توانی اینجا وارد کنی"
                  className="min-h-11 w-full rounded-xl border border-white/10 bg-black/40 px-3 text-xs outline-none placeholder:text-white/20 focus:border-[#d5b466]/60"
                />
                <button
                  type="button"
                  onClick={addGalleryUrl}
                  className="rounded-xl border border-white/10 px-4 text-xs font-bold text-white/70"
                >
                  افزودن
                </button>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {galleryItems.length > 0 ? (
                  galleryItems.map((item, index) => (
                    <div
                      key={item.id}
                      className={`overflow-hidden rounded-2xl border bg-black/30 transition ${
                        index === 0 ? "border-[#d5b466]/60 shadow-[0_0_0_1px_rgba(213,180,102,0.18)]" : "border-white/10"
                      }`}
                    >
                      <div className="relative aspect-[4/3] bg-black/20">
                        <img
                          src={item.url}
                          alt={item.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
                        {index === 0 && (
                          <span className="absolute right-2 top-2 rounded-full bg-[#d5b466] px-2 py-1 text-[10px] font-black text-black">
                            کاور
                          </span>
                        )}
                      </div>

                      <div className="space-y-2 p-3 text-[10px] text-white/65">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate">{item.name}</span>
                          <span className="rounded-full border border-white/10 px-2 py-1 text-[9px] text-white/45">
                            تصویر {index + 1}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => moveGalleryItem(item.id, "left")}
                            disabled={index === 0}
                            className="flex-1 rounded-lg border border-white/10 px-2 py-1 disabled:opacity-30"
                          >
                            ←
                          </button>
                          <button
                            type="button"
                            onClick={() => moveGalleryItem(item.id, "right")}
                            disabled={index === galleryItems.length - 1}
                            className="flex-1 rounded-lg border border-white/10 px-2 py-1 disabled:opacity-30"
                          >
                            →
                          </button>
                          <button
                            type="button"
                            onClick={() => removeGalleryItem(item.id)}
                            className="flex-1 rounded-lg border border-red-400/20 px-2 py-1 text-red-300"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-white/10 px-4 py-10 text-center text-xs text-white/35 sm:col-span-2 lg:col-span-3">
                    هنوز تصویری برای این محصول اضافه نشده است.
                  </div>
                )}
              </div>
            </Panel>
          </section>

          <aside className="space-y-5">
            <Panel title="وضعیت و ویژگی‌ها" subtitle="تنظیمات سریع محصول">
              <div className="space-y-3">
                <ToggleRow label="محصول فعال باشد" checked={isActive} onToggle={() => setIsActive((v) => !v)} />
                <ToggleRow label="قابل شست‌وشو" checked={washable} onToggle={() => setWashable((v) => !v)} />
                <ToggleRow label="ضد حساسیت" checked={antiAllergy} onToggle={() => setAntiAllergy((v) => !v)} />
              </div>
            </Panel>

            <Panel title="خلاصه محصول" subtitle="قبل از ذخیره یک‌جا همه‌چیز را ببین">
              <div className="space-y-3 text-xs text-white/75">
                <SummaryRow label="کالکشن" value={collection || "—"} />
                <SummaryRow label="کد محصول" value={productCode || "—"} />
                <SummaryRow label="نام محصول" value={productTitle || "—"} />
                <SummaryRow label="رنگ‌ها" value={selectedColors.join(" | ") || "—"} />
                <SummaryRow label="ابعاد" value={selectedSizes.join(" | ") || "—"} />
                <SummaryRow label="تعداد تصاویر" value={String(galleryItems.length)} />
              </div>

              {errorMessage && (
                <div className="mt-4 rounded-xl border border-red-400/25 bg-red-500/10 px-3 py-3 text-xs text-red-200">
                  {errorMessage}
                </div>
              )}

              {message && (
                <div className="mt-4 rounded-xl border border-emerald-400/25 bg-emerald-500/10 px-3 py-3 text-xs text-emerald-200">
                  {message}
                </div>
              )}

              {isLoading && (
                <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-xs text-white/55">
                  در حال آماده‌سازی اطلاعات محصول...
                </div>
              )}

              <div className="mt-5 grid gap-3">
                <button
                  type="submit"
                  disabled={isSaving || isLoading}
                  className="min-h-12 rounded-xl bg-gradient-to-r from-[#b4883b] to-[#d6b66d] text-sm font-black text-black disabled:opacity-50"
                >
                  {isSaving ? "در حال ذخیره..." : isEditing ? "ذخیره تغییرات" : "ثبت محصول"}
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/admin-v2")}
                  className="min-h-11 rounded-xl border border-white/10 bg-white/[0.03] text-xs font-bold text-white/55"
                >
                  بازگشت به لیست محصولات
                </button>
              </div>
            </Panel>
          </aside>
        </form>
      </div>
    </main>
    </AdminAuthGate>
  );
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-[#0b0b0b] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div className="mb-4">
        <h2 className="text-sm font-black text-white">{title}</h2>
        {subtitle ? <p className="mt-1 text-[11px] leading-5 text-white/35">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

function ToggleRow({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <label className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-xs">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={onToggle} />
    </label>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-black/20 px-3 py-3">
      <span className="text-white/45">{label}</span>
      <span className="text-left font-bold text-[#e2c77f]">{value}</span>
    </div>
  );
}

function FormInput({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-bold text-white/55">{label}</span>
      <input
        value={value}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
        className="min-h-11 w-full rounded-xl border border-white/10 bg-black/40 px-3 text-xs outline-none placeholder:text-white/20 focus:border-[#d5b466]/60"
        placeholder={placeholder}
      />
    </label>
  );
}
