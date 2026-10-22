import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { type Category, type MenuItem } from "../data/menu";
import { BackIcon, PendingLabel, Price, SmartImage } from "./ui";
import { Plus, Minus, ShoppingBag, Check } from "lucide-react";

export default function ProductSheet({
  item,
  category,
  onClose,
  onAddToCart,
}: {
  item: MenuItem;
  category: Category;
  onClose: () => void;
  onAddToCart?: (item: MenuItem, price: number, sizeLabel?: string, flavor?: string, count?: number) => void;
}) {
  const [sizeIdx, setSizeIdx] = useState(0);
  const [flavor, setFlavor] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const backRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    backRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      prev?.focus?.();
    };
  }, [onClose]);

  const size = item.sizes?.[sizeIdx];
  const currentPrice = item.sizes ? size?.price : item.price;

  const handleAdd = () => {
    if (currentPrice === undefined || !onAddToCart) return;
    onAddToCart(item, currentPrice, size?.label, flavor || undefined, qty);
    setAdded(true);
    window.setTimeout(() => {
      setAdded(false);
      onClose();
    }, 700);
  };

  const chip = (on: boolean) =>
    `press min-h-[44px] rounded-full border px-4 text-[15px] font-semibold transition-colors duration-200 ${
      on ? "border-espresso bg-espresso text-cream" : "border-roast/25 bg-ivory text-roast hover:border-roast/60"
    }`;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center md:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={item.name}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <button type="button" aria-label="إغلاق" tabIndex={-1} onClick={onClose} className="absolute inset-0 bg-espresso/70 backdrop-blur-xs" />
      <motion.div
        initial={reduce ? { opacity: 0 } : { y: "100%" }}
        animate={reduce ? { opacity: 1 } : { y: 0 }}
        exit={reduce ? { opacity: 0 } : { y: "100%" }}
        transition={reduce ? { duration: 0.15 } : { type: "spring", damping: 32, stiffness: 320, mass: 0.9 }}
        className="relative max-h-[94svh] w-full max-w-lg overflow-y-auto rounded-t-[32px] bg-cream text-espresso shadow-2xl md:rounded-[32px]"
      >
        {/* Mobile Pull Indicator */}
        <div className="absolute top-2.5 inset-x-0 z-20 flex justify-center md:hidden">
          <span className="h-1.5 w-12 rounded-full bg-cream/70" />
        </div>

        <div className="relative aspect-[4/3] overflow-hidden bg-sand">
          <SmartImage id={item.img} alt={item.alt || item.name} w={900} eager sizes="(min-width: 512px) 512px, 100vw" className="h-full w-full" />
          {item.img && <div key={`${sizeIdx}-${flavor}`} className="sheen absolute inset-0 overflow-hidden" aria-hidden />}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-espresso/55 to-transparent" />
          <button
            ref={backRef}
            type="button"
            onClick={onClose}
            className="press absolute end-4 top-4 inline-flex h-11 items-center gap-2 rounded-full bg-ivory px-4 text-[15px] font-semibold text-espresso shadow-soft"
          >
            <BackIcon />
            رجوع
          </button>
        </div>

        <div className="px-5 pb-8 pt-5" style={{ paddingBottom: "calc(2rem + env(safe-area-inset-bottom))" }}>
          <p className="text-[13px] font-semibold tracking-wide text-roast">{category.title}</p>
          <h2 className="mt-1 text-[1.7rem] font-bold leading-[1.45]">{item.name}</h2>
          {item.desc && <p className="mt-1 text-[16px] text-roast">{item.desc}</p>}

          <div className="mt-4">
            {item.sizes ? (
              <>
                <div className="flex items-baseline justify-between rounded-2xl bg-espresso px-4 py-3 text-cream">
                  <span className="text-[15px] text-caramel-light">الحجم: {size?.label}</span>
                  {size && <Price value={size.price} className="text-[26px]" currencyClass="text-caramel-light" />}
                </div>
                <div role="radiogroup" aria-label="اختر الحجم" className="mt-3 grid grid-cols-3 gap-2">
                  {item.sizes.map((s, i) => {
                    const on = i === sizeIdx;
                    return (
                      <button
                        key={s.label}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => setSizeIdx(i)}
                        className={`press rounded-2xl border px-2 py-3 text-center transition-colors duration-200 ${
                          on ? "border-tomato bg-tomato text-ivory" : "border-roast/25 bg-ivory text-espresso hover:border-roast/60"
                        }`}
                      >
                        <span className="block text-[14px] font-medium">{s.label}</span>
                        <Price value={s.price} className="text-[17px]" currencyClass={on ? "text-ivory/85" : "text-roast"} />
                      </button>
                    );
                  })}
                </div>
              </>
            ) : item.status === "priced" && item.price !== undefined ? (
              <Price value={item.price} className="text-[30px] text-tomato-deep" currencyClass="text-roast" />
            ) : (
              <PendingLabel status={item.status as "pending" | "verify"} className="!text-[14px] !px-3 !py-1" />
            )}
          </div>

          {item.flavors && (
            <div className="mt-6">
              <h3 className="text-[16px] font-semibold">النكهات المتوفرة</h3>
              <div role="radiogroup" aria-label="النكهات" className="mt-3 flex flex-wrap gap-2">
                {item.flavors.map((f) => {
                  const on = f === flavor;
                  return (
                    <button
                      key={f}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => setFlavor(on ? null : f)}
                      className={chip(on)}
                    >
                      {f}
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 min-h-[24px] text-[14px] text-roast" aria-live="polite">
                {flavor ? `النكهة المختارة: ${flavor}` : "اضغط على نكهة لاستعراضها"}
              </p>
            </div>
          )}

          {item.note && <p className="mt-5 rounded-2xl bg-latte px-4 py-3 text-[14px] text-roast">{item.note}</p>}

          {/* Quick Add to Cart Bar */}
          {currentPrice !== undefined && onAddToCart && (
            <div className="mt-6 flex items-center gap-3 border-t border-roast/10 pt-4">
              {/* Stepper */}
              <div className="flex items-center gap-2 rounded-full border border-roast/20 bg-ivory p-1.5 shadow-xs">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="grid h-9 w-9 place-items-center rounded-full bg-latte text-espresso transition-transform active:scale-90"
                  aria-label="تقليل الكمية"
                >
                  <Minus size={16} />
                </button>
                <span className="w-7 text-center font-display text-[16px] font-bold tabular-nums">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  className="grid h-9 w-9 place-items-center rounded-full bg-espresso text-cream transition-transform active:scale-90"
                  aria-label="زيادة الكمية"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Add Button */}
              <button
                type="button"
                onClick={handleAdd}
                className={`press flex-1 flex h-[52px] items-center justify-center gap-2 rounded-full text-[16px] font-bold text-white shadow-soft transition-all ${
                  added ? "bg-emerald-600 scale-[0.98]" : "bg-tomato hover:bg-tomato-deep"
                }`}
              >
                {added ? (
                  <>
                    <Check size={20} className="stroke-[3]" />
                    تمت الإضافة!
                  </>
                ) : (
                  <>
                    <ShoppingBag size={20} />
                    <span>أضف للطلب · {(currentPrice * qty).toFixed(2)} د.أ</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
