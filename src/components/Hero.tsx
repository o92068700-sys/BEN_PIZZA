import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { IMAGES } from "../data/menu";
import { ArrowDownIcon, BeanMark, SmartImage } from "./ui";
import { Bike, Send } from "lucide-react";

const ease = [0.2, 0.7, 0.2, 1] as const;

export default function Hero({ onExplore }: { onExplore: () => void }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yBig = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 50]);
  const ySmall = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -30]);
  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease },
  });

  return (
    <section ref={ref} id="top" className="relative overflow-hidden bg-espresso text-cream">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-24 h-80 w-80 rounded-full bg-caramel/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-10 h-64 w-64 rounded-full bg-tomato/20 blur-3xl"
      />
      <BeanMark size={46} className="drift absolute left-6 top-28 opacity-25 [--r:-20deg]" />
      <BeanMark size={30} className="drift absolute right-8 bottom-[46%] opacity-20 [--r:30deg] md:hidden" />

      <div className="relative mx-auto grid max-w-5xl gap-6 px-5 pb-12 pt-[88px] md:grid-cols-2 md:items-center md:gap-10 md:pb-20 md:pt-[120px]">
        <div>
          <motion.div {...rise(0.08)} className="flex flex-wrap items-center gap-2">
            <span className="text-[13px] font-semibold tracking-[0.18em] text-caramel-light">
              قهوة · بيتزا · مشروبات · أراجيل
            </span>
          </motion.div>

          <h1 className="mt-3 text-[1.95rem] font-bold leading-[1.55] sm:text-5xl sm:leading-[1.5]">
            <motion.span {...rise(0.18)} className="block">
              كل رشفة إلها حكاية،
            </motion.span>
            <motion.span {...rise(0.32)} className="block text-caramel-light">
              وكل لقمة إلها مزاج
            </motion.span>
          </h1>

          <motion.p {...rise(0.44)} className="mt-3 text-[16px] text-cream/85 sm:text-[17px]">
            مقهى المطل — جلسات هادئة داخل المقهى وتوصيل سريع ومجاني لجميع طلباتكم
          </motion.p>

          {/* Creative Free Delivery Banner */}
          <motion.div {...rise(0.52)} className="mt-4 flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-400/40 px-3.5 py-1.5 text-[13px] font-bold text-emerald-300 backdrop-blur-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <Bike size={16} />
              <span>التوصيل مجاني 100% لكافة الطلبات!</span>
            </div>

            <a
              href="https://wa.me/962776208038"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/15 px-3 py-1.5 text-[12px] font-semibold text-cream/90 transition-colors"
            >
              واتساب: 0776208038
            </a>
          </motion.div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <motion.button
              {...rise(0.6)}
              whileHover={reduce ? undefined : { scale: 1.03 }}
              whileTap={reduce ? undefined : { scale: 0.97 }}
              type="button"
              onClick={onExplore}
              className="inline-flex h-[50px] items-center gap-2.5 rounded-full bg-tomato px-6 text-[16px] font-semibold text-ivory shadow-[0_12px_30px_-10px_rgba(217,75,61,0.8)] transition-colors hover:bg-tomato-deep"
            >
              استكشف المنيو
              <ArrowDownIcon className="cue-bob" />
            </motion.button>

            <motion.a
              {...rise(0.65)}
              whileHover={reduce ? undefined : { scale: 1.03 }}
              whileTap={reduce ? undefined : { scale: 0.97 }}
              href="https://wa.me/962776208038"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-[50px] items-center gap-2 rounded-full border border-cream/20 bg-cream/10 px-5 text-[15px] font-semibold text-cream transition-colors hover:bg-cream/15"
            >
              <Send size={16} className="rotate-180 text-emerald-400" />
              اطلب واتساب
            </motion.a>
          </div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.3, ease }}
          className="relative h-[300px] md:h-[460px]"
        >
          <motion.div style={{ y: yBig }} className="hero-sweep absolute bottom-0 right-0 top-0 w-[63%] overflow-hidden rounded-t-[999px] rounded-b-[28px] ring-1 ring-caramel/50">
            <SmartImage
              id={IMAGES.pizza}
              alt="بيتزا طازجة بالجبن والطماطم على لوح خشبي"
              w={700}
              eager
              sizes="(min-width: 768px) 340px, 60vw"
              className="hero-zoom h-full w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso/50 via-transparent to-transparent" />
          </motion.div>
          <motion.div style={{ y: ySmall }} className="absolute bottom-6 left-0 aspect-square w-[46%] overflow-hidden rounded-full border-[5px] border-espresso shadow-[0_20px_40px_-12px_rgba(0,0,0,0.7)] md:w-[44%]">
            <SmartImage
              id={IMAGES.heroLatte}
              alt="فنجان لاتيه برسمة حليب على صحن"
              w={500}
              eager
              sizes="(min-width: 768px) 200px, 40vw"
              className="hero-zoom h-full w-full"
            />
          </motion.div>
          <div aria-hidden className="absolute left-[8%] top-3 h-16 w-16 rounded-full border border-caramel/60" />
        </motion.div>
      </div>
    </section>
  );
}
