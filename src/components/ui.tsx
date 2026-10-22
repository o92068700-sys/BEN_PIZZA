import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowRight, ArrowUp, ChevronLeft, Search, X } from "lucide-react";
import { CURRENCY, PENDING_LABEL, VERIFY_LABEL, formatPrice, imgUrl, type PriceStatus } from "../data/menu";

type IconProps = { className?: string };
export const SearchIcon = ({ className }: IconProps) => <Search size={22} strokeWidth={1.8} aria-hidden className={className} />;
export const CloseIcon = ({ className }: IconProps) => <X size={22} strokeWidth={1.8} aria-hidden className={className} />;
export const ArrowDownIcon = ({ className }: IconProps) => <ArrowDown size={22} strokeWidth={1.8} aria-hidden className={className} />;
export const BackIcon = ({ className }: IconProps) => <ArrowRight size={22} strokeWidth={1.8} aria-hidden className={className} />;
export const ChevronLeftIcon = ({ className }: IconProps) => <ChevronLeft size={22} strokeWidth={2} aria-hidden className={className} />;
export const ArrowUpIcon = ({ className }: IconProps) => <ArrowUp size={20} strokeWidth={2} aria-hidden className={className} />;
const base = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};
export const InstagramIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" />
  </svg>
);
export const FacebookIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M14 8.5h2.5V5H14c-2.2 0-3.5 1.5-3.5 3.7V11H8v3.4h2.5V21H14v-6.6h2.4l.5-3.4H14V9.3c0-.5.3-.8 1-.8Z" />
  </svg>
);

export function BeanMark({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={className} aria-hidden>
      <circle cx="20" cy="20" r="18.5" fill="none" stroke="#B77845" strokeWidth="1.5" />
      <path d="M20 20 L20 1.5 A18.5 18.5 0 0 1 36.2 11 Z" fill="#D94B3D" opacity="0.92" />
      <g transform="rotate(-35 20 20)">
        <ellipse cx="20" cy="20" rx="8.2" ry="11.6" fill="#F7F0E5" />
        <path d="M20 8.6c-4 4.2 4 7.4 0 11.4s4 7.2 0 11.4" fill="none" stroke="#563526" strokeWidth="1.8" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5" aria-label="بن وبيتزا — BEN & PIZZA">
      <BeanMark size={compact ? 34 : 40} />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[19px] font-bold tracking-normal">بن وبيتزا</span>
        <span className="mt-1 text-[9px] font-semibold tracking-[0.32em] text-caramel-light" dir="ltr">
          BEN &amp; PIZZA
        </span>
      </span>
    </span>
  );
}

export function SmartImage({
  id,
  alt,
  w = 600,
  className = "",
  eager = false,
  sizes,
}: {
  id: string | null;
  alt: string;
  w?: number;
  className?: string;
  eager?: boolean;
  sizes?: string;
}) {
  const [state, setState] = useState<"loading" | "ok" | "failed">("loading");
  if (!id || state === "failed") {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`relative grid place-items-center overflow-hidden bg-gradient-to-br from-latte via-sand to-caramel/40 ${className}`}
      >
        <span aria-hidden className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_30%_20%,#fff8,transparent_55%)]" />
        <BeanMark size={44} className="relative opacity-60" />
      </div>
    );
  }
  const isDirect = id.startsWith("http://") || id.startsWith("https://") || id.startsWith("/") || id.startsWith("data:");
  const src = imgUrl(id, w);
  const srcSet = isDirect ? undefined : `${imgUrl(id, w)} 1x, ${imgUrl(id, w * 2)} 2x`;

  return (
    <span className={`relative block overflow-hidden bg-sand ${className}`}>
      {state === "loading" && <span aria-hidden className="skeleton absolute inset-0" />}
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setState("ok")}
        onError={() => setState("failed")}
        className={`zoom h-full w-full object-cover transition-opacity duration-500 ${state === "ok" ? "opacity-100" : "opacity-0"}`}
      />
    </span>
  );
}

export function Price({
  value,
  className = "",
  currencyClass = "",
}: {
  value: number;
  className?: string;
  currencyClass?: string;
}) {
  return (
    <span className={`inline-flex items-baseline gap-1 font-bold tabular-nums ${className}`}>
      <bdi dir="ltr">{formatPrice(value)}</bdi>
      <span className={`text-[0.72em] font-semibold ${currencyClass}`}>{CURRENCY}</span>
    </span>
  );
}

export function PendingLabel({
  status,
  dark = false,
  className = "",
}: {
  status: Exclude<PriceStatus, "priced">;
  dark?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-dashed px-2.5 py-0.5 text-[12.5px] font-medium ${
        dark ? "border-caramel-light/70 text-caramel-light" : "border-roast/50 text-roast"
      } ${className}`}
    >
      {status === "verify" ? VERIFY_LABEL : PENDING_LABEL}
    </span>
  );
}

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -6% 0px" }}
      transition={{ duration: 0.6, delay: delay / 1000, ease: [0.2, 0.7, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
