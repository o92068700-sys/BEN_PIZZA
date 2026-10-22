import { useEffect, useState } from "react";
import { SOCIAL } from "../data/menu";
import { FacebookIcon, InstagramIcon, Logo, SearchIcon } from "./ui";
import { ShoppingBag } from "lucide-react";

export default function Header({
  onMenu,
  onSearch,
  onOpenCart,
  cartCount = 0,
}: {
  onMenu: () => void;
  onSearch: () => void;
  onOpenCart: () => void;
  cartCount?: number;
}) {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const iconBtn =
    "grid h-11 w-11 place-items-center rounded-full text-cream transition-colors hover:bg-cream/10 press";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        solid ? "bg-espresso/95 shadow-[0_8px_24px_-14px_rgba(0,0,0,0.6)] backdrop-blur-sm" : "bg-transparent"
      }`}
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="mx-auto flex h-[60px] max-w-5xl items-center justify-between px-3 text-cream sm:px-5">
        <a href="#top" aria-label="بن وبيتزا — الصفحة الرئيسية" className="rounded-xl px-1">
          <Logo compact />
        </a>
        <div className="flex items-center gap-1">
          <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" aria-label="إنستغرام" className={`${iconBtn} hidden sm:grid`}>
            <InstagramIcon />
          </a>
          <a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer" aria-label="فيسبوك" className={`${iconBtn} hidden sm:grid`}>
            <FacebookIcon />
          </a>
          <button type="button" onClick={onSearch} aria-label="ابحث في المنيو" className={iconBtn}>
            <SearchIcon />
          </button>

          {/* Cart Icon */}
          <button
            type="button"
            onClick={onOpenCart}
            aria-label="سلة الطلبات"
            className={`${iconBtn} relative`}
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute top-1 start-1 grid h-4 min-w-[16px] place-items-center rounded-full bg-tomato px-1 text-[10px] font-bold text-white shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onMenu}
            className="press ms-1 h-11 rounded-full bg-caramel px-4 text-[14px] font-semibold text-espresso transition-colors hover:bg-caramel-light sm:px-5 sm:text-[15px]"
          >
            المنيو
          </button>
        </div>
      </div>
    </header>
  );
}
