
"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase"

const menuItems = [
{ title: "داشبورد", icon: "⌂" },
{ title: "محصولات", icon: "▣" },
{ title: "کالکشن‌ها", icon: "◇" },
{ title: "رنگ‌بندی‌ها", icon: "●" },
{ title: "ابعاد", icon: "⌗" },
{ title: "ویژگی‌ها", icon: "✦" },
{ title: "استعلام قیمت", icon: "⌁" },
];

type AdminProduct = {
id: string | number;
code: string;
title: string;
collection: string;
status: string;
image: string;
};

type ProductRow = {
id: string;
product_code: string | null;
title: string | null;
collection: string | null;
image: string | null;
images: string[] | null;
is_active: boolean | null;
};

type ProductImageRow = {
product_id: string;
url: string;
sort_order: number | null;
is_cover: boolean | null;
};

const demoProducts: AdminProduct[] = [
{
id: "demo-302",
code: "YA-302",
title: "طرح دوشانل",
collection: "مخمل دوشانل دورو",
status: "فعال",
image: "/collections/double-chenille.jpg",
},
{
id: "demo-301",
code: "YA-301",
title: "طرح افشان",
collection: "مخمل ابریشم",
status: "فعال",
image: "/collections/silk-velvet.jpg",
},
{
id: "demo-298",
code: "YA-298",
title: "طرح پتینه",
collection: "مخمل زرکدار",
status: "فعال",
image: "/collections/lurex-velvet.jpg",
},
];

const sizes = [
"۱۲ متری",
"۹ متری",
"۶ متری",
"۳ متری",
"۱.۵ متری",
"پادری",
"کناره",
"گرد",
];

const colors = [
{ title: "کرم", value: "#dfd1b8" },
{ title: "طوسی", value: "#8c8c8c" },
{ title: "سورمه‌ای", value: "#293247" },
{ title: "زرشکی", value: "#6c2630" },
{ title: "نسکافه‌ای", value: "#9c7557" },
{ title: "قهوه‌ای", value: "#60452f" },
];

const RESTORED_COLLECTIONS = [
"مخمل ابریشم وینتیج",
"مخمل ابریشم دوشانل",
];

export default function AdminV2Page() {
const router = useRouter();
const [activeMenu, setActiveMenu] = useState("داشبورد");
const [activeStep, setActiveStep] = useState(1);
const [products, setProducts] = useState<AdminProduct[]>(demoProducts);
const [isLoadingProducts, setIsLoadingProducts] = useState(true);
const [productsError, setProductsError] = useState("");
const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
const [editCode, setEditCode] = useState("");
const [editTitle, setEditTitle] = useState("");
const [editCollection, setEditCollection] = useState("");
const [isSavingProduct, setIsSavingProduct] = useState(false);

const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
const [selectedColors, setSelectedColors] = useState<string[]>([]);
const [customColors, setCustomColors] = useState<Array<{ title: string; value: string }>>([]);
const [customColorName, setCustomColorName] = useState("");
const [customColorValue, setCustomColorValue] = useState("#d5b466");
const [searchTerm, setSearchTerm] = useState("");
const [collectionFilter, setCollectionFilter] = useState("");

useEffect(() => {
async function loadProducts() {
const { data, error } = await supabase
.from("products")
.select("id, product_code, title, collection, image, images, is_active")
.order("created_at", { ascending: false })
.limit(1000);

if (error) {
setProductsError("دریافت محصولات از Supabase انجام نشد؛ دادهٔ نمونه نمایش داده شد.");
setIsLoadingProducts(false);
return;
}

const normalizedProducts: AdminProduct[] = (data || []).map((product) => ({
id: product.id,
code: product.product_code || "بدون کد",
title: product.title || "بدون عنوان",
collection: product.collection || "بدون کالکشن",
status: product.is_active === false ? "غیرفعال" : "فعال",
image: product.image || (Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : null) || "/collections/vintage-silk.jpg",
}));

setProducts(normalizedProducts);
setProductsError("");
setIsLoadingProducts(false);
}

loadProducts();
}, []);

const filteredProducts = useMemo(() => {
const normalizedSearch = searchTerm.trim().toLowerCase();

return products.filter((product) => {
const matchesSearch =
!normalizedSearch ||
product.code.toLowerCase().includes(normalizedSearch) ||
product.title.toLowerCase().includes(normalizedSearch) ||
product.collection.toLowerCase().includes(normalizedSearch);

const matchesCollection =
!collectionFilter || product.collection === collectionFilter;

return matchesSearch && matchesCollection;
});
}, [collectionFilter, products, searchTerm]);

const collectionSummary = useMemo(() => {
const names = Array.from(new Set([
...RESTORED_COLLECTIONS,
...products.map((product) => product.collection).filter(Boolean),
]));
return names.map((name) => ({
name,
count: products.filter((product) => product.collection === name).length,
}));
}, [products]);

const activeProductCount = products.filter((product) => product.status === "فعال").length;
const inactiveProductCount = products.length - activeProductCount;

function startEditing(product: AdminProduct) {
router.push(`/admin/new?id=${encodeURIComponent(String(product.id))}`);
}

async function saveProductEdit() {
if (!editingProduct || !editCode.trim() || !editTitle.trim()) return;

setIsSavingProduct(true);
const { error } = await supabase
.from("products")
.update({
product_code: editCode.trim(),
title: editTitle.trim(),
collection: editCollection.trim(),
})
.eq("id", editingProduct.id);

if (!error) {
setProducts((current) =>
current.map((product) =>
product.id === editingProduct.id
? {
...product,
code: editCode.trim(),
title: editTitle.trim(),
collection: editCollection.trim(),
}
: product
)
);
setEditingProduct(null);
}

setIsSavingProduct(false);
}

async function deleteProduct(product: AdminProduct) {
if (!window.confirm(`محصول «${product.title}» حذف شود؟`)) return;

const { error } = await supabase
.from("products")
.delete()
.eq("id", product.id);

if (!error) {
setProducts((current) => current.filter((item) => item.id !== product.id));
}
}

function toggleSize(size: string) {
setSelectedSizes((current) =>
current.includes(size)
? current.filter((item) => item !== size)
: [...current, size]
);
}

function toggleColor(color: string) {
setSelectedColors((current) =>
current.includes(color)
? current.filter((item) => item !== color)
: [...current, color]
);
}

function addCustomColor() {
const name = customColorName.trim();
if (!name || customColors.some((color) => color.title === name)) return;
setCustomColors((current) => [...current, { title: name, value: customColorValue }]);
setSelectedColors((current) => [...current, name]);
setCustomColorName("");
}

function removeCustomColor(color: string) {
setCustomColors((current) => current.filter((item) => item.title !== color));
setSelectedColors((current) => current.filter((item) => item !== color));
}

return (
<main
dir="rtl"
className="min-h-screen bg-[#050505] text-white"
>
<div className="grid min-h-screen grid-cols-1 xl:grid-cols-[190px_minmax(0,1fr)_390px]">
{/* Sidebar */}
<aside className="border-l border-white/10 bg-[#090909]">
<div className="flex h-full flex-col">
<div className="border-b border-white/10 px-5 py-6">
<div className="flex items-center gap-3">
<div className="grid h-11 w-11 place-items-center overflow-hidden rounded-xl border border-[#d1aa58]/35 bg-[#d1aa58]/10">
<Image
src="/yazd-afshin-logo.png"
alt="یزد افشین"
width={44}
height={44}
className="h-full w-full object-contain"
priority
/>
</div>

<div>
<h1 className="text-sm font-black text-[#e0c176]">
یزد افشین
</h1>

<p className="mt-1 text-[10px] text-white/35">
YAZD AFSHIN
</p>
</div>
</div>
</div>

<nav className="flex-1 space-y-1 p-3">
{menuItems.map((item) => {
const active = activeMenu === item.title;

return (
<button
key={item.title}
type="button"
onClick={() => setActiveMenu(item.title)}
className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-right text-xs font-bold transition ${
active
? "bg-gradient-to-r from-[#b78937] to-[#d4b36a] text-black"
: "text-white/55 hover:bg-white/5 hover:text-white"
}`}
>
<span className="grid h-7 w-7 place-items-center rounded-lg border border-current/15">
{item.icon}
</span>

<span>{item.title}</span>
</button>
);
})}
</nav>

<div className="border-t border-white/10 p-4">
<div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
<p className="text-xs font-bold">عارف سلطانی</p>
<p className="mt-1 text-[10px] text-white/35">
مدیر سیستم
</p>
</div>
</div>
</div>
</aside>

{/* Dashboard */}
<section className="min-w-0 bg-[#070707] px-5 py-5">
<header className="mb-5 flex items-center justify-between">
<div>
<p className="text-xs text-white/35">
پنل مدیریت یزد افشین
</p>

<h2 className="mt-1 text-xl font-black">
داشبورد
</h2>
</div>

<div className="flex items-center gap-2">
<button className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-white/50">
◌
</button>

<button className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-white/50">
⋮
</button>
</div>
</header>

{activeMenu !== "داشبورد" && (
<section className="mb-5 rounded-2xl border border-[#d5b466]/25 bg-[#0b0b0b] p-5">
<div className="flex flex-wrap items-center justify-between gap-3">
<div>
<p className="text-[10px] text-[#d5b466]/70">بخش فعال پنل</p>
<h3 className="mt-1 text-lg font-black">{activeMenu}</h3>
</div>
{activeMenu === "محصولات" && (
<Link href="/admin/new" className="rounded-xl bg-gradient-to-r from-[#b88b3b] to-[#d7b76e] px-4 py-2 text-xs font-black text-black">
افزودن محصول جدید
</Link>
)}
</div>
<p className="mt-3 text-xs leading-6 text-white/45">
از این بخش می‌توانید اطلاعات {activeMenu} را مدیریت کنید. برای ویرایش هر محصول، دکمهٔ مداد را در جدول بزنید.
</p>
</section>
)}

{activeMenu === "کالکشن‌ها" && (
<section className="mb-5 rounded-2xl border border-[#d5b466]/25 bg-[#0b0b0b] p-5">
<h3 className="text-sm font-black text-[#e2c77f]">مدیریت کالکشن‌ها</h3>
<p className="mt-2 text-xs text-white/45">یک کالکشن را انتخاب کنید تا محصولات زیرمجموعه‌اش در جدول فیلتر شوند.</p>
<div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
{collectionSummary.map((collection) => (
<button key={collection.name} type="button" onClick={() => { setCollectionFilter(collection.name); setActiveMenu("محصولات"); }} className="rounded-2xl border border-white/10 bg-black/30 p-4 text-right transition hover:border-[#d5b466]/60 hover:bg-[#d5b466]/5">
<span className="block text-sm font-bold text-[#e2c77f]">{collection.name}</span>
<span className="mt-2 block text-xs text-white/45">{collection.count} محصول</span>
<span className="mt-3 block text-[10px] text-[#d5b466]">مشاهده و مدیریت محصولات ←</span>
</button>
))}
</div>
</section>
)}

<div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-4">
<StatCard title="کالکشن‌ها" value={String(collectionSummary.length)} icon="◇" />
<StatCard title="محصولات" value={String(products.length)} icon="✦" />
<StatCard title="محصولات فعال" value={String(activeProductCount)} icon="✓" />
<StatCard title="محصولات غیرفعال" value={String(inactiveProductCount)} icon="◌" />
</div>

<div className="mt-5 grid gap-5 2xl:grid-cols-[minmax(0,1fr)_300px]">
<section className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0b]">
<div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
<div>
<h3 className="text-sm font-black">
لیست محصولات
</h3>

<p className="mt-1 text-[11px] text-white/35">
مدیریت محصولات ثبت‌شده
</p>
</div>

<Link
href="/admin/new"
className="rounded-xl bg-gradient-to-r from-[#b88b3b] to-[#d7b76e] px-4 py-2 text-xs font-black text-black"
>
افزودن محصول
</Link>
</div>

<div className="border-b border-white/10 p-4">
<div className="grid gap-3 md:grid-cols-[1fr_180px]">
<input
value={searchTerm}
onChange={(event) => setSearchTerm(event.target.value)}
className="min-h-11 rounded-xl border border-white/10 bg-black/40 px-4 text-xs outline-none placeholder:text-white/25 focus:border-[#d5b466]/60"
placeholder="جستجو براساس کد، نام یا طرح..."
/>

<select
value={collectionFilter}
onChange={(event) => setCollectionFilter(event.target.value)}
className="min-h-11 rounded-xl border border-white/10 bg-black/40 px-4 text-xs text-white/55 outline-none"
>
<option>همه کالکشن‌ها</option>
{Array.from(new Set(products.map((product) => product.collection))).map(
(collection) => (
<option key={collection} value={collection}>
{collection}
</option>
)
)}
</select>
</div>
</div>

{(isLoadingProducts || productsError) && (
<div className="border-b border-white/10 px-4 py-3 text-[11px] text-white/40">
{isLoadingProducts ? "در حال دریافت محصولات..." : productsError}
</div>
)}

<div className="overflow-x-auto">
<table className="w-full min-w-[720px] border-collapse text-xs">
<thead>
<tr className="border-b border-white/10 text-white/35">
<th className="px-4 py-4 text-right font-medium">
تصویر
</th>
<th className="px-4 py-4 text-right font-medium">
کد محصول
</th>
<th className="px-4 py-4 text-right font-medium">
نام محصول
</th>
<th className="px-4 py-4 text-right font-medium">
کالکشن
</th>
<th className="px-4 py-4 text-right font-medium">
رنگ‌بندی
</th>
<th className="px-4 py-4 text-right font-medium">
وضعیت
</th>
<th className="px-4 py-4 text-right font-medium">
عملیات
</th>
</tr>
</thead>

<tbody>
{filteredProducts.map((product) => (
<tr
key={product.code}
className="border-b border-white/[0.06] transition hover:bg-white/[0.025]"
>
<td className="px-4 py-3">
<div className="relative h-10 w-10 overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-[#6c5a46] to-[#25211c]">
<img
src={product.image}
alt={product.title}
className="h-full w-full object-cover"
loading="lazy"
referrerPolicy="no-referrer"
/>
</div>
</td>

<td className="px-4 py-3 font-bold text-[#dfc27c]">
{product.code}
</td>

<td className="px-4 py-3 text-white/80">
{product.title}
</td>

<td className="px-4 py-3 text-white/50">
{product.collection}
</td>

<td className="px-4 py-3">
<div className="flex gap-1.5">
{["#d9ccb2", "#ad8e70", "#74604d", "#302a26"].map(
(color) => (
<span
key={color}
className="h-5 w-5 rounded-full border border-white/15"
style={{ backgroundColor: color }}
/>
)
)}
</div>
</td>

<td className="px-4 py-3">
<span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold text-emerald-300">
{product.status}
</span>
</td>

<td className="px-4 py-3">
<div className="flex gap-2">
<button
type="button"
onClick={() => startEditing(product)}
aria-label={`ویرایش ${product.title}`}
className="grid h-8 w-8 place-items-center rounded-lg border border-[#d5b466]/20 bg-[#d5b466]/5 text-[#d5b466]"
>
✎
</button>

<button
type="button"
onClick={() => deleteProduct(product)}
aria-label={`حذف ${product.title}`}
className="grid h-8 w-8 place-items-center rounded-lg border border-red-400/20 bg-red-400/5 text-red-300"
>
×
</button>
</div>
</td>
</tr>
))}
</tbody>
</table>
{!isLoadingProducts && filteredProducts.length === 0 && (
<p className="px-5 py-10 text-center text-xs text-white/35">
محصولی با این مشخصات پیدا نشد.
</p>
)}
</div>
</section>

<section className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-5">
<h3 className="text-sm font-black">
محبوب‌ترین کالکشن‌ها
</h3>

<p className="mt-1 text-[11px] text-white/35">
سهم محصولات هر کالکشن
</p>

<div className="mt-7 flex justify-center">
<div className="relative grid h-36 w-36 place-items-center rounded-full bg-[conic-gradient(#d4b36a_0_37%,#927548_37%_61%,#574936_61%_80%,#28231d_80%_100%)]">
<div className="grid h-24 w-24 place-items-center rounded-full bg-[#0b0b0b]">
<div className="text-center">
<strong className="text-2xl">9</strong>
<p className="mt-1 text-[10px] text-white/35">
کالکشن
</p>
</div>
</div>
</div>
</div>

<div className="mt-7 space-y-3">
<Legend color="#d4b36a" title="مخمل دوشانل دورو" value="37%" />
<Legend color="#927548" title="مخمل ابریشم" value="24%" />
<Legend color="#574936" title="مخمل زرکدار" value="19%" />
<Legend color="#28231d" title="سایر" value="20%" />
</div>
</section>
</div>
</section>

{/* Product Wizard */}
<aside className="border-r border-white/10 bg-[#090909]">
<div className="sticky top-0 max-h-screen overflow-y-auto">
<div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
<div>
<p className="text-[10px] text-white/35">
محصول جدید
</p>

<h2 className="mt-1 text-base font-black">
افزودن محصول
</h2>
</div>

<button className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-white/35">
×
</button>
</div>

<div className="grid grid-cols-[64px_minmax(0,1fr)]">
<div className="border-l border-white/10 p-2">
{[1, 2, 3, 4, 5, 6].map((step) => (
<button
key={step}
type="button"
onClick={() => setActiveStep(step)}
className={`mb-2 flex min-h-14 w-full flex-col items-center justify-center rounded-xl text-[9px] font-bold transition ${
activeStep === step
? "border border-[#d4b36a]/40 bg-[#d4b36a]/10 text-[#e1c47d]"
: "text-white/35 hover:bg-white/5"
}`}
>
<span className="mb-1 text-sm">
{step}
</span>

<span>
{step === 1 && "اصلی"}
{step === 2 && "رنگ"}
{step === 3 && "ابعاد"}
{step === 4 && "ویژگی"}
{step === 5 && "تصویر"}
{step === 6 && "انتشار"}
</span>
</button>
))}
</div>

<div className="p-5">
{activeStep === 1 && (
<div className="space-y-4">
<WizardTitle
title="اطلاعات اصلی"
subtitle="مشخصات پایه محصول را وارد کنید"
/>

<FormInput
label="کالکشن"
placeholder="مخمل دوشانل دورو"
/>

<FormInput
label="کد محصول"
placeholder="YA-350"
/>

<FormInput
label="نام محصول"
placeholder="طرح جدید دوشانل"
/>

<FormInput
label="نام طرح"
placeholder="طرح 350"
/>

<label className="block">
<span className="mb-2 block text-[11px] font-bold text-white/55">
توضیحات کوتاه
</span>

<textarea
className="min-h-24 w-full resize-none rounded-xl border border-white/10 bg-black/40 p-3 text-xs outline-none placeholder:text-white/20 focus:border-[#d5b466]/60"
placeholder="توضیحات محصول..."
/>
</label>
</div>
)}

{activeStep === 2 && (
<div>
<WizardTitle
title="رنگ‌بندی"
subtitle="رنگ‌های قابل تولید را انتخاب کنید"
/>

<div className="grid grid-cols-2 gap-3">
{[...colors, ...customColors].map((color) => {
const active = selectedColors.includes(color.title);

return (
<button
key={color.title}
type="button"
onClick={() => toggleColor(color.title)}
className={`flex items-center gap-3 rounded-xl border p-3 text-xs font-bold transition ${
active
? "border-[#d5b466] bg-[#d5b466]/10 text-[#e2c77f]"
: "border-white/10 bg-black/30 text-white/50"
}`}
>
<span
className="h-6 w-6 rounded-full border border-white/20"
style={{ backgroundColor: color.value }}
/>

<span>{color.title}</span>

{active && (
<span className="mr-auto text-[#d5b466]">
✓
</span>
)}
</button>
);
})}
</div>
<div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
<p className="text-xs font-bold text-[#e2c77f]">ساخت رنگ ترکیبی یا اختصاصی</p>
<div className="mt-3 grid grid-cols-[1fr_52px] gap-2">
<input value={customColorName} onChange={(event) => setCustomColorName(event.target.value)} placeholder="نام رنگ، مثلاً کرم-طلایی" className="min-h-10 rounded-xl border border-white/10 bg-black/40 px-3 text-xs outline-none focus:border-[#d5b466]/60" />
<input type="color" value={customColorValue} onChange={(event) => setCustomColorValue(event.target.value)} className="h-10 w-full cursor-pointer rounded-xl border border-white/10 bg-black/40 p-1" aria-label="انتخاب رنگ" />
</div>
<button type="button" onClick={addCustomColor} className="mt-3 w-full rounded-xl border border-[#d5b466]/40 bg-[#d5b466]/10 px-3 py-2 text-xs font-bold text-[#e2c77f]">افزودن رنگ</button>
{customColors.length > 0 && <div className="mt-3 space-y-2">{customColors.map((color) => <div key={color.title} className="flex items-center justify-between rounded-xl border border-white/10 px-3 py-2 text-xs"><span className="flex items-center gap-2"><span className="h-5 w-5 rounded-full border border-white/20" style={{ backgroundColor: color.value }} />{color.title}</span><button type="button" onClick={() => removeCustomColor(color.title)} className="text-red-300">حذف</button></div>)}</div>}
</div>
</div>
)}

{activeStep === 3 && (
<div>
<WizardTitle
title="ابعاد"
subtitle="سایزهای قابل تولید را انتخاب کنید"
/>

<div className="grid grid-cols-2 gap-3">
{sizes.map((size) => {
const active = selectedSizes.includes(size);

return (
<button
key={size}
type="button"
onClick={() => toggleSize(size)}
className={`min-h-12 rounded-xl border px-3 text-xs font-bold transition ${
active
? "border-[#d5b466] bg-[#d5b466]/10 text-[#e2c77f]"
: "border-white/10 bg-black/30 text-white/50"
}`}
>
<span>{size}</span>

{active && (
<span className="mr-2">✓</span>
)}
</button>
);
})}
</div>
</div>
)}

{activeStep === 4 && (
<EmptyStep
title="ویژگی‌های محصول"
text="ویژگی‌هایی مثل دورو، ضد لغزش، مخملی و قابل شست‌وشو در این مرحله قرار می‌گیرند."
/>
)}

{activeStep === 5 && (
<EmptyStep
title="تصاویر محصول"
text="آپلود تصویر اصلی و گالری تصاویر در این مرحله ساخته می‌شود."
/>
)}

{activeStep === 6 && (
<EmptyStep
title="بررسی و انتشار"
text="خلاصه اطلاعات محصول و دکمه ثبت نهایی در این مرحله قرار می‌گیرد."
/>
)}

<div className="mt-7 flex gap-3 border-t border-white/10 pt-5">
<button
type="button"
onClick={() =>
setActiveStep((current) => Math.max(1, current - 1))
}
className="min-h-11 flex-1 rounded-xl border border-white/10 bg-white/[0.03] text-xs font-bold text-white/50"
>
قبلی
</button>

<button
type="button"
onClick={() =>
setActiveStep((current) => Math.min(6, current + 1))
}
className="min-h-11 flex-[1.5] rounded-xl bg-gradient-to-r from-[#b4883b] to-[#d6b66d] text-xs font-black text-black"
>
مرحله بعد
</button>
</div>
</div>
</div>
</div>
</aside>
</div>

{editingProduct && (
<div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4 backdrop-blur-sm">
<section className="w-full max-w-lg rounded-[28px] border border-[#d7b56d]/30 bg-[#11100d] p-6 shadow-2xl">
<div className="flex items-start justify-between gap-4">
<div>
<p className="text-[10px] font-bold tracking-[0.25em] text-[#d7b56d]">
EDIT PRODUCT
</p>
<h2 className="mt-2 text-xl font-black">ویرایش محصول</h2>
</div>
<button
type="button"
onClick={() => setEditingProduct(null)}
className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-white/45"
>
×
</button>
</div>

<div className="mt-6 space-y-4">
<FormInput label="کد محصول" value={editCode} onChange={setEditCode} />
<FormInput label="نام محصول" value={editTitle} onChange={setEditTitle} />
<FormInput label="کالکشن" value={editCollection} onChange={setEditCollection} />
</div>

<div className="mt-6 flex gap-3">
<button
type="button"
onClick={() => setEditingProduct(null)}
className="min-h-11 flex-1 rounded-xl border border-white/10 bg-white/[0.03] text-xs font-bold text-white/55"
>
انصراف
</button>
<button
type="button"
onClick={saveProductEdit}
disabled={isSavingProduct}
className="min-h-11 flex-[1.5] rounded-xl bg-gradient-to-r from-[#b4883b] to-[#d6b66d] text-xs font-black text-black disabled:opacity-50"
>
{isSavingProduct ? "در حال ذخیره..." : "ذخیره تغییرات"}
</button>
</div>
</section>
</div>
)}
</main>
);
}

function StatCard({
title,
value,
icon,
}: {
title: string;
value: string;
icon: string;
}) {
return (
<article className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-4">
<div className="flex items-start justify-between">
<div>
<p className="text-[11px] text-white/40">
{title}
</p>

<strong className="mt-3 block text-2xl">
{value}
</strong>

<p className="mt-1 text-[10px] text-white/30">
مجموع
</p>
</div>

<span className="grid h-10 w-10 place-items-center rounded-xl border border-[#d4b36a]/20 bg-[#d4b36a]/5 text-[#d4b36a]">
{icon}
</span>
</div>
</article>
);
}

function Legend({
color,
title,
value,
}: {
color: string;
title: string;
value: string;
}) {
return (
<div className="flex items-center gap-3 text-[11px]">
<span
className="h-2.5 w-2.5 rounded-full"
style={{ backgroundColor: color }}
/>

<span className="text-white/50">
{title}
</span>

<strong className="mr-auto text-white/75">
{value}
</strong>
</div>
);
}

function WizardTitle({
title,
subtitle,
}: {
title: string;
subtitle: string;
}) {
return (
<div className="mb-5">
<h3 className="text-sm font-black">
{title}
</h3>

<p className="mt-1 text-[10px] leading-5 text-white/35">
{subtitle}
</p>
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
<span className="mb-2 block text-[11px] font-bold text-white/55">
{label}
</span>

<input
value={value}
onChange={onChange ? (event) => onChange(event.target.value) : undefined}
className="min-h-11 w-full rounded-xl border border-white/10 bg-black/40 px-3 text-xs outline-none placeholder:text-white/20 focus:border-[#d5b466]/60"
placeholder={placeholder}
/>
</label>
);
}

function EmptyStep({
title,
text,
}: {
title: string;
text: string;
}) {
const [draftValue, setDraftValue] = useState("");
const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

return (
<div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-6 text-center">
<div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-[#d5b466]/20 bg-[#d5b466]/5 text-[#d5b466]">
✦
</div>

<h3 className="mt-4 text-sm font-black">
{title}
</h3>

<p className="mt-2 text-[11px] leading-6 text-white/35">
{text}
</p>

<input
value={draftValue}
onChange={(event) => setDraftValue(event.target.value)}
placeholder="مقدار یا تنظیم سفارشی را وارد کنید"
className="mt-5 min-h-11 w-full rounded-xl border border-white/10 bg-black/40 px-3 text-right text-xs outline-none placeholder:text-white/20 focus:border-[#d5b466]/60"
/>

<label className="mt-3 flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-[#d5b466]/35 bg-black/20 px-3 py-3 text-xs text-white/55 hover:border-[#d5b466]">
<span>افزودن تصویر یا فایل مرتبط</span>
<span className="text-[#e2c77f]">انتخاب</span>
<input
type="file"
accept="image/*"
multiple
onChange={(event) => {
const names = Array.from(event.target.files || []).map((file) => file.name);
setSelectedFiles((current) => [...current, ...names].slice(0, 12));
event.target.value = "";
}}
className="hidden"
/>
</label>

{selectedFiles.length > 0 && (
<p className="mt-3 text-right text-[10px] text-white/45">
{selectedFiles.length} فایل انتخاب شده است.
</p>
)}

<Link href="/admin/new" className="mt-5 block rounded-xl bg-gradient-to-r from-[#b4883b] to-[#d6b66d] px-4 py-3 text-xs font-black text-black">
باز کردن فرم کامل و ذخیره تنظیمات
</Link>

</div>
);
}
