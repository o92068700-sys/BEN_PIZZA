import { motion } from "motion/react";
import { Home, UtensilsCrossed, Search, ShoppingBag } from "lucide-react";

export default function MobileBottomNav({
  activeTab,
  cartCount,
  onGoHome,
  onGoMenu,
  onOpenSearch,
  onOpenCart,
}: {
  activeTab: string;
  cartCount: number;
  onGoHome: () => void;
  onGoMenu: () => void;
  onOpenSearch: () => void;
  onOpenCart: () => void;
}) {
  return (
    <nav
      aria-label="التنقل السريع للهواتف"
      className="fixed inset-x-0 bottom-0 z-40 block border-t border-cream/10 bg-espresso/95 px-3 py-2 text-cream backdrop-blur-md md:hidden"
      style={{ paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-md items-center justify-around">
        {/* Home */}
        <button
          type="button"
          onClick={onGoHome}
          className={`flex flex-col items-center gap-1 py-1 px-3 text-[12px] font-semibold transition-colors ${
            activeTab === "home" ? "text-caramel-light" : "text-cream/70 hover:text-cream"
          }`}
        >
          <Home size={20} strokeWidth={activeTab === "home" ? 2.2 : 1.8} />
          <span>الرئيسية</span>
        </button>

        {/* Menu */}
        <button
          type="button"
          onClick={onGoMenu}
          className={`flex flex-col items-center gap-1 py-1 px-3 text-[12px] font-semibold transition-colors ${
            activeTab === "menu" ? "text-caramel-light" : "text-cream/70 hover:text-cream"
          }`}
        >
          <UtensilsCrossed size={20} strokeWidth={activeTab === "menu" ? 2.2 : 1.8} />
          <span>المنيو</span>
        </button>

        {/* Search */}
        <button
          type="button"
          onClick={onOpenSearch}
          className={`flex flex-col items-center gap-1 py-1 px-3 text-[12px] font-semibold transition-colors ${
            activeTab === "search" ? "text-caramel-light" : "text-cream/70 hover:text-cream"
          }`}
        >
          <Search size={20} strokeWidth={activeTab === "search" ? 2.2 : 1.8} />
          <span>بحث</span>
        </button>

        {/* Cart / Order */}
        <button
          type="button"
          onClick={onOpenCart}
          className="relative flex flex-col items-center gap-1 py-1 px-3 text-[12px] font-semibold text-cream/70 hover:text-cream"
        >
          <div className="relative">
            <ShoppingBag size={20} strokeWidth={1.8} />
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1.5 -start-2 grid h-4 min-w-[16px] place-items-center rounded-full bg-tomato px-1 text-[10px] font-bold text-white shadow-sm"
              >
                {cartCount}
              </motion.span>
            )}
          </div>
          <span>طلبياتي</span>
        </button>
      </div>
    </nav>
  );
}
