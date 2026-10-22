import { motion, AnimatePresence } from "motion/react";
import { Price } from "./ui";
import { ShoppingBag, ArrowLeft } from "lucide-react";

export default function FloatingCartPill({
  count,
  total,
  onOpenCart,
}: {
  count: number;
  total: number;
  onOpenCart: () => void;
}) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className="fixed bottom-[74px] inset-x-4 z-40 mx-auto max-w-md md:bottom-6 md:end-6 md:start-auto md:w-auto"
        >
          <button
            type="button"
            onClick={onOpenCart}
            className="press flex h-[52px] w-full items-center justify-between gap-3 rounded-full bg-gradient-to-r from-tomato to-tomato-deep px-5 text-white shadow-[0_12px_28px_-6px_rgba(217,75,61,0.7)] ring-2 ring-white/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-white/20 text-white font-bold text-[14px]">
                {count}
              </span>
              <span className="font-display text-[15px] font-bold">عرض الطلب</span>
            </div>

            <div className="flex items-center gap-2">
              <Price value={total} className="text-[17px] font-extrabold text-white" currencyClass="text-cream/90" />
              <ArrowLeft size={18} />
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
