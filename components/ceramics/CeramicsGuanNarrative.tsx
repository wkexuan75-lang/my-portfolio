"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useMemo } from "react";

const REVEAL = {
  initial: { opacity: 0, filter: "blur(4px)" },
  whileInView: { opacity: 1, filter: "blur(0px)" },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
} as const;

export function CeramicsGuanNarrative() {
  const artifacts = useMemo(
    () =>
      [
        {
          key: "ding-child-pillow",
          imageSrc: "/images/ceramics/15.jpg",
          imageAlt: "定窑孩儿枕",
          titleZh: "定窑孩儿枕",
          titleEn: "Ding Kiln “Child Pillow”",
          bodyZh:
            "瓷枕的烧制为古代寝具，古书记载“瓷枕能明目益睛，至老可读细书。”定窑瓷器以白瓷为主，大都为实用的瓶、罐、碗等，孩儿枕是难得一见的器型。现藏于故宫博物院的这件定窑孩儿枕，釉色牙黄，工艺精巧，先使用模具烧制成型，再加以精细的雕工，活泼可爱的孩童侧卧于榻上，双臂紧抱置于头下，两脚叠压稍稍抬起，孩儿神态栩栩如生，是中国陶瓷史上的经典之作。这件定窑孩儿枕不仅是宋代风俗的见证，也是研究宋代文化和陶瓷艺术的珍贵实物资料。",
          bodyEn:
            "Porcelain pillows were kiln-fired bedding objects in antiquity. Ancient texts note that “porcelain pillows can brighten the eyes and benefit the vision—so that even in old age one may still read fine print.” Ding ware is famed for white porcelain, most often practical forms such as bottles, jars, and bowls; the “child pillow” is a rare and exceptional type. This Ding kiln example, now in the Palace Museum, has an ivory-tinted glaze and refined workmanship: it was first molded and fired to shape, then finished with delicate carving. A lively child reclines on a couch, arms tucked beneath the head, feet slightly raised and crossed—rendered with vivid expression. It is a classic in the history of Chinese ceramics. Beyond its artistry, it bears witness to Song-era customs and is a valuable material source for studying Song culture and ceramic art.",
        },
        {
          key: "ru-narcissus-basin",
          imageSrc: "/images/ceramics/6.jpg",
          imageAlt: "汝窑青瓷无纹水仙盆",
          titleZh: "天青色无纹水仙盆（汝窑）",
          titleEn: "Sky-blue, Unpatterned Narcissus Basin (Ru kiln)",
          bodyZh:
            "现存台北故宫博物馆汝窑青瓷无纹水仙盆是椭圆形盆，侈口、深壁，平底凸出窄边稜，四云头形足；周壁胎薄，底足略厚。通体满布天青釉，极匀润；底边釉积处略含淡碧色；口缘与稜角釉薄处呈浅粉色。",
          bodyEn:
            "The Ru kiln celadon unpatterned narcissus basin preserved in the National Palace Museum, Taipei, is an oval vessel with a flaring mouth and deep walls. It has a flat base with a raised narrow rim and four cloud-head feet; the walls are thinly potted while the base and feet are slightly thicker. The entire body is covered in an exceptionally even, lustrous sky-blue glaze. Where the glaze pools along the lower edge it takes on a faint bluish-green tone, and where it thins at the rim and edges it shows a pale pink hue.",
        },
        {
          key: "guan-square-planter",
          imageSrc: "/images/ceramics/14.jpg",
          imageAlt: "官窑青釉方花盆",
          titleZh: "官窑青釉方花盆",
          titleEn: "Guan Kiln Celadon Square Planter",
          bodyZh:
            "官窑青釉方花盆高9.2厘米，口边长15.3厘米，足边长13.0厘米。花盆呈长方体形，敞口，器口镶铜，直壁，平底中央开有一渗水圆孔。器底承以四矮足，底足露胎处呈黑褐色，俗称“铁足”。通体施粉青色釉，釉面开片，开片较大，裂纹遍布器身。此盆造型规整，釉色青润。宋代官窑、哥窑和龙泉窑的器物，往往在足部无釉处为黑褐色，即所谓“铁足”。成因是此类器物胎骨含铁量特高，在还原作用较强的足部露胎部分就呈现此色。",
          bodyEn:
            "This Guan kiln celadon square planter measures 9.2 cm in height, with a mouth edge length of 15.3 cm and a foot edge length of 13.0 cm. The body is a rectangular form with an open mouth; the rim is mounted with metal, the walls are straight, and a circular drainage hole opens at the center of the flat base. The vessel stands on four short feet; where the clay body is exposed at the feet it appears dark brown to black, commonly called “iron foot” (铁足). A pale bluish-green glaze covers the piece, with a crackle network that is relatively large and spreads across the surface. Planters and vessels from Song Guan ware, Ge ware, and Longquan ware often show this dark, unglazed foot—caused by a clay body rich in iron, which turns dark in the exposed areas under strong reducing conditions in the kiln.",
        },
        {
          key: "jun-haitang-planter",
          imageSrc: "/images/ceramics/13.jpg",
          imageAlt: "钧窑玫瑰紫釉海棠花盆",
          titleZh: "钧窑玫瑰紫釉海棠花盆",
          titleEn: "Jun Kiln Rose-purple Glazed Haitang Planter",
          bodyZh:
            "钧窑玫瑰紫釉海棠式花盆，高14.7厘米，口径23.3－18.6厘米，足距8厘米。花盆呈海棠式，敞口，折沿，腹上阔下敛，平底，四云头形足。内壁施天蓝色釉，外壁施玫瑰紫色釉，釉层厚润，釉面气泡、棕眼明显，有“蚯蚓走泥纹”。底有五个渗水孔，刻数目字“四”和“重华宫”（横向）、“金昭玉翠用”（纵向）。",
          bodyEn:
            "This Jun kiln haitang-shaped planter with rose-purple glaze stands 14.7 cm high, with a rim diameter of 23.3–18.6 cm and an 8 cm distance between the feet. The planter takes a haitang (begonia) outline, with an open mouth and folded rim; the belly is broad above and tapering below, with a flat base and four cloud-head feet. The inner wall is glazed in a sky blue, while the outer wall carries a rose-purple glaze. The glaze layer is thick and glossy; bubbles and brown specks are pronounced, and the surface shows the so-called “earthworm-walking” texture (蚯蚓走泥纹). Five drainage holes pierce the base. Incised inscriptions include the numeral “four” and “Chonghua Palace” (horizontal), as well as “for use in Jinzhaoyucui” (vertical).",
        },
        {
          key: "ge-fish-ear-incense-burner",
          imageSrc: "/images/ceramics/11.jpg",
          imageAlt: "哥窑青釉鱼耳炉",
          titleZh: "哥窑青釉鱼耳炉",
          titleEn: "Ge Kiln Celadon “Fish-ear” Censer",
          bodyZh:
            "哥窑青釉鱼耳炉，宋，高9厘米，口径11.8厘米，足径9.6厘米。此炉造型仿商周青铜礼器簋，“Ｓ”形轮廓线上敛下丰，勾勒出端庄饱满的体态。腹两侧对称置鱼形耳，下承以圈足。造型古朴典雅。通体施青灰色釉，釉面密布交织如网的“金丝铁线”开片纹，使素净的釉面富于韵律美。外底有6个圆形支钉痕。此件鱼耳炉属于清宫旧藏品，清代乾隆皇帝曾对其颇为赏识，摩挲把玩时曾拟诗一首，由宫廷玉作匠师楷书镌刻于炉之外底。诗云：\n伊谁换夕薰，香讶至今闻。\n制自崇鱼耳，色犹缬鳝纹。\n本来无火气，却似有云氲。\n辨见八还毕，鼻根何处分。\n款署“乾隆丙申仲春御题”。",
          bodyEn:
            "This Ge kiln celadon “fish-ear” censer (Song dynasty) measures 9 cm high, with a mouth diameter of 11.8 cm and a foot diameter of 9.6 cm. The form echoes Shang–Zhou ritual bronzes of the gui type: its S-shaped profile narrows above and swells below, producing a dignified, full-bodied silhouette. Fish-shaped handles are set symmetrically on the sides, and the vessel rests on a ring foot. The overall design is archaic and elegant. A blue-gray glaze covers the entire piece, densely filled with the interlaced crackle pattern known as “golden threads and iron lines” (金丝铁线), lending rhythm to an otherwise restrained surface. Six circular spur marks remain on the exterior base. This censer was part of the Qing imperial collection; the Qianlong Emperor admired it and composed a poem while handling it, which court craftsmen incised in regular script on the outer base. The poem reads:\nWho exchanged the evening incense? Its fragrance still surprises the ear today.\nMade in reverence for those fish-ears, its color resembles mottled eel-skin lines.\nThough truly without a trace of fire, it seems to hold a mist of clouds within.\nWhen the Eight Returns are discerned and complete—where, then, is the root of the nose?\nInscription: “Composed by the Emperor in early spring of the Bing-Shen year of Qianlong.”",
        },
      ] as const,
    [],
  );

  return (
    <section className="mx-auto mt-10 mb-20 w-full max-w-7xl px-6">
      <motion.div
        className="mx-auto max-w-3xl text-center"
        initial={REVEAL.initial}
        whileInView={REVEAL.whileInView}
        viewport={REVEAL.viewport}
        transition={REVEAL.transition}
      >
        <h2 className="mb-2 font-serif text-3xl text-[#B5A48B]">宋代瓷器</h2>
        <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.22em] text-neutral-400">
          Song Dynasty Ceramics (960–1279)
        </p>

        <div className="space-y-5 text-sm leading-loose">
          <p lang="zh-Hans" className="text-neutral-800">
            （公元960~1279年）的瓷艺是我国瓷业发展史上的繁荣时期，有&ldquo;瓷的时代&rdquo;之说。北宋（公元960-1127年）出现了定、汝、官、哥、钧和景德镇六大名窑。所产瓷器在造型、釉色和装饰上均达到高度的艺术境界，其美学风格以沉静雅素为特色。品种有青瓷、白瓷和黑瓷，景德镇的青白瓷亦有巧夺天工之美。北宋晚期建立官窑，开创了釉色变化和开片装饰的新途径。钧窑的青红窑便是它的一大创造。南宋（公元1127-1279年）是我国瓷器大量外销的时期，也是瓷器由单一釉色向彩瓷和花釉瓷发展的时期。钧瓷产生出海棠红和玫瑰紫，龙泉窑产生出梅子青，另外还有油滴、兔毫、鹧鸪斑、玳瑁等结晶釉和乳浊釉等新产品。南宋官窑在造型上多仿古器型，注重釉色美。为了釉色深沉，就必须胎薄，因此釉厚胎薄是南宋官窑产品的一大特色。
          </p>
          <div className="mx-auto my-2 h-px w-16 bg-neutral-200/80" aria-hidden="true" />
          <p lang="en" className="text-neutral-600">
            From 960 to 1279 CE, Song porcelain marked a flourishing chapter in
            China’s ceramic history—so much so that it has been called an
            &ldquo;age of porcelain.&rdquo; During the Northern Song
            (960–1127), the six great kiln centers of Ding, Ru, Guan, Ge, Jun,
            and Jingdezhen emerged. Their wares achieved a high artistic level
            in form, glaze, and ornament, with an aesthetic of quiet restraint
            and understated elegance. Types included celadon, white, and black
            wares; Jingdezhen’s bluish-white porcelain was celebrated for
            almost miraculous refinement. In the late Northern Song, official
            kilns were established, opening new paths in glaze variation and
            crackle decoration; Jun ware’s green–red flambé effects were among
            its signal innovations. The Southern Song (1127–1279) was an era of
            large-scale export and of porcelain moving from monochrome toward
            polychrome and flambé wares: Jun pieces in begonia red and rose
            purple, Longquan in plum green, alongside oil-spot, hare’s fur,
            partridge-feather, tortoiseshell crystalline glazes, and opaque
            glazes. Southern Song official wares often echoed ancient bronze
            shapes and prized glaze beauty; to achieve deep, rich color the
            body had to be thin—thick glaze on a thin body became a hallmark of
            Southern Song Guan ware.
          </p>

          <h3 className="pt-4 font-serif text-xl text-neutral-800">
            宋瓷的出口
          </h3>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-400">
            Song Porcelain Exports
          </p>

          <p lang="zh-Hans" className="text-neutral-800">
            宋代，中国瓷器出口开始迅速增加，遍及亚洲的东部、南部、西部和非洲东海岸的大部分地区。南京赵汝适在《诸番志》中所提到的从中国直接进口瓷器的国家和地区就有十五个之多，转口到达的国家和地区应远过此数。为此，朝廷在东南沿海的广州、明州、杭州、泉州等口岸城市设立了市舶司，以增加税收。据文献记载，绍兴末期（约1160年前后）广、泉二市舶司抽分及和买所得，每年多达二百万缗。可见当时贸易量之巨大。宋瓷出口的品种主要有景德镇的青白瓷、龙泉窑的青瓷、磁州窑的黑瓷、越窑的划花器，以及广东和福建等地的青瓷和青白瓷长品等。
          </p>
          <div className="mx-auto my-2 h-px w-16 bg-neutral-200/80" aria-hidden="true" />
          <p lang="en" className="text-neutral-600">
            In the Song period, Chinese porcelain exports grew rapidly, reaching
            much of East, South, and West Asia and the eastern coast of Africa.
            Zhao Rushi of Nanjing, in his{" "}
            <em>Records of Foreign Peoples</em> (
            <span lang="zh-Hans">诸番志</span>
            ), names more than fifteen countries and regions that imported
            porcelain directly from China; re-export routes reached still more
            places. To capture revenue, the court set up Maritime Trade Offices
            (<span lang="zh-Hans">市舶司</span>) in coastal ports such as
            Guangzhou, Mingzhou, Hangzhou, and Quanzhou. Records from the late
            Shaoxing era (around 1160) state that duties and purchases at the
            Guangzhou and Quanzhou offices alone could reach two million strings
            of cash per year—evidence of enormous trade volume. Exported Song
            wares included Jingdezhen bluish-white porcelain, Longquan celadon,
            Cizhou black wares, Yue carved pieces, and celadon and bluish-white
            wares from Guangdong, Fujian, and other regions.
          </p>
        </div>
      </motion.div>

      {/* Alternating bilingual artifact blocks — directly under Guan narrative */}
      <div className="mt-16 space-y-16 sm:mt-20 sm:space-y-20">
        {artifacts.map((a, idx) => (
          <motion.article
            key={a.key}
            className={[
              "grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-12",
              idx % 2 === 1 ? "md:[&_.artifact-text]:order-2 md:[&_.artifact-media]:order-1" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            initial={REVEAL.initial}
            whileInView={REVEAL.whileInView}
            viewport={REVEAL.viewport}
            transition={REVEAL.transition}
          >
            <div className="artifact-text">
              <h3 className="font-serif text-2xl text-neutral-800 sm:text-[28px]">
                {a.titleZh}
              </h3>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.24em] text-neutral-400">
                {a.titleEn}
              </p>

              <div className="mt-6 space-y-5 text-sm leading-loose text-neutral-700">
                <p lang="zh-Hans" className="text-justify">
                  {a.bodyZh}
                </p>
                <div className="h-px w-16 bg-neutral-200/70" aria-hidden="true" />
                <p lang="en" className="text-justify text-neutral-600">
                  {a.bodyEn}
                </p>
              </div>
            </div>

            <motion.figure
              className="artifact-media group relative mx-auto w-full max-w-[560px] overflow-hidden rounded-md bg-neutral-200/30 shadow-[0_18px_50px_rgba(0,0,0,0.08)]"
              whileHover={{ scale: 1.035 }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
            >
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={a.imageSrc}
                  alt={a.imageAlt}
                  fill
                  className="object-cover object-center transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                  sizes="(max-width: 768px) 92vw, 560px"
                />
              </div>
            </motion.figure>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
