import { SOCIAL } from "../data/menu";
import { FacebookIcon, InstagramIcon, Logo } from "./ui";
import { Phone, Send, Bike, Sparkles } from "lucide-react";

export default function Footer() {
  const link =
    "press inline-flex h-11 items-center gap-2 rounded-full border border-cream/25 px-4 text-[14px] font-medium text-cream transition-colors hover:bg-cream/10";

  return (
    <footer className="bg-espresso px-5 pb-12 pt-12 text-cream" style={{ paddingBottom: "calc(4rem + env(safe-area-inset-bottom))" }}>
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm font-display text-lg leading-[1.6] text-caramel-light">
              كل رشفة إلها حكاية، وكل لقمة إلها مزاج. أهلاً بكم في مقهى بن وبيتزا.
            </p>

            <div className="mt-5 flex flex-wrap gap-2.5">
              <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className={link}>
                <InstagramIcon /> إنستغرام
              </a>
              <a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer" className={link}>
                <FacebookIcon /> فيسبوك
              </a>
            </div>
          </div>

          {/* Quick Contact & Free Delivery Card */}
          <div className="rounded-3xl border border-cream/15 bg-cream/5 p-5 backdrop-blur-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-[14px]">
              <Sparkles size={18} />
              <span>خدمة التوصيل مجانية لكافة المناطق!</span>
            </div>
            <p className="mt-1 text-[13px] text-cream/80">
              استمتع بوجباتك ومشروباتك المفضلة داخل المقهى أو اطلبها مباشرة إلى باب بيتك أو عملك مجاناً.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <a
                href="https://wa.me/962776208038"
                target="_blank"
                rel="noopener noreferrer"
                className="press flex-1 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 text-[15px] font-bold text-white shadow-md hover:bg-[#20ba5a]"
              >
                <Send size={18} className="rotate-180" />
                <span>واتساب: 0776208038</span>
              </a>

              <a
                href="tel:0776208038"
                className="press grid h-12 w-12 place-items-center rounded-full border border-cream/25 bg-cream/10 text-cream transition-colors hover:bg-cream/20"
                aria-label="اتصال هاتفي"
              >
                <Phone size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-cream/15 pt-5 text-[13px] leading-relaxed text-cream/65">
          <p>الصور المعروضة تعبيرية وقد تختلف عن المنتج الفعلي.</p>
          <p className="mt-1">© 2026 بن وبيتزا — BEN &amp; PIZZA. جميع الحقوق محفوظة.</p>
          <p className="mt-3 text-[12.5px] tracking-wide text-cream/45">تطوير عمر شديفات</p>
        </div>
      </div>
    </footer>
  );
}
