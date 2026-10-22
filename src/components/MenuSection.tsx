import { type Category, type MenuItem } from "../data/menu";
import { ChevronLeftIcon, PendingLabel, Price, Reveal, SmartImage } from "./ui";
import { Plus } from "lucide-react";

type Open = (item: MenuItem, cat: Category) => void;
type QuickAdd = (item: MenuItem, cat: Category) => void;

const TONES: Record<string, { bg: string; dark: boolean }> = {
  pizza: { bg: "bg-espresso", dark: true },
  manakish: { bg: "bg-cream", dark: false },
  shami: { bg: "bg-ivory", dark: false },
  hot: { bg: "bg-latte", dark: false },
  cold: { bg: "bg-[#e3e6d2]", dark: false },
  milkshake: { bg: "bg-[#fbeee6]", dark: false },
  soft: { bg: "bg-ivory", dark: false },
  hookah: { bg: "bg-[#33201a]", dark: true },
  fruit: { bg: "bg-[#f4dfd4]", dark: false },
  addons: { bg: "bg-cream", dark: false },
};

function PriceOrPending({ item, dark = false, className = "text-[17px]" }: { item: MenuItem; dark?: boolean; className?: string }) {
  if (item.status !== "priced" || item.price === undefined) {
    return <PendingLabel status={item.status as "pending" | "verify"} dark={dark} />;
  }
  return <Price value={item.price} className={className} currencyClass={dark ? "text-caramel-light" : "text-roast"} />;
}

function PizzaCard({ item, cat, onOpen }: { item: MenuItem; cat: Category; onOpen: Open }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(item, cat)}
      aria-label={`${item.name} — عرض الأحجام والأسعار`}
      className="press lift group block w-full overflow-hidden rounded-3xl bg-[#35241c] text-start text-cream ring-1 ring-cream/10 transition-transform active:scale-[0.98]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <SmartImage id={item.img} alt={item.alt} w={640} sizes="(min-width: 768px) 340px, 92vw" className="zoom h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#35241c] via-transparent to-transparent" />
        <span className="absolute top-3 end-3 rounded-full bg-tomato/90 px-2.5 py-0.5 text-[11px] font-bold text-white backdrop-blur-xs">
          ٣ أحجام
        </span>
      </div>
      <div className="px-4 pb-4 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-[21px] font-semibold">{item.name}</h3>
          <span className="grid h-8 w-8 place-items-center rounded-full bg-cream/10 text-caramel-light transition-transform group-hover:-translate-x-1" aria-hidden>
            <ChevronLeftIcon />
          </span>
        </div>
        <dl className="mt-3 grid grid-cols-3 gap-2">
          {item.sizes?.map((s) => (
            <div key={s.label} className="rounded-2xl bg-espresso/70 px-2 py-2.5 text-center ring-1 ring-cream/5">
              <dt className="text-[13px] font-medium text-caramel-light">{s.label}</dt>
              <dd className="mt-0.5">
                <Price value={s.price} className="text-[17px] text-cream" currencyClass="text-caramel-light" />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </button>
  );
}

function GridCard({ item, cat, onOpen, onQuickAdd }: { item: MenuItem; cat: Category; onOpen: Open; onQuickAdd?: QuickAdd }) {
  const n = item.flavors?.length ?? 0;
  return (
    <div className="group relative flex h-full w-full flex-col overflow-hidden rounded-[22px] bg-ivory text-start shadow-soft transition-all duration-300 hover:shadow-lift">
      <button
        type="button"
        onClick={() => onOpen(item, cat)}
        className="press flex h-full w-full flex-col text-start"
      >
        <div className="relative aspect-[5/4] w-full overflow-hidden">
          <SmartImage id={item.img} alt={item.alt} w={420} sizes="(min-width: 768px) 240px, 46vw" className="zoom h-full w-full" />
          {n > 0 && (
            <span className="absolute bottom-2 end-2 rounded-full bg-espresso/85 px-2.5 py-0.5 text-[11px] font-medium text-cream backdrop-blur-xs">
              {n} نكهات
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col justify-between gap-2 p-3 pb-3.5">
          <h3 className="font-display text-[15px] font-semibold leading-snug line-clamp-2">{item.name}</h3>
          <div className="flex items-center justify-between">
            <PriceOrPending item={item} className="text-[17px] text-tomato-deep font-bold" />
          </div>
        </div>
      </button>

      {/* Quick Add Button */}
      {item.price !== undefined && onQuickAdd && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onQuickAdd(item, cat);
          }}
          aria-label={`إضافة ${item.name} للطلب`}
          className="absolute bottom-2.5 end-2.5 z-10 grid h-8 w-8 place-items-center rounded-full bg-tomato text-white shadow-md transition-transform hover:scale-110 hover:bg-tomato-deep active:scale-90"
        >
          <Plus size={16} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}

function ListRow({ item, cat, onOpen, onQuickAdd, thumb = 64 }: { item: MenuItem; cat: Category; onOpen: Open; onQuickAdd?: QuickAdd; thumb?: number }) {
  return (
    <div className="flex min-h-[72px] w-full items-center gap-3 rounded-2xl bg-ivory p-2.5 shadow-soft transition-colors hover:bg-white">
      <button
        type="button"
        onClick={() => onOpen(item, cat)}
        className="flex min-w-0 flex-1 items-center gap-3 text-start"
      >
        <SmartImage id={item.img} alt={item.alt} w={thumb * 2} className={`shrink-0 rounded-xl ${thumb >= 72 ? "h-[72px] w-[72px]" : "h-14 w-14"}`} />
        <span className="min-w-0 flex-1 font-display text-[16px] font-semibold leading-snug">{item.name}</span>
        <PriceOrPending item={item} className="shrink-0 text-[17px] text-tomato-deep font-bold" />
      </button>

      {item.price !== undefined && onQuickAdd && (
        <button
          type="button"
          onClick={() => onQuickAdd(item, cat)}
          aria-label={`إضافة ${item.name} للطلب`}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-tomato/15 text-tomato transition-transform hover:bg-tomato hover:text-white active:scale-90"
        >
          <Plus size={16} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}

function FeatureCard({ item, cat, onOpen, onQuickAdd }: { item: MenuItem; cat: Category; onOpen: Open; onQuickAdd?: QuickAdd }) {
  return (
    <div className="group relative flex h-full w-full flex-col overflow-hidden rounded-3xl bg-ivory text-start shadow-soft transition-all duration-300 hover:shadow-lift">
      <button
        type="button"
        onClick={() => onOpen(item, cat)}
        className="press flex h-full w-full flex-col text-start"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <SmartImage id={item.img} alt={item.alt} w={640} sizes="(min-width: 768px) 340px, 92vw" className="zoom h-full w-full" />
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="font-display text-[20px] font-semibold">{item.name}</h3>
          {item.desc && <p className="text-[15px] text-roast">{item.desc}</p>}
          <div className="mt-auto pt-1">
            <PriceOrPending item={item} className="text-[20px] text-tomato-deep font-bold" />
          </div>
        </div>
      </button>

      {item.price !== undefined && onQuickAdd && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onQuickAdd(item, cat);
          }}
          aria-label={`إضافة ${item.name} للطلب`}
          className="absolute bottom-4 end-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-tomato text-white shadow-md transition-transform hover:scale-105 hover:bg-tomato-deep active:scale-90"
        >
          <Plus size={20} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}

function HookahRow({ item, index, cat, onOpen, onQuickAdd }: { item: MenuItem; index: number; cat: Category; onOpen: Open; onQuickAdd?: QuickAdd }) {
  return (
    <div className="flex min-h-[64px] w-full items-center gap-3 border-b border-cream/12 px-1 py-3 text-start transition-colors hover:bg-cream/5">
      <button
        type="button"
        onClick={() => onOpen(item, cat)}
        className="flex min-w-0 flex-1 items-center gap-3 text-start"
      >
        <span className="w-7 font-display text-[15px] text-caramel-light tabular-nums" dir="ltr">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="flex-1 font-display text-[17px] font-semibold">{item.name}</span>
        <PriceOrPending item={item} dark className="text-[18px] font-bold text-caramel-light" />
      </button>

      {item.price !== undefined && onQuickAdd && (
        <button
          type="button"
          onClick={() => onQuickAdd(item, cat)}
          aria-label={`إضافة ${item.name} للطلب`}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-caramel/20 text-caramel-light transition-transform hover:bg-caramel hover:text-espresso active:scale-90"
        >
          <Plus size={16} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}

export default function MenuSection({
  cat,
  items,
  index,
  total,
  onOpen,
  onQuickAdd,
}: {
  cat: Category;
  items: MenuItem[];
  index: number;
  total: number;
  onOpen: Open;
  onQuickAdd?: QuickAdd;
}) {
  const tone = TONES[cat.id] || { bg: "bg-cream", dark: false };
  const dark = tone.dark;
  const stagger = (i: number) => (i % 4) * 60;

  return (
    <section
      id={`cat-${cat.id}`}
      aria-labelledby={`h-${cat.id}`}
      className={`${tone.bg} ${dark ? "text-cream" : "text-espresso"} scroll-mt-[128px] px-4 py-12 sm:px-5`}
    >
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <header className="mb-6">
            <p className={`text-[13px] font-semibold tracking-[0.2em] ${dark ? "text-caramel-light" : "text-roast"}`} dir="ltr">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </p>
            <h2 id={`h-${cat.id}`} className="mt-1 text-[1.65rem] font-bold leading-[1.5] sm:text-4xl">
              {cat.title}
            </h2>
            <p className={`text-[15px] ${dark ? "text-cream/70" : "text-roast"}`}>
              {cat.kicker} · {items.length} {items.length === 1 ? "صنف" : "أصناف"}
            </p>
          </header>
        </Reveal>

        {cat.layout === "pizza" && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((it, i) => (
              <Reveal key={it.id} delay={stagger(i)}>
                <PizzaCard item={it} cat={cat} onOpen={onOpen} />
              </Reveal>
            ))}
          </div>
        )}

        {cat.layout === "grid" && (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {items.map((it, i) => (
              <Reveal key={it.id} delay={stagger(i)} className="h-full">
                <GridCard item={it} cat={cat} onOpen={onOpen} onQuickAdd={onQuickAdd} />
              </Reveal>
            ))}
          </div>
        )}

        {cat.layout === "list" && (
          <div className="grid gap-2.5 md:grid-cols-2">
            {items.map((it, i) => (
              <Reveal key={it.id} delay={stagger(i)}>
                <ListRow item={it} cat={cat} onOpen={onOpen} onQuickAdd={onQuickAdd} thumb={cat.id === "manakish" ? 72 : 56} />
              </Reveal>
            ))}
          </div>
        )}

        {cat.layout === "feature" && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((it, i) => (
              <Reveal key={it.id} delay={stagger(i)}>
                <FeatureCard item={it} cat={cat} onOpen={onOpen} onQuickAdd={onQuickAdd} />
              </Reveal>
            ))}
          </div>
        )}

        {cat.layout === "hookah" && (
          <div className="overflow-hidden rounded-3xl ring-1 ring-cream/10">
            <div className="relative h-40 sm:h-56">
              <SmartImage id={cat.cover} alt="أجواء جلسة أرجيلة" w={800} className="h-full w-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#33201a] via-[#33201a]/40 to-transparent" />
            </div>
            <div className="px-4 pb-2">
              {items.map((it, i) => (
                <HookahRow key={it.id} item={it} index={i} cat={cat} onOpen={onOpen} onQuickAdd={onQuickAdd} />
              ))}
            </div>
          </div>
        )}

        {cat.layout === "addons" &&
          items.map((it) => (
            <Reveal key={it.id}>
              <button
                type="button"
                onClick={() => onOpen(it, cat)}
                className="press flex w-full items-center justify-between gap-4 rounded-3xl border border-dashed border-roast/40 bg-ivory p-5 text-start"
              >
                <span>
                  <span className="block font-display text-[19px] font-semibold">{it.name}</span>
                  {it.note && <span className="mt-1 block max-w-xs text-[14px] text-roast">{it.note}</span>}
                </span>
                <PriceOrPending item={it} className="text-[20px] text-tomato-deep" />
              </button>
            </Reveal>
          ))}
      </div>
    </section>
  );
}
