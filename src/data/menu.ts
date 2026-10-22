import { COVER, PRODUCT_IMAGES, type MatchLevel } from "./imageManifest";

export type PriceStatus = "priced" | "pending" | "verify";
export type Layout = "pizza" | "list" | "grid" | "hookah" | "feature" | "addons";

export interface SizePrice {
  label: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  desc?: string;
  note?: string;
  price?: number;
  sizes?: SizePrice[];
  flavors?: string[];
  status: PriceStatus;
  img: string | null;
  alt: string;
}

export interface Category {
  id: string;
  title: string;
  kicker: string;
  layout: Layout;
  cover: string;
  items: MenuItem[];
}

export const PENDING_LABEL = "السعر يُحدّد لاحقاً";
export const VERIFY_LABEL = "السعر قيد التأكيد";
export const CURRENCY = "د.أ";

export const formatPrice = (n: number) => n.toFixed(2);

export const SOCIAL = {
  instagram: "https://www.instagram.com/coffee_and_pizza13/?vrfl=d2Y3aHo2aW01M3Jy",
  facebook: "https://www.facebook.com/profile.php?id=61595208584988",
};

export const imgUrl = (id: string, w = 800) => {
  if (id.startsWith("http://") || id.startsWith("https://") || id.startsWith("/") || id.startsWith("data:")) {
    return id;
  }
  return `https://images.unsplash.com/photo-${id}?w=${w}&q=70&auto=format&fit=crop`;
};

export const IMAGES = COVER;

type Base = Omit<MenuItem, "img" | "alt">;

const priced = (id: string, name: string, price: number, extra: Partial<Base> = {}): Base => ({
  id,
  name,
  price,
  status: "priced",
  ...extra,
});

const pending = (id: string, name: string, extra: Partial<Base> = {}): Base => ({
  id,
  name,
  status: "pending",
  ...extra,
});

const SIZE_LABELS = ["صغير", "وسط", "كبير"];
const pizza = (id: string, name: string, p: [number, number, number]): Base => ({
  id,
  name,
  status: "priced",
  sizes: SIZE_LABELS.map((label, i) => ({ label, price: p[i] })),
});

const withImage = (b: Base): MenuItem => {
  const m = PRODUCT_IMAGES[b.id];
  const isPizza = b.id.startsWith("pizza-");
  return {
    ...b,
    img: m?.photo ?? null,
    alt: m?.photo ? m.alt : isPizza ? `بيتزا ${b.name}` : b.name,
  };
};

const pizzaItems = (
  [
    pizza("pizza-1", "خضار", [1.75, 3.25, 5.25]),
    pizza("pizza-2", "سلامي", [1.75, 3.25, 5.25]),
    pizza("pizza-3", "مارغريتا", [1.75, 3.25, 5.25]),
    pizza("pizza-4", "هوت دوج", [1.75, 3.25, 5.25]),
    pizza("pizza-5", "لحمة", [1.75, 3.25, 5.25]),
    pizza("pizza-6", "الفصول الأربعة", [2.25, 3.25, 5.25]),
    pizza("pizza-7", "بن و بيتزا", [2.25, 3.5, 5.75]),
    pizza("pizza-8", "فاهينا", [2.75, 3.75, 5.75]),
    pizza("pizza-9", "زنجر", [2.75, 3.75, 5.75]),
  ] as Base[]
).map(withImage);

const manakish = (
  [
    priced("man-1", "زعتر", 0.5),
    priced("man-2", "جبنة + زعتر", 1.0),
    priced("man-3", "جبنة بيضاء مكس", 1.0),
    priced("man-4", "عرايس لحمة", 1.0),
    priced("man-5", "بيض", 0.5),
    priced("man-6", "محمرة", 0.75),
    priced("man-7", "تبريكي مع جبنة", 1.0),
    priced("man-8", "محمرة مع جبنة", 1.0),
  ] as Base[]
).map(withImage);

const shamiNames = [
  "جبنة بيضاء",
  "جبنة صفراء",
  "جبنة بالزعتر",
  "جبنة كيري",
  "سجق",
  "بطاطا",
  "صفيحة شامية",
  "هوت دوج",
  "بيتزا صغير",
  "رولات مسخن",
  "سئيورة مع جبنة",
  "جبنة بيضاء مع زيتون",
  "جبنة مع بقدونس",
  "جبنة ملفتات",
];
const shami = shamiNames.map((n, i) => withImage(priced(`sham-${i + 1}`, n, 0.3)));

const hot = (
  [
    // Core hot drinks from user's new menu
    priced("hot-2", "قهوة", 1.0, { desc: "قهوة تركية محضرة على الأصول" }),
    priced("hot-cappuccino", "كابتشينو", 1.0, { desc: "إسبرسو غني برغوة الحليب الكثيفة" }),
    priced("hot-6", "شاي كرك", 1.0, { desc: "شاي متبل بالحليب والهيل والزعفران" }),
    priced("hot-7", "هوت شوكلت", 1.0, { desc: "شوكولاتة ساخنة غنية وكريمية" }),
    priced("hot-nescafe", "نسكافيه", 1.0, { desc: "نسكافيه دافئ ومخفوق بعناية" }),
    priced("hot-1", "إسبرسو", 1.0, { desc: "جرعة إسبرسو نقية ومركزة" }),
    priced("hot-sahlab", "سحلب", 1.0, { desc: "سحلب ساخن بالقرفة والمكسرات" }),
    priced("hot-ginger-milk", "زنجبيل مع حليب", 1.0, { desc: "مزيج الزنجبيل الحار والحليب الدافئ" }),
    priced("hot-tea", "شاي", 1.0, { desc: "شاي أحمر كلاسيكي ممتاز" }),
    priced("hot-tea-milk", "شاي مع حليب", 1.0, { desc: "شاي دافئ مع حليب ناعم" }),
    priced("hot-herbs", "أعشاب", 1.0, { desc: "تشكيلة أعشاب طبيعية دافئة ومريحة" }),

    // Specialty coffees
    priced("hot-3", "إسبريسو دبل", 1.25),
    priced("hot-4", "قهوة العميد", 1.25),
    priced("hot-5", "حليب ساخن", 1.0),
    priced("hot-8", "ماكياتو", 1.5),
    priced("hot-9", "كورداتو", 1.5),
    priced("hot-10", "فلايت وايت", 1.5),
    priced("hot-12", "أمريكان", 1.5),
    priced("hot-13", "أمريكانو", 2.0),
    priced("hot-14", "لاتيه", 1.75, { flavors: ["كراميل", "فانيلا", "لافندر", "كوكيز", "بندق"] }),
    priced("hot-15", "دارك موكا", 2.0),
    priced("hot-16", "وايت موكا", 2.0),
    priced("hot-17", "زيبرا موكا", 2.0),
    priced("hot-18", "ماكياتو كراميل", 2.0),
    priced("hot-19", "كافي بن وبيتزاس", 2.0),
    priced("hot-20", "لاتيه إسباني", 2.25),
    priced("hot-21", "بستاشيو لاتيه", 2.5),
  ] as Base[]
).map(withImage);

const cold = (
  [
    priced("cold-2", "أيس تي", 1.5, { flavors: ["ليمون", "توت", "دراق", "مانجو"], desc: "شاي مثلج بنكهات منعشة" }),
    priced("cold-iced-coffee", "أيس كافي", 1.5, { desc: "قهوة مثلجة منعشة بنكهة غنية" }),
    priced("cold-iced-mocha", "أيس موكا", 1.5, { desc: "قهوة مثلجة مع صوص الشوكولاتة" }),
    priced("cold-iced-latte", "أيس لاتيه", 1.5, { desc: "إسبرسو مثلج مع الحليب الطازج" }),
    priced("cold-1", "شيكاراتو", 1.25, { desc: "إسبرسو مخفوق مع الثلج" }),
    priced("cold-3", "سلاش", 1.75, { flavors: ["فراولة", "مانجو", "توت", "رمان", "تفاح", "ليمون"], desc: "عصير مثلج مجروش بنكهات مميزة" }),
    priced("cold-4", "سموذي", 2.25, {
      flavors: ["مانجا باشن فروت", "أناناس جوز هند", "فراولة توت بيرى", "ليمون وكيوي", "دراق ليمون مانجا"],
      desc: "سموذي فواكه طبيعي مثلج",
    }),
    priced("cold-5", "فرابتشينو", 2.5, {
      flavors: ["كراميل", "فانيلا", "موكا وايت", "موكا دارك", "أوريو", "كوكيز", "أمريكانو"],
      desc: "فرابتشينو غني بالكريمة والنكهات",
    }),
  ] as Base[]
).map(withImage);

const milkshake = (
  [
    priced("shake-1", "ملك شك كلاسيك", 1.5, { desc: "ميلك شيك كلاسيكي بارد ومخفوق بالكريمة" }),
    priced("shake-2", "ميلك شيك أوريو", 1.5, { desc: "مخفوق بقطع بسكويت الأوريو والشوكولاتة" }),
    priced("shake-3", "ميلك شيك سنكرز", 1.5, { desc: "شوكولاتة مع كراميل وفول سوداني مقرمش" }),
    priced("shake-4", "ميلك شيك فانيلا", 1.5, { desc: "فانيلا طبيعية غنية وكريمة ناعمة" }),
    priced("shake-5", "ميلك شيك بوظة عربية", 1.5, { desc: "نكهة البوظة العربية الأصيلة مع المستكة والفستق" }),
    priced("shake-6", "ميلك شيك مانجو", 1.5, { desc: "مانجو طبيعي مخفوق بالآيس كريم المنعش" }),
    priced("shake-7", "ميلك شيك فراولة", 1.5, { desc: "فراولة طازجة مخفوقة بالكريمة اللذيذة" }),
    priced("shake-8", "ميلك شيك شوكلاته", 1.5, { desc: "شوكولاتة فاخرة غنية وكثيفة" }),
  ] as Base[]
).map(withImage);

const fruit = (
  [
    priced("fr-4", "موز", 1.5, { desc: "عصير موز طازج محضر يومياً" }),
    priced("fr-5", "فراولة", 1.5, { desc: "عصير فراولة طبيعي طازج" }),
    priced("fr-6", "موز فراولة بالحليب", 1.5, { desc: "مزيج رائع من الموز والفراولة بالحليب" }),
    priced("fr-7", "موز وحليب", 1.5, { desc: "موز مخفوق بالحليب الطازج" }),
    priced("fr-8", "برتقال", 1.5, { desc: "عصير برتقال طبيعي معصور طازج 100%" }),
    priced("fr-9", "ليمون مع نعنع", 1.5, { desc: "ليمون مع نعنع طازج ومثلج فائق الانتعاش" }),
    priced("fr-10", "موز ونوتيلا", 1.5, { desc: "عصير موز طبيعي مع شوكولاتة نوتيلا اللذيذة" }),
    priced("fr-2", "أفوكادو", 2.5, { desc: "أفوكادو طبيعي كريمي بالحليب والعسل" }),
    priced("fr-11", "رمان", 1.5, { desc: "عصير رمان طبيعي طازج وغني" }),
    priced("fr-12", "كيوي", 1.5, { desc: "عصير كيوي طبيعي ومنعش" }),
    priced("fr-13", "شمام", 1.5, { desc: "عصير شمام بارد ومنعش" }),
    priced("fr-1", "كوكتيل فواكه", 1.5, { desc: "كوكتيل فواكه طبيعية مشكلة" }),
    priced("fr-3", "أفوكادو مكسرات", 2.5, { desc: "أفوكادو مع مكسرات فاخرة وقشطة وعسل" }),
  ] as Base[]
).map(withImage);

const soft = (
  [
    priced("soft-6", "كولا", 0.5, { desc: "مشروب كولا غازي بارد مع ثلج" }),
    priced("soft-1", "سفن", 0.5, { desc: "مشروب سفن غازي بنكهة الليمون المنعش" }),
    priced("soft-7", "ميرندا", 0.5, { desc: "مشروب ميرندا برتقال غازي بارد" }),
    priced("soft-3", "بوم بوم", 1.0, { desc: "مشروب طاقة بوم بوم منعش" }),
    priced("soft-8", "باربيكان", 1.0, { desc: "مشروب شعير باربيكان بنكهات متعددة" }),

    priced("soft-4", "كود رد", 1.5, { desc: "مشروب طاقة كود رد" }),
    priced("soft-5", "ريد بول", 2.0, { desc: "مشروب طاقة ريد بول الشهير" }),
    priced("soft-10", "إضافة ماهيتو", 0.5, { desc: "إضافة نكهة ماهيتو المنعشة بالليمون والنعنع" }),
    priced("soft-2", "بي أم", 1.5, { desc: "مشروب غازي منعش" }),
  ] as Base[]
).map(withImage);

const hookah = (
  [
    priced("hk-1", "بطيخ مع نعنع", 1.5, { desc: "نكهة البطيخ المنعش مع لمسة نعنع بارد" }),
    priced("hk-2", "علكة مع قرفة", 1.5, { desc: "نكهة مميزة تجمع العلكة مع القرفة العطرية" }),
    priced("hk-3", "ليمون مع نعنع", 1.5, { desc: "خلطة كلاسيكية منعشة من الليمون والنعنع" }),
    priced("hk-4", "علكة مع نعنع", 1.5, { desc: "نكهة العلكة المنعشة بنفحات النعنع البارد" }),
    priced("hk-5", "توت مع عنب", 1.5, { desc: "مزيج غني من التوت البري والعنب اللذيذ" }),
    priced("hk-6", "لف (Love 66)", 1.5, { desc: "خلطة لوف 66 الشهيرة بنكهات استوائية منعشة" }),
    priced("hk-7", "كاندي", 1.5, { desc: "نكهة كاندي حلوة وفريدة" }),
    priced("hk-8", "مزيا تفاحتين", 2.0, { desc: "معسل مزايا تفاحتين الفاخر" }),
    priced("hk-9", "نخله تفاحتين", 2.5, { desc: "معسل النخلة تفاحتين الأصلي الفاخر" }),
  ] as Base[]
).map(withImage);

const addons = [
  withImage(
    priced("add-1", "إضافة ماهيتو", 0.5, {
      note: "إضافة نكهة ماهيتو المنعشة بالنعنع والليمون لأي مشروب أو عصير.",
      desc: "نكهة ماهيتو منعشة وباردة",
    }),
  ),
  withImage(
    priced("add-2", "إضافات ونكهات متنوعة", 0.5, {
      note: "السعر كما ورد في القائمة، ويمكن إضافتها اختيارياً حسب رغبتكم.",
      desc: "نكهات سيروب وإضافات خاصة حسب الطلب",
    }),
  ),
];

export const CATEGORIES: Category[] = [
  { id: "pizza", title: "البيتزا", kicker: "ثلاثة أحجام", layout: "pizza", cover: COVER.pizza, items: pizzaItems },
  { id: "manakish", title: "المناقيش", kicker: "من الفرن", layout: "list", cover: COVER.manakish, items: manakish },
  { id: "shami", title: "المعجنات الشامية", kicker: "كل صنف بسعر واحد", layout: "list", cover: COVER.shami, items: shami },
  { id: "hot", title: "المشروبات الساخنة", kicker: "قهوة ومشروبات دافئة", layout: "grid", cover: COVER.hot, items: hot },
  { id: "cold", title: "المشروبات الباردة", kicker: "نكهات ومثلجات", layout: "grid", cover: COVER.cold, items: cold },
  { id: "milkshake", title: "الميلك شيك", kicker: "بارد ومخفوق بالكريمة", layout: "grid", cover: COVER.milkshake, items: milkshake },
  { id: "fruit", title: "العصائر الطبيعية", kicker: "طازجة ومحضرة يومياً", layout: "grid", cover: COVER.fruit, items: fruit },
  { id: "soft", title: "المشروبات الغازية والطاقة", kicker: "منعشة وباردة", layout: "grid", cover: COVER.soft, items: soft },
  { id: "hookah", title: "الأراجيل", kicker: "أراجيل ونكهات مميزة", layout: "hookah", cover: COVER.hookah, items: hookah },
  { id: "addons", title: "الإضافات", kicker: "إضافات اختيارية", layout: "addons", cover: COVER.addons, items: addons },
];

export const NAV_LABELS: Record<string, string> = {
  pizza: "البيتزا",
  manakish: "المناقيش",
  shami: "المعجنات الشامية",
  hot: "المشروبات الساخنة",
  cold: "المشروبات الباردة",
  milkshake: "الميلك شيك",
  fruit: "العصائر",
  soft: "غازية وطاقة",
  hookah: "الأراجيل",
  addons: "الإضافات",
};

export const TILES = [
  { cat: "pizza", label: "البيتزا", img: COVER.pizza, wide: true },
  { cat: "hot", label: "المشروبات الساخنة", img: COVER.hot },
  { cat: "cold", label: "المشروبات الباردة", img: COVER.cold },
  { cat: "milkshake", label: "الميلك شيك", img: COVER.milkshake },
  { cat: "fruit", label: "العصائر الطبيعية", img: COVER.fruit },
  { cat: "hookah", label: "الأراجيل", img: COVER.hookah, wide: true },
];

export const ITEM_INDEX = new Map<string, { item: MenuItem; cat: Category }>(
  CATEGORIES.flatMap((cat) => cat.items.map((item) => [item.id, { item, cat }] as const)),
);

export interface ManifestEntry {
  productId: string;
  nameAr: string;
  url: string | null;
  subject: string;
  match: MatchLevel;
  verified: boolean;
}

export const IMAGE_MANIFEST: ManifestEntry[] = CATEGORIES.flatMap((c) => c.items).map((item) => {
  const m = PRODUCT_IMAGES[item.id];
  return {
    productId: item.id,
    nameAr: item.name,
    url: item.img ? imgUrl(item.img, 800) : null,
    subject: m?.subject ?? "none",
    match: m?.match ?? "placeholder",
    verified: true,
  };
});

export const norm = (s: string) =>
  s
    .normalize("NFKD")
    .replace(/[ً-ٰٟـ]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[ؤ]/g, "و")
    .replace(/[ئ]/g, "ي")
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

const stripAl = (s: string) => s.replace(/(^| )ال(?=\S{2,})/g, "$1");

export interface SearchHit {
  item: MenuItem;
  cat: Category;
  flavor?: string;
  score: number;
}

const SEARCH_DOCS = CATEGORIES.flatMap((cat) =>
  cat.items.map((item) => ({
    item,
    cat,
    name: stripAl(norm(item.name)),
    desc: stripAl(norm(item.desc ?? "")),
    flavors: (item.flavors ?? []).map((f) => ({ raw: f, n: stripAl(norm(f)) })),
    catText: stripAl(norm(`${cat.title} ${NAV_LABELS[cat.id]}`)),
  })),
);

export const searchMenu = (query: string): SearchHit[] => {
  const q = stripAl(norm(query));
  if (!q) return [];
  const tokens = q.split(" ");
  const hits: SearchHit[] = [];
  for (const d of SEARCH_DOCS) {
    let score = 0;
    let flavor: string | undefined;
    let ok = true;
    for (const t of tokens) {
      const nameWord = d.name.split(" ").some((w) => w.startsWith(t));
      if (nameWord) score += 10;
      else if (d.name.includes(t)) score += 7;
      else if (d.desc.includes(t)) score += 4;
      else {
        const f = d.flavors.find((x) => x.n.includes(t));
        if (f) {
          score += 5;
          flavor = f.raw;
        } else if (d.catText.includes(t)) score += 1;
        else {
          ok = false;
          break;
        }
      }
    }
    if (ok) hits.push({ item: d.item, cat: d.cat, flavor, score });
  }
  return hits.sort((a, b) => b.score - a.score);
};
