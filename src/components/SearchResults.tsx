import { motion, useReducedMotion } from "motion/react";
import { type SearchHit } from "../data/menu";
import { ChevronLeftIcon, PendingLabel, Price, SearchIcon, SmartImage } from "./ui";

export default function SearchResults({
  query,
  hits,
  onOpen,
  onReset,
}: {
  query: string;
  hits: SearchHit[];
  onOpen: (hit: SearchHit) => void;
  onReset: () => void;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.section
      aria-label="نتائج البحث"
      initial={reduce ? false : { opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? undefined : { opacity: 0, y: -6 }}
      transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
      className="mx-auto mt-4 max-w-5xl"
    >
      {hits.length > 0 ? (
        <>
          <div className="flex items-center justify-between gap-3">
            <p className="text-[14px] text-roast" aria-live="polite">
              {hits.length} {hits.length === 1 ? "نتيجة" : "نتائج"} لـ «{query.trim()}»
            </p>
            <button type="button" onClick={onReset} className="press h-11 rounded-full px-3 text-[14px] font-semibold text-tomato-deep">
              عرض المنيو كاملاً
            </button>
          </div>
          <ul className="mt-1 grid gap-2.5 md:grid-cols-2">
            {hits.map((h, i) => (
              <motion.li
                key={h.item.id}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i, 8) * 0.03 }}
              >
                <button
                  type="button"
                  onClick={() => onOpen(h)}
                  className="press flex min-h-[72px] w-full items-center gap-3 rounded-2xl bg-ivory p-2.5 text-start shadow-soft transition-colors hover:bg-white"
                >
                  <SmartImage id={h.item.img} alt={h.item.alt} w={144} className="h-14 w-14 shrink-0 rounded-xl" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-[16px] font-semibold leading-snug">{h.item.name}</span>
                    <span className="block truncate text-[13px] text-roast">
                      {h.cat.title}
                      {h.flavor ? ` · نكهة ${h.flavor}` : ""}
                    </span>
                  </span>
                  <span className="shrink-0">
                    {h.item.sizes ? (
                      <span className="text-[13px] text-roast">
                        من <Price value={h.item.sizes[0].price} className="text-[16px] text-tomato-deep" currencyClass="text-roast" />
                      </span>
                    ) : h.item.status === "priced" && h.item.price !== undefined ? (
                      <Price value={h.item.price} className="text-[17px] text-tomato-deep" currencyClass="text-roast" />
                    ) : (
                      <PendingLabel status={h.item.status as "pending" | "verify"} />
                    )}
                  </span>
                  <ChevronLeftIcon className="shrink-0 text-roast/50" />
                </button>
              </motion.li>
            ))}
          </ul>
        </>
      ) : (
        <div className="py-10 text-center" aria-live="polite">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-latte text-roast">
            <SearchIcon />
          </div>
          <h3 className="mt-4 text-xl font-semibold">ما لقينا نتيجة لـ «{query.trim()}»</h3>
          <p className="mt-1 text-roast">جرّب كلمة أخرى أو تصفّح الأقسام.</p>
          <button type="button" onClick={onReset} className="press mt-5 h-12 rounded-full bg-espresso px-6 font-semibold text-cream">
            عرض المنيو كاملاً
          </button>
        </div>
      )}
    </motion.section>
  );
}
