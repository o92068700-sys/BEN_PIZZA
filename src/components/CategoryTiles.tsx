import { CATEGORIES, TILES } from "../data/menu";
import { Reveal, SmartImage } from "./ui";

export default function CategoryTiles({ onSelect }: { onSelect: (id: string) => void }) {
  const count = (id: string) => CATEGORIES.find((c) => c.id === id)?.items.length ?? 0;
  const total = (id: string) => (id === "manakish" ? count("manakish") + count("shami") : count(id));
  return (
    <section aria-labelledby="shortcuts" className="bg-cream px-4 pb-6 pt-10 sm:px-5">
      <div className="mx-auto max-w-5xl">
        <div className="mb-5 flex items-end justify-between">
          <h2 id="shortcuts" className="text-[22px] font-bold">
            تصفّح بسرعة
          </h2>
          <span className="text-sm text-roast">اختر قسماً</span>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {TILES.map((t, i) => (
            <Reveal key={t.cat} delay={i * 70} className={t.wide ? "col-span-2" : ""}>
              <button
                type="button"
                onClick={() => onSelect(t.cat)}
                className={`press lift group relative block w-full overflow-hidden rounded-3xl text-start shadow-soft ${
                  t.wide ? "aspect-[2/1] md:aspect-[2/1]" : "aspect-[1/1.05]"
                }`}
              >
                <SmartImage id={t.img} alt={`قسم ${t.label}`} w={t.wide ? 700 : 420} className="zoom absolute inset-0 h-full w-full" />
                <span className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/15 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-4 text-ivory">
                  <span className="block font-display text-[18px] font-semibold leading-snug">{t.label}</span>
                  <span className="mt-0.5 block text-[13px] text-cream/80">{total(t.cat)} أصناف</span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
