import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { NAV_LABELS } from "../data/menu";

export default function CategoryNav({
  ids,
  active,
  onSelect,
}: {
  ids: string[];
  active: string;
  onSelect: (id: string) => void;
}) {
  const reduce = useReducedMotion();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    document.getElementById(`pill-${active}`)?.scrollIntoView({ inline: "center", block: "nearest", behavior: reduce ? "auto" : "smooth" });
  }, [active, reduce]);

  return (
    <nav
      aria-label="أقسام المنيو"
      className="sticky top-[60px] z-30 border-y border-roast/10 bg-cream/95 backdrop-blur-sm"
      style={{ top: "calc(60px + env(safe-area-inset-top))" }}
    >
      <div className="no-scrollbar mx-auto flex max-w-5xl gap-2 overflow-x-auto px-4 py-2 sm:px-5">
        {ids.map((id) => {
          const on = id === active;
          return (
            <button
              key={id}
              id={`pill-${id}`}
              type="button"
              onClick={() => onSelect(id)}
              aria-current={on ? "true" : undefined}
              className={`press relative h-11 shrink-0 whitespace-nowrap rounded-full px-4 text-[15px] font-semibold transition-colors duration-200 ${
                on ? "text-cream" : "bg-latte/70 text-roast hover:bg-latte"
              }`}
            >
              {on && (
                <motion.span
                  layoutId="nav-pill"
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-espresso"
                  transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative">{NAV_LABELS[id]}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
