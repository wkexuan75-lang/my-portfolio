"use client";

import { motion } from "framer-motion";
import Image from "next/image";

/** `public/images/graphics/p6.png` — 换图后运行 `sips -g pixelWidth -g pixelHeight` 更新 w/h */
const P6 = {
  src: "/images/graphics/p6.png",
  w: 1024,
  h: 727,
} as const;

export function BrandPositioning() {
  return (
    <section
      className="grid min-h-screen w-full grid-cols-1 md:grid-cols-2 md:items-stretch"
      aria-labelledby="brand-positioning-heading"
    >
      {/* 左：黑底文案；与右列同高（grid 拉伸） */}
      <motion.div
        className="flex min-h-screen w-full items-center justify-center bg-[#000000] px-8 py-14 md:h-full md:min-h-0 md:px-12 md:py-16"
        initial={{ x: -20, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.28 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="w-full max-w-lg text-left">
          <h2
            id="brand-positioning-heading"
            lang="zh-Hans"
            className="text-2xl font-semibold tracking-wide text-white md:text-3xl"
            style={{
              fontFamily: "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
            }}
          >
            品牌定位
          </h2>
          <p className="mt-3 text-xs font-medium uppercase tracking-[0.32em] text-white/70 md:text-sm">
            BRAND POSITIONING
          </p>

          <p
            lang="zh-Hans"
            className="mt-8 text-[0.95rem] leading-[1.95] text-white/88 md:mt-10 md:text-base"
            style={{
              fontFamily: "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
            }}
          >
            Paw&amp;GO
            是一个富有创意和个性的宠物友好餐车品牌，致力于为年轻的户外人群提供健康、美味、方便的餐饮服务。我们的品牌理念是「健康、时尚、便捷、自由」，在这个理念的指导下，我们不断研发和提供新颖、健康、美味的餐饮产品，努力满足年轻人对于美食的追求。
          </p>
          <p
            lang="zh-Hans"
            className="mt-4 text-[0.95rem] leading-[1.95] text-white/88 md:text-base"
            style={{
              fontFamily: "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
            }}
          >
            同时，我们的餐车将提供宠物友好的用餐环境，宠物食品以及宠物主题的餐具和装饰。这些宠物友好的特点将会吸引更多的宠物家庭前来用餐，成为
            Paw&amp;GO
            品牌的忠实顾客。我们的主题轻松简单，为年轻人提供了一个愉悦的用餐环境，让他们在享受美食的同时感受到轻松、自在的生活态度。以优质的服务和高品质的食品，赢得了客户的信任和赞誉，成为年轻人心目中的餐车品牌。
          </p>

          <p
            lang="en"
            className="mt-7 border-t border-white/15 pt-7 text-[0.9rem] leading-relaxed text-white/75 [font-family:var(--font-geist-sans),system-ui,sans-serif] md:text-[0.95rem]"
          >
            Paw&amp;GO is a creative, characterful pet-friendly food truck brand
            serving young outdoor audiences healthy, delicious, and convenient
            meals. Our values—healthy, stylish, convenient, and free—guide us as
            we develop fresh, wholesome dishes that match how young people want
            to eat.
          </p>
          <p
            lang="en"
            className="mt-4 text-[0.9rem] leading-relaxed text-white/75 [font-family:var(--font-geist-sans),system-ui,sans-serif] md:text-[0.95rem]"
          >
            Our truck offers a pet-friendly dining setting, pet food, and
            pet-themed tableware and décor—drawing pet-owning families and
            building loyal Paw&amp;GO guests. The mood is light and easy: a
            welcoming place to enjoy food and a relaxed, carefree outlook. With
            thoughtful service and quality food, we earn trust and recognition as
            a food truck brand young people remember.
          </p>
        </div>
      </motion.div>

      {/* 右：p6 整图入框（比例 = w/h），黑底与左栏统一；与左列等高 */}
      <div className="flex h-full w-full min-h-[min(70vh,640px)] items-center justify-center bg-black p-4 md:min-h-0 md:h-full md:p-6">
        <div
          className="relative w-full max-w-full"
          style={{
            aspectRatio: `${P6.w} / ${P6.h}`,
            maxHeight: "min(88dvh, 100%)",
          }}
        >
          <Image
            src={P6.src}
            alt="Paw & GO brand imagery"
            fill
            className="object-contain object-center"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={false}
          />
        </div>
      </div>
    </section>
  );
}
