import { motion } from "motion/react";
import { SmartImage } from "./ui";
import { COVER } from "../data/imageManifest";

export interface Story {
  id: string;
  title: string;
  tag: string;
  catId: string;
  img: string;
  isHot?: boolean;
}

const STORIES: Story[] = [
  {
    id: "s-pizza",
    title: "بن وبيتزا",
    tag: "الأكثر طلباً 🔥",
    catId: "pizza",
    img: COVER.pizza,
    isHot: true,
  },
  {
    id: "s-cappuccino",
    title: "كابتشينو",
    tag: "مميز ☕",
    catId: "hot",
    img: "https://www.alicafearabia.com/storage/news/March2024/a30A4alxeeuvZwjAdPFQ.webp",
    isHot: true,
  },
  {
    id: "s-shake",
    title: "ميلك شيك",
    tag: "بارد ومنعش 🥤",
    catId: "milkshake",
    img: COVER.milkshake,
  },
  {
    id: "s-fruit",
    title: "عصائر فريش",
    tag: "طبيعي 100% 🍓",
    catId: "fruit",
    img: COVER.fruit,
  },
  {
    id: "s-hookah",
    title: "أراجيل فاخرة",
    tag: "نكهات مميزة 💨",
    catId: "hookah",
    img: COVER.hookah,
  },
  {
    id: "s-shami",
    title: "معجنات شامية",
    tag: "من الفرن 🥐",
    catId: "shami",
    img: COVER.shami,
  },
];

export default function StoryHighlights({ onSelectStory }: { onSelectStory: (catId: string) => void }) {
  return (
    <section aria-label="أبرز التوصيات والأصناف" className="bg-cream px-4 pt-3 pb-2 sm:px-5">
      <div className="mx-auto max-w-5xl">
        <div className="no-scrollbar flex gap-4 overflow-x-auto py-2">
          {STORIES.map((story, i) => (
            <motion.button
              key={story.id}
              type="button"
              onClick={() => onSelectStory(story.catId)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, type: "spring", stiffness: 350, damping: 25 }}
              className="flex shrink-0 flex-col items-center gap-1.5 focus:outline-none"
            >
              {/* Glowing Story Ring */}
              <div
                className={`relative grid h-[72px] w-[72px] place-items-center rounded-full p-[2.5px] transition-transform duration-300 ${
                  story.isHot
                    ? "bg-gradient-to-tr from-tomato via-caramel to-caramel-light shadow-[0_0_12px_rgba(217,75,61,0.35)]"
                    : "bg-gradient-to-tr from-caramel via-latte to-caramel-light"
                }`}
              >
                <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-cream bg-sand">
                  <SmartImage
                    id={story.img}
                    alt={story.title}
                    w={150}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                {story.isHot && (
                  <span className="absolute -bottom-1 -end-1 grid h-5 w-5 place-items-center rounded-full bg-tomato text-[10px] text-white shadow-xs">
                    🔥
                  </span>
                )}
              </div>
              <span className="max-w-[76px] truncate text-center font-display text-[12px] font-bold text-espresso leading-tight">
                {story.title}
              </span>
              <span className="text-[10px] font-medium text-roast/80 -mt-0.5">{story.tag}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
