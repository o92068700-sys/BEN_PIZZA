import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CATEGORIES, ITEM_INDEX, searchMenu, type Category, type MenuItem, type SearchHit } from "./data/menu";
import CategoryNav from "./components/CategoryNav";
import CategoryTiles from "./components/CategoryTiles";
import StoryHighlights from "./components/StoryHighlights";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import MenuSection from "./components/MenuSection";
import ProductSheet from "./components/ProductSheet";
import SearchResults from "./components/SearchResults";
import CartDrawer, { type CartItem } from "./components/CartDrawer";
import FloatingCartPill from "./components/FloatingCartPill";
import MobileBottomNav from "./components/MobileBottomNav";
import { ArrowUpIcon, CloseIcon, SearchIcon } from "./components/ui";

const HEADER_OFFSET = 128;

const SEARCH_QUICK_CHIPS = [
  { label: "الكل", q: "" },
  { label: "☕ ساخن", q: "قهوة" },
  { label: "🧊 بارد", q: "أيس" },
  { label: "🍕 بيتزا", q: "بيتزا" },
  { label: "🥐 معجنات", q: "جبنة" },
  { label: "🍓 عصائر", q: "عصير" },
  { label: "🥤 شيك", q: "شيك" },
  { label: "💨 أراجيل", q: "تفاحتين" },
];

export default function App() {
  const reduce = useReducedMotion();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(CATEGORIES[0].id);
  const [open, setOpen] = useState<{ item: MenuItem; cat: Category } | null>(null);
  const [showTop, setShowTop] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeNavTab, setActiveNavTab] = useState<"home" | "menu" | "search">("home");

  const lockRef = useRef<string | null>(null);
  const lockTimer = useRef(0);
  const savedY = useRef<number | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const searching = query.trim().length > 0;
  const hits = useMemo(() => searchMenu(query), [query]);

  const totalCartCount = useMemo(() => cartItems.reduce((acc, it) => acc + it.count, 0), [cartItems]);
  const totalCartPrice = useMemo(() => cartItems.reduce((acc, it) => acc + it.price * it.count, 0), [cartItems]);

  useEffect(() => {
    document.documentElement.lang = "ar";
    document.documentElement.dir = "rtl";
    document.title = "بن وبيتزا — BEN & PIZZA | المنيو الرسمي";
  }, []);

  const behavior = reduce ? "auto" : "smooth";
  const scrollToEl = (id: string, offset = 0) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: Math.max(0, y), behavior });
  };

  const unlock = useCallback(() => {
    lockRef.current = null;
    window.clearTimeout(lockTimer.current);
  }, []);

  const goToCategory = useCallback(
    (id: string) => {
      setActive(id);
      setActiveNavTab("menu");
      lockRef.current = id;
      window.clearTimeout(lockTimer.current);
      lockTimer.current = window.setTimeout(unlock, 1400);
      const el = document.getElementById(`cat-${id}`);
      if (el) window.scrollTo({ top: Math.max(0, el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET + 1), behavior });
    },
    [behavior, unlock],
  );

  useEffect(() => {
    const release = () => unlock();
    window.addEventListener("scrollend", release);
    window.addEventListener("wheel", release, { passive: true });
    window.addEventListener("touchstart", release, { passive: true });
    return () => {
      window.removeEventListener("scrollend", release);
      window.removeEventListener("wheel", release);
      window.removeEventListener("touchstart", release);
    };
  }, [unlock]);

  const resetSearch = useCallback(() => {
    setQuery("");
  }, []);

  const selectFromTile = (id: string) => {
    if (searching) {
      resetSearch();
      requestAnimationFrame(() => requestAnimationFrame(() => goToCategory(id)));
    } else goToCategory(id);
  };

  useEffect(() => {
    if (searching) return;
    const els = CATEGORIES.map((c) => document.getElementById(`cat-${c.id}`)).filter(Boolean) as HTMLElement[];
    const visible = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = e.target.id.replace("cat-", "");
          if (e.isIntersecting) visible.set(id, e.boundingClientRect.top);
          else visible.delete(id);
        }
        if (lockRef.current) return;
        let cur: string | undefined;
        let best = Infinity;
        for (const [id, top] of visible) {
          if (top < best) {
            best = top;
            cur = id;
          }
        }
        if (cur) setActive(cur);
      },
      { rootMargin: `-${HEADER_OFFSET + 8}px 0px -55% 0px`, threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [searching]);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setShowTop(window.scrollY > 600);
        if (window.scrollY < 300) {
          setActiveNavTab("home");
        } else if (searching) {
          setActiveNavTab("search");
        } else {
          setActiveNavTab("menu");
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [searching]);

  const openItem = useCallback((item: MenuItem, cat: Category) => {
    savedY.current = window.scrollY;
    (document.activeElement as HTMLElement | null)?.blur?.();
    window.history.pushState({ sheet: item.id }, "");
    setOpen({ item, cat });
  }, []);

  const openHit = (h: SearchHit) => openItem(h.item, h.cat);

  const closeItem = useCallback(() => {
    if (window.history.state?.sheet) window.history.back();
    else setOpen(null);
  }, []);

  useEffect(() => {
    const onPop = () => {
      const id = window.history.state?.sheet as string | undefined;
      const found = id ? ITEM_INDEX.get(id) : undefined;
      if (found) return setOpen(found);
      setOpen(null);
      const y = savedY.current;
      if (y !== null) {
        requestAnimationFrame(() => {
          if (Math.abs(window.scrollY - y) > 2) window.scrollTo({ top: y, behavior: "auto" });
        });
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const focusSearch = () => {
    setActiveNavTab("search");
    scrollToEl("menu", 60);
    window.setTimeout(() => searchRef.current?.focus({ preventScroll: true }), reduce ? 0 : 400);
  };

  // Cart operations
  const handleAddToCart = (
    item: MenuItem,
    price: number,
    sizeLabel?: string,
    flavor?: string,
    count: number = 1,
  ) => {
    const key = `${item.id}-${sizeLabel || "standard"}-${flavor || "standard"}`;
    setCartItems((prev) => {
      const existing = prev.find((x) => x.id === key);
      if (existing) {
        return prev.map((x) => (x.id === key ? { ...x, count: x.count + count } : x));
      }
      return [
        ...prev,
        {
          id: key,
          productId: item.id,
          name: item.name,
          price,
          sizeLabel,
          flavor,
          count,
          img: item.img,
          alt: item.alt,
        },
      ];
    });
  };

  const handleQuickAdd = (item: MenuItem, cat: Category) => {
    if (item.sizes && item.sizes.length > 0) {
      openItem(item, cat);
    } else if (item.price !== undefined) {
      handleAddToCart(item, item.price, undefined, undefined, 1);
    } else {
      openItem(item, cat);
    }
  };

  const handleUpdateCount = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((x) => {
          if (x.id === id) {
            const newCount = x.count + delta;
            return newCount > 0 ? { ...x, count: newCount } : null;
          }
          return x;
        })
        .filter(Boolean) as CartItem[],
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((x) => x.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  return (
    <div dir="rtl" lang="ar" className="min-h-screen overflow-x-clip bg-cream font-body text-espresso">
      {/* Top Header */}
      <Header
        onMenu={() => scrollToEl("menu", 60)}
        onSearch={focusSearch}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={totalCartCount}
      />

      <main className="pb-20 md:pb-8">
        {/* Hero Section */}
        <Hero onExplore={() => scrollToEl("menu", 60)} />

        {/* Stories / Highlights Banner */}
        <StoryHighlights onSelectStory={goToCategory} />

        {/* Quick Category Shortcut Tiles */}
        <CategoryTiles onSelect={selectFromTile} />

        {/* Main Menu Search and Content */}
        <section id="menu" aria-labelledby="menu-title" className="bg-cream px-4 pb-5 pt-8 sm:px-5">
          <div className="mx-auto max-w-5xl">
            <h2 id="menu-title" className="text-[1.65rem] font-bold sm:text-4xl">
              المنيو الكامل
            </h2>

            {/* Search Input Bar */}
            <form
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                searchRef.current?.blur();
              }}
              className="relative mt-4"
            >
              <label htmlFor="search" className="sr-only">
                ابحث في المنيو
              </label>
              <SearchIcon className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-roast" />
              <input
                ref={searchRef}
                id="search"
                type="search"
                inputMode="search"
                enterKeyHint="search"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Escape" && resetSearch()}
                placeholder="ابحث في المنيو: قهوة، بيتزا، عصير، أرجيلة..."
                className="h-[52px] w-full rounded-full border border-roast/20 bg-ivory ps-12 pe-12 text-[16px] text-espresso shadow-soft placeholder:text-roast/60 focus:border-roast focus:outline-none focus-visible:ring-4 focus-visible:ring-caramel/30 [&::-webkit-search-cancel-button]:hidden"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    resetSearch();
                    searchRef.current?.focus();
                  }}
                  aria-label="مسح البحث"
                  className="absolute end-1.5 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full text-roast hover:bg-latte"
                >
                  <CloseIcon />
                </button>
              )}
            </form>

            {/* Quick Search Filter Chips */}
            <div className="no-scrollbar mt-3 flex items-center gap-2 overflow-x-auto pb-1">
              {SEARCH_QUICK_CHIPS.map((chip) => {
                const activeChip = query.trim() === chip.q && chip.q !== "";
                return (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => {
                      setQuery(chip.q);
                      if (chip.q) {
                        searchRef.current?.focus();
                      } else {
                        resetSearch();
                      }
                    }}
                    className={`press shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-all ${
                      activeChip
                        ? "bg-tomato text-white shadow-xs"
                        : "bg-ivory text-roast border border-roast/15 hover:bg-latte"
                    }`}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>

            {/* Search Results */}
            <AnimatePresence initial={false}>
              {searching && <SearchResults key="results" query={query} hits={hits} onOpen={openHit} onReset={resetSearch} />}
            </AnimatePresence>
          </div>
        </section>

        {/* Categories Sections */}
        {!searching && (
          <>
            <CategoryNav ids={CATEGORIES.map((c) => c.id)} active={active} onSelect={goToCategory} />
            {CATEGORIES.map((cat, i) => (
              <MenuSection
                key={cat.id}
                cat={cat}
                items={cat.items}
                index={i}
                total={CATEGORIES.length}
                onOpen={openItem}
                onQuickAdd={handleQuickAdd}
              />
            ))}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Quick Cart Pill */}
      <FloatingCartPill
        count={totalCartCount}
        total={totalCartPrice}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeNavTab}
        cartCount={totalCartCount}
        onGoHome={() => window.scrollTo({ top: 0, behavior })}
        onGoMenu={() => scrollToEl("menu", 60)}
        onOpenSearch={focusSearch}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Back to Top Floating Button */}
      <AnimatePresence>
        {showTop && !open && !isCartOpen && (
          <motion.button
            key="top"
            type="button"
            aria-label="العودة للأعلى"
            onClick={() => window.scrollTo({ top: 0, behavior })}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.9 }}
            whileTap={reduce ? undefined : { scale: 0.93 }}
            className="fixed bottom-20 start-4 z-40 inline-flex h-11 items-center gap-2 rounded-full bg-espresso/90 px-3.5 text-[13px] font-semibold text-cream shadow-lift ring-1 ring-cream/15 backdrop-blur-xs md:bottom-5 md:h-12 md:px-4 md:text-[14px]"
            style={{ marginBottom: "env(safe-area-inset-bottom)" }}
          >
            <ArrowUpIcon />
            <span className="hidden sm:inline">العودة للأعلى</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Product Details Sheet */}
      <AnimatePresence>
        {open && (
          <ProductSheet
            key={open.item.id}
            item={open.item}
            category={open.cat}
            onClose={closeItem}
            onAddToCart={handleAddToCart}
          />
        )}
      </AnimatePresence>

      {/* WhatsApp Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateCount={handleUpdateCount}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />
    </div>
  );
}
