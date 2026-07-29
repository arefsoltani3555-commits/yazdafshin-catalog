"use client";

type ColorOption = {
  id: string;
  name: string;
  hex: string;
};

export type ColorCombination = {
  id: string;
  mode: "single" | "mixed";
  firstColor: ColorOption;
  secondColor?: ColorOption;
};

type StepColorsProps = {
  colorMode: "single" | "mixed";
  setColorMode: (mode: "single" | "mixed") => void;
  selectedFirstColor: ColorOption | null;
  setSelectedFirstColor: (color: ColorOption | null) => void;
  selectedSecondColor: ColorOption | null;
  setSelectedSecondColor: (color: ColorOption | null) => void;
  combinations: ColorCombination[];
  setCombinations: (items: ColorCombination[]) => void;
};

const COLOR_OPTIONS: ColorOption[] = [
  { id: "cream", name: "کرم", hex: "#DED0B8" },
  { id: "gray", name: "طوسی", hex: "#888888" },
  { id: "navy", name: "سورمه‌ای", hex: "#202B46" },
  { id: "burgundy", name: "زرشکی", hex: "#702937" },
  { id: "turquoise", name: "فیروزه‌ای", hex: "#278B8E" },
  { id: "nescafe", name: "نسکافه‌ای", hex: "#A67F60" },
  { id: "brown", name: "قهوه‌ای", hex: "#644830" },
  { id: "black", name: "مشکی", hex: "#171717" },
  { id: "bone", name: "استخوانی", hex: "#EEE7DA" },
];

export default function StepColors({
  colorMode,
  setColorMode,
  selectedFirstColor,
  setSelectedFirstColor,
  selectedSecondColor,
  setSelectedSecondColor,
  combinations,
  setCombinations,
}: StepColorsProps) {
  function addCombination() {
    if (!selectedFirstColor) {
      alert("رنگ اول را انتخاب کنید.");
      return;
    }

    if (colorMode === "mixed" && !selectedSecondColor) {
      alert("برای رنگ‌بندی میکس، رنگ دوم را هم انتخاب کنید.");
      return;
    }

    if (
      colorMode === "mixed" &&
      selectedFirstColor.id === selectedSecondColor?.id
    ) {
      alert("رنگ اول و دوم نمی‌توانند یکسان باشند.");
      return;
    }

    const duplicateExists = combinations.some((item) => {
      if (colorMode === "single") {
        return item.mode === "single" && item.firstColor.id === selectedFirstColor.id;
      }

      return (
        item.mode === "mixed" &&
        ((item.firstColor.id === selectedFirstColor.id &&
          item.secondColor?.id === selectedSecondColor?.id) ||
          (item.firstColor.id === selectedSecondColor?.id &&
            item.secondColor?.id === selectedFirstColor.id))
      );
    });

    if (duplicateExists) {
      alert("این رنگ‌بندی قبلاً اضافه شده است.");
      return;
    }

    const newItem: ColorCombination = {
      id:
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`,
      mode: colorMode,
      firstColor: selectedFirstColor,
      secondColor: colorMode === "mixed" ? selectedSecondColor || undefined : undefined,
    };

    setCombinations([...combinations, newItem]);
    setSelectedFirstColor(null);
    setSelectedSecondColor(null);
  }

  function removeCombination(id: string) {
    setCombinations(combinations.filter((item) => item.id !== id));
  }

  function resetCurrentSelection() {
    setSelectedFirstColor(null);
    setSelectedSecondColor(null);
  }

  return (
    <div dir="rtl">
      <div className="mb-7">
        <p className="text-[10px] font-bold tracking-[0.2em] text-[#C9A65C]">
          PRODUCT COLORS
        </p>
        <h3 className="mt-2 text-lg font-black text-white">رنگ‌بندی محصول</h3>
        <p className="mt-2 text-xs leading-6 text-white/40">
          محصول می‌تواند تک‌رنگ یا ترکیبی از دو رنگ باشد. شما می‌توانید برای هر
          طرح چند رنگ‌بندی متفاوت ثبت کنید.
        </p>
      </div>

      <section className="rounded-2xl border border-white/10 bg-black/25 p-4">
        <p className="mb-3 text-xs font-bold text-white/65">نوع رنگ‌بندی</p>

        <div className="grid grid-cols-2 gap-3">
          <ModeButton
            active={colorMode === "single"}
            title="تک‌رنگ"
            description="یک رنگ اصلی"
            onClick={() => {
              setColorMode("single");
              setSelectedSecondColor(null);
            }}
          />

          <ModeButton
            active={colorMode === "mixed"}
            title="میکس دورنگ"
            description="ترکیب دو رنگ"
            onClick={() => setColorMode("mixed")}
          />
        </div>
      </section>

      <section className="mt-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-bold text-white/65">
            {colorMode === "mixed" ? "رنگ اول ترکیب" : "انتخاب رنگ"}
          </p>

          {selectedFirstColor && <SelectedColorMini color={selectedFirstColor} />}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {COLOR_OPTIONS.map((color) => (
            <ColorCard
              key={color.id}
              color={color}
              active={selectedFirstColor?.id === color.id}
              disabled={colorMode === "mixed" && selectedSecondColor?.id === color.id}
              onClick={() => setSelectedFirstColor(color)}
            />
          ))}
        </div>
      </section>

      {colorMode === "mixed" && (
        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-bold text-white/65">رنگ دوم ترکیب</p>

            {selectedSecondColor && <SelectedColorMini color={selectedSecondColor} />}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {COLOR_OPTIONS.map((color) => (
              <ColorCard
                key={color.id}
                color={color}
                active={selectedSecondColor?.id === color.id}
                disabled={selectedFirstColor?.id === color.id}
                onClick={() => setSelectedSecondColor(color)}
              />
            ))}
          </div>
        </section>
      )}

      <section className="mt-6 rounded-2xl border border-[#C9A65C]/20 bg-[#C9A65C]/[0.04] p-4">
        <p className="text-xs font-bold text-white/60">پیش‌نمایش ترکیب</p>

        <div className="mt-4 flex items-center gap-4">
          <div className="relative h-16 w-28 overflow-hidden rounded-2xl border border-white/15 bg-white/5">
            {selectedFirstColor ? (
              colorMode === "single" ? (
                <div
                  className="h-full w-full"
                  style={{ backgroundColor: selectedFirstColor.hex }}
                />
              ) : (
                <>
                  <div
                    className="absolute inset-y-0 right-0 w-1/2"
                    style={{ backgroundColor: selectedFirstColor.hex }}
                  />
                  <div
                    className="absolute inset-y-0 left-0 w-1/2"
                    style={{ backgroundColor: selectedSecondColor?.hex || "#161616" }}
                  />
                </>
              )
            ) : (
              <div className="grid h-full place-items-center text-[10px] text-white/20">
                انتخاب نشده
              </div>
            )}
          </div>

          <div>
            <p className="text-sm font-black text-white">
              {getPreviewTitle(colorMode, selectedFirstColor, selectedSecondColor)}
            </p>
            <p className="mt-1 text-[10px] text-white/35">
              {colorMode === "mixed" ? "ترکیب دورنگ" : "رنگ‌بندی تکی"}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-[1fr_auto] gap-3">
          <button
            type="button"
            onClick={addCombination}
            className="min-h-12 rounded-xl bg-gradient-to-r from-[#A97C31] via-[#DBBD72] to-[#B4883A] px-4 text-xs font-black text-black transition hover:-translate-y-0.5"
          >
            افزودن این رنگ‌بندی
          </button>

          <button
            type="button"
            onClick={resetCurrentSelection}
            className="min-h-12 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-xs font-bold text-white/45 transition hover:border-white/20 hover:text-white"
          >
            پاک‌کردن
          </button>
        </div>
      </section>

      <section className="mt-7">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-black text-white">رنگ‌بندی‌های ثبت‌شده</p>
            <p className="mt-1 text-[10px] text-white/35">
              {combinations.length} رنگ‌بندی انتخاب شده
            </p>
          </div>
        </div>

        {combinations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 px-4 py-8 text-center">
            <p className="text-xs text-white/30">
              هنوز رنگ‌بندی‌ای اضافه نشده است.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {combinations.map((item, index) => (
              <CombinationRow
                key={item.id}
                item={item}
                index={index}
                onRemove={() => removeCombination(item.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ModeButton({
  active,
  title,
  description,
  onClick,
}: {
  active: boolean;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border p-4 text-right transition ${
        active
          ? "border-[#D2B369]/70 bg-[#D2B369]/10"
          : "border-white/10 bg-black/25 hover:border-white/20"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`grid h-5 w-5 place-items-center rounded-full border ${
            active ? "border-[#D2B369] bg-[#D2B369]" : "border-white/20"
          }`}
        >
          {active && <span className="h-2 w-2 rounded-full bg-black" />}
        </span>

        <div>
          <p
            className={`text-xs font-black ${
              active ? "text-[#E5CA84]" : "text-white/55"
            }`}
          >
            {title}
          </p>
          <p className="mt-1 text-[9px] text-white/30">{description}</p>
        </div>
      </div>
    </button>
  );
}

function ColorCard({
  color,
  active,
  disabled,
  onClick,
}: {
  color: ColorOption;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`relative flex min-h-[84px] flex-col items-center justify-center rounded-xl border p-3 transition ${
        active
          ? "border-[#D5B66D] bg-[#D5B66D]/10 shadow-[0_0_0_3px_rgba(213,182,109,0.06)]"
          : "border-white/10 bg-black/25 hover:border-white/20"
      } ${disabled ? "cursor-not-allowed opacity-25" : ""}`}
    >
      <span
        className="h-9 w-9 rounded-full border border-white/20 shadow-inner"
        style={{ backgroundColor: color.hex }}
      />

      <span
        className={`mt-2 text-[10px] font-bold ${
          active ? "text-[#E5CA84]" : "text-white/50"
        }`}
      >
        {color.name}
      </span>

      {active && (
        <span className="absolute left-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-[#D5B66D] text-[10px] font-black text-black">
          ✓
        </span>
      )}
    </button>
  );
}

function SelectedColorMini({ color }: { color: ColorOption }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1">
      <span
        className="h-3 w-3 rounded-full border border-white/15"
        style={{ backgroundColor: color.hex }}
      />
      <span className="text-[9px] font-bold text-white/55">{color.name}</span>
    </div>
  );
}

function CombinationRow({
  item,
  index,
  onRemove,
}: {
  item: ColorCombination;
  index: number;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 p-3">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-[10px] font-black text-white/35">
        {index + 1}
      </span>

      <div className="relative h-11 w-16 shrink-0 overflow-hidden rounded-xl border border-white/15">
        {item.mode === "single" ? (
          <div
            className="h-full w-full"
            style={{ backgroundColor: item.firstColor.hex }}
          />
        ) : (
          <>
            <div
              className="absolute inset-y-0 right-0 w-1/2"
              style={{ backgroundColor: item.firstColor.hex }}
            />
            <div
              className="absolute inset-y-0 left-0 w-1/2"
              style={{ backgroundColor: item.secondColor?.hex }}
            />
          </>
        )}
      </div>

      <div className="min-w-0">
        <p className="truncate text-xs font-black text-white/80">
          {item.mode === "single"
            ? item.firstColor.name
            : `${item.firstColor.name} + ${item.secondColor?.name}`}
        </p>
        <p className="mt-1 text-[9px] text-white/30">
          {item.mode === "single" ? "تک‌رنگ" : "میکس دورنگ"}
        </p>
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="mr-auto grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-red-400/20 bg-red-400/5 text-sm text-red-300 transition hover:bg-red-400/10"
      >
        ×
      </button>
    </div>
  );
}

function getPreviewTitle(
  mode: "single" | "mixed",
  firstColor: ColorOption | null,
  secondColor: ColorOption | null,
) {
  if (!firstColor) {
    return "رنگی انتخاب نشده";
  }

  if (mode === "single") {
    return firstColor.name;
  }

  if (!secondColor) {
    return `${firstColor.name} + انتخاب رنگ دوم`;
  }

  return `${firstColor.name} + ${secondColor.name}`;
}
