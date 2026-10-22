import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Price, SmartImage, CloseIcon } from "./ui";
import { fireConfetti } from "../utils/confetti";
import {
  Minus,
  Plus,
  Trash2,
  Send,
  ShoppingBag,
  Coffee,
  Bike,
  User,
  MapPin,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export interface CartItem {
  id: string; // unique key (item.id + size + flavor)
  productId: string;
  name: string;
  price: number;
  sizeLabel?: string;
  flavor?: string;
  count: number;
  img: string | null;
  alt: string;
}

const WHATSAPP_PHONE = "962776208038";
const DISPLAY_PHONE = "0776208038";

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateCount,
  onRemoveItem,
  onClearCart,
}: {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateCount: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}) {
  const reduce = useReducedMotion();
  const [orderType, setOrderType] = useState<"dine-in" | "delivery">("dine-in");
  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [showErrors, setShowErrors] = useState(false);

  const total = items.reduce((sum, item) => sum + item.price * item.count, 0);
  const totalCount = items.reduce((sum, item) => sum + item.count, 0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setShowErrors(false);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const isValid = () => {
    if (!customerName.trim()) return false;
    if (orderType === "delivery" && !address.trim()) return false;
    return true;
  };

  const sendWhatsApp = () => {
    if (items.length === 0) return;

    if (!isValid()) {
      setShowErrors(true);
      return;
    }

    fireConfetti();

    let text = "🌟 *طلب جديد من بن وبيتزا (BEN & PIZZA)* 🌟\n";
    text += "━━━━━━━━━━━━━━━━━━━━\n";

    if (orderType === "dine-in") {
      text += "☕ *نوع الطلب:* داخل المقهى (صالة)\n";
      text += `👤 *الاسم:* ${customerName.trim()}\n`;
      if (tableNumber.trim()) {
        text += `🪑 *رقم الطاولة:* ${tableNumber.trim()}\n`;
      }
    } else {
      text += "🛵 *نوع الطلب:* خارج المقهى (توصيل)\n";
      text += `👤 *الاسم:* ${customerName.trim()}\n`;
      text += `📍 *عنوان التوصيل:* ${address.trim()}\n`;
      text += "🎁 *رسوم التوصيل:* مجاناً 100% (توصيل مجاني)\n";
    }

    text += "━━━━━━━━━━━━━━━━━━━━\n";
    text += "📋 *تفاصيل الطلب:*\n";

    items.forEach((item, idx) => {
      text += `${idx + 1}. *${item.name}*`;
      if (item.sizeLabel) text += ` (${item.sizeLabel})`;
      if (item.flavor) text += ` - [${item.flavor}]`;
      text += `\n   الكمية: ${item.count} × ${item.price.toFixed(2)} د.أ = ${(item.price * item.count).toFixed(2)} د.أ\n`;
    });

    text += "━━━━━━━━━━━━━━━━━━━━\n";
    text += `💰 *المجموع الكلي:* ${total.toFixed(2)} د.أ\n`;

    if (orderType === "delivery") {
      text += "🚚 *التوصيل:* مجاني ✨\n";
    }

    if (notes.trim()) {
      text += `📝 *ملاحظات إضافية:* ${notes.trim()}\n`;
    }

    text += "━━━━━━━━━━━━━━━━━━━━\n";
    text += "شكراً لكم! ننتظر تأكيدكم 🤍";

    const encoded = encodeURIComponent(text);
    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`;
    window.open(url, "_blank");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-espresso/80 backdrop-blur-sm"
          />

          {/* Drawer Sheet */}
          <motion.div
            initial={reduce ? { opacity: 0 } : { y: "100%" }}
            animate={reduce ? { opacity: 1 } : { y: 0 }}
            exit={reduce ? { opacity: 0 } : { y: "100%" }}
            transition={reduce ? { duration: 0.2 } : { type: "spring", damping: 30, stiffness: 320 }}
            className="relative flex max-h-[92vh] w-full max-w-lg flex-col rounded-t-[32px] bg-cream text-espresso shadow-2xl md:rounded-[32px]"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-roast/10 px-5 pb-3 pt-3">
              <div className="flex items-center gap-2.5">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-caramel/20 text-caramel">
                  <ShoppingBag size={20} />
                </span>
                <div>
                  <h3 className="font-display text-[18px] font-bold">سلة الطلبات</h3>
                  <p className="text-[13px] text-roast">{totalCount} أصناف مختارة</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button
                    type="button"
                    onClick={onClearCart}
                    className="rounded-full px-2.5 py-1 text-[13px] font-medium text-tomato hover:bg-tomato/10"
                  >
                    تفريغ
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="إغلاق السلة"
                  className="grid h-9 w-9 place-items-center rounded-full bg-latte text-espresso transition-transform hover:scale-105 active:scale-95"
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content Scrollable */}
            <div className="no-scrollbar flex-1 overflow-y-auto p-4 sm:p-5">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-roast">
                  <div className="grid h-20 w-20 place-items-center rounded-full bg-latte/60 text-caramel">
                    <ShoppingBag size={36} strokeWidth={1.5} />
                  </div>
                  <p className="mt-4 font-display text-[17px] font-semibold text-espresso">سلتك فارغة حالياً</p>
                  <p className="mt-1 text-[14px]">اختر مشروباتك ووجباتك المفضلة من المنيو بالضغط على (+)</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Order Type Selector (Dine-in vs Delivery) */}
                  <div className="rounded-2xl bg-ivory p-3 shadow-soft">
                    <label className="mb-2 block font-display text-[14px] font-bold text-espresso">
                      أين ترغب باستلام طلبك؟
                    </label>
                    <div className="grid grid-cols-2 gap-2 rounded-xl bg-latte/60 p-1.5">
                      {/* Inside Cafe Option */}
                      <button
                        type="button"
                        onClick={() => {
                          setOrderType("dine-in");
                          setShowErrors(false);
                        }}
                        className={`relative flex items-center justify-center gap-2 rounded-lg py-2.5 px-3 text-[14px] font-bold transition-all duration-200 ${
                          orderType === "dine-in"
                            ? "bg-espresso text-cream shadow-sm"
                            : "text-roast hover:text-espresso"
                        }`}
                      >
                        <Coffee size={17} />
                        <span>داخل المقهى</span>
                      </button>

                      {/* Outside Cafe (Free Delivery) */}
                      <button
                        type="button"
                        onClick={() => {
                          setOrderType("delivery");
                          setShowErrors(false);
                        }}
                        className={`relative flex items-center justify-center gap-2 rounded-lg py-2.5 px-3 text-[14px] font-bold transition-all duration-200 ${
                          orderType === "delivery"
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "text-roast hover:text-espresso"
                        }`}
                      >
                        <Bike size={17} />
                        <span>خارج المقهى</span>
                      </button>
                    </div>

                    {/* Free Delivery Animated Badge Banner */}
                    <AnimatePresence mode="wait">
                      {orderType === "delivery" ? (
                        <motion.div
                          key="free-delivery"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2.5 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-emerald-800 border border-emerald-200/80"
                        >
                          <Sparkles size={16} className="shrink-0 text-emerald-600" />
                          <span className="text-[13px] font-bold">
                            خدمة التوصيل مجانية 100% لجميع المناطق! 🚚
                          </span>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="dine-in-badge"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2.5 flex items-center gap-2 rounded-xl bg-latte/50 px-3 py-1.5 text-roast"
                        >
                          <CheckCircle2 size={15} className="text-caramel shrink-0" />
                          <span className="text-[12px] font-medium">
                            أهلاً بك في جلسات مقهى بن وبيتزا المطلة والمريحة!
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Customer Information Inputs */}
                  <motion.div layout className="space-y-3 rounded-2xl bg-ivory p-4 shadow-soft">
                    <h4 className="font-display text-[14px] font-bold text-espresso">معلومات صاحب الطلب</h4>

                    {/* Name Input (Required for both) */}
                    <div>
                      <div className="relative">
                        <User size={18} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-roast/60 pointer-events-none" />
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="الاسم الكريم *"
                          className={`h-11 w-full rounded-xl border ps-10 pe-3 text-[14px] text-espresso shadow-xs focus:outline-none ${
                            showErrors && !customerName.trim()
                              ? "border-tomato bg-tomato/5 focus:border-tomato"
                              : "border-roast/20 bg-cream/30 focus:border-caramel"
                          }`}
                        />
                      </div>
                      {showErrors && !customerName.trim() && (
                        <span className="mt-1 block text-[11px] font-semibold text-tomato">
                          يرجى إدخال الاسم لتأكيد الطلب
                        </span>
                      )}
                    </div>

                    {/* Inside Cafe: Optional Table Number */}
                    {orderType === "dine-in" && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                      >
                        <div className="relative">
                          <Coffee size={18} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-roast/60 pointer-events-none" />
                          <input
                            type="text"
                            value={tableNumber}
                            onChange={(e) => setTableNumber(e.target.value)}
                            placeholder="رقم الطاولة (اختياري)"
                            className="h-11 w-full rounded-xl border border-roast/20 bg-cream/30 ps-10 pe-3 text-[14px] text-espresso shadow-xs focus:border-caramel focus:outline-none"
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Outside Cafe: Address Input (Required for delivery) */}
                    {orderType === "delivery" && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                      >
                        <div className="relative">
                          <MapPin size={18} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-roast/60 pointer-events-none" />
                          <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="العنوان بالتفصيل (المنطقة، الشارع، معلم بارز) *"
                            className={`h-11 w-full rounded-xl border ps-10 pe-3 text-[14px] text-espresso shadow-xs focus:outline-none ${
                              showErrors && !address.trim()
                                ? "border-tomato bg-tomato/5 focus:border-tomato"
                                : "border-roast/20 bg-cream/30 focus:border-caramel"
                            }`}
                          />
                        </div>
                        {showErrors && !address.trim() && (
                          <span className="mt-1 block text-[11px] font-semibold text-tomato">
                            يرجى كتابة عنوان التوصيل بالتفصيل
                          </span>
                        )}
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Selected Items List */}
                  <div className="space-y-2.5">
                    <h4 className="font-display text-[14px] font-bold text-espresso">الأصناف ({items.length})</h4>
                    {items.map((item) => (
                      <motion.div
                        layout
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex items-center gap-3 rounded-2xl bg-ivory p-2.5 shadow-soft"
                      >
                        <SmartImage
                          id={item.img}
                          alt={item.alt}
                          w={90}
                          className="h-13 w-13 shrink-0 rounded-xl object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate font-display text-[14px] font-bold">{item.name}</h4>
                          <div className="flex flex-wrap items-center gap-1.5 text-[12px] text-roast">
                            {item.sizeLabel && (
                              <span className="rounded-md bg-latte px-1.5 py-0.2 font-medium">{item.sizeLabel}</span>
                            )}
                            {item.flavor && (
                              <span className="rounded-md bg-latte px-1.5 py-0.2 text-caramel-light font-medium">
                                {item.flavor}
                              </span>
                            )}
                          </div>
                          <div className="mt-0.5">
                            <Price value={item.price * item.count} className="text-[14px] text-tomato-deep font-bold" />
                          </div>
                        </div>

                        {/* Stepper */}
                        <div className="flex items-center gap-1 rounded-full bg-latte/80 p-1">
                          <button
                            type="button"
                            onClick={() => onUpdateCount(item.id, -1)}
                            className="grid h-7 w-7 place-items-center rounded-full bg-ivory text-espresso shadow-xs transition-transform active:scale-90"
                            aria-label="تقليل"
                          >
                            {item.count === 1 ? <Trash2 size={13} className="text-tomato" /> : <Minus size={13} />}
                          </button>
                          <span className="w-5 text-center font-display text-[13px] font-bold tabular-nums">
                            {item.count}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateCount(item.id, 1)}
                            className="grid h-7 w-7 place-items-center rounded-full bg-espresso text-cream shadow-xs transition-transform active:scale-90"
                            aria-label="زيادة"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Notes Area */}
                  <div className="pt-1">
                    <label htmlFor="order-notes" className="mb-1 block text-[13px] font-semibold text-roast">
                      ملاحظات خاصة على الطلب (اختياري):
                    </label>
                    <textarea
                      id="order-notes"
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="مثال: بدون سكر، تسخين إضافي، مع شطة..."
                      className="w-full resize-none rounded-xl border border-roast/20 bg-ivory p-2.5 text-[14px] text-espresso shadow-inner placeholder:text-roast/50 focus:border-caramel focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer with WhatsApp Send Button */}
            {items.length > 0 && (
              <div
                className="shrink-0 border-t border-roast/10 bg-ivory px-5 py-4"
                style={{ paddingBottom: "calc(1.2rem + env(safe-area-inset-bottom))" }}
              >
                <div className="mb-2 flex items-baseline justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-semibold text-roast">المجموع النهائي:</span>
                    {orderType === "delivery" && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                        التوصيل مجاناً
                      </span>
                    )}
                  </div>
                  <Price value={total} className="text-[24px] font-extrabold text-tomato-deep" />
                </div>

                <button
                  type="button"
                  onClick={sendWhatsApp}
                  className="press flex h-[54px] w-full items-center justify-center gap-3 rounded-full bg-[#25D366] text-[17px] font-bold text-white shadow-[0_12px_28px_-8px_rgba(37,211,102,0.6)] transition-all hover:bg-[#20ba5a] active:scale-98"
                >
                  <Send size={20} className="rotate-180" />
                  <span>إرسال الطلب عبر الواتساب ({DISPLAY_PHONE})</span>
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
