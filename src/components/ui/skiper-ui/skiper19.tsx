"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";

const LuxuryWatchStory = () => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
  });

  return (
    <section
      ref={ref}
      className="
        relative
        mx-auto
        flex
        h-[350vh]
        w-screen
        flex-col
        items-center
        overflow-hidden
        bg-[#0A0A0A]
        px-4
        text-[#F4F1EA]
      "
    >
      <div
        className="
          relative
          mt-42
          flex
          w-fit
          flex-col
          items-center
          justify-center
          gap-6
          text-center
        "
      >
        <p
          className="
            relative
            z-10
            text-xs
            font-medium
            uppercase
            tracking-[0.4em]
            text-[#B7A57A]
            md:text-sm
          "
        >
          The Art of Time
        </p>

        <h1
          className="
            relative
            z-10
            text-6xl
            font-medium
            leading-[0.9]
            tracking-[-0.07em]
            md:text-8xl
            lg:text-9xl
          "
        >
          Time
          <br />
          That Follows
          <br />
          Every Moment
        </h1>

        <p
          className="
            relative
            z-10
            max-w-xl
            text-base
            font-light
            leading-relaxed
            text-white/55
            md:text-lg
          "
        >
          Precision crafted for those who appreciate exceptional design,
          timeless character, and uncompromising craftsmanship.
        </p>

        {/* Animated stroke */}
        <LinePath
          className="absolute right-[-40%] top-0 z-0"
          scrollYProgress={scrollYProgress}
        />
      </div>

      <div
        className="
          w-full
          translate-y-[200vh]
          rounded-[2.5rem]
          bg-[#F4F1EA]
          pb-12
          text-[#111111]
        "
      >
        {/* Brand */}
        <h2
          className="
            mt-10
            text-center
            text-[17vw]
            font-medium
            leading-[0.8]
            tracking-[-0.07em]
            md:text-[16vw]
          "
        >
          CAELUM
        </h2>

        <div
          className="
            mx-auto
            mt-20
            max-w-4xl
            px-6
            text-center
            md:mt-28
          "
        >
          <p
            className="
              text-2xl
              font-medium
              leading-tight
              tracking-tight
              md:text-4xl
            "
          >
            Time, refined through craftsmanship.
          </p>

          <p
            className="
              mx-auto
              mt-6
              max-w-2xl
              text-sm
              leading-relaxed
              text-black/55
              md:text-base
            "
          >
            Every CAELUM timepiece is shaped by a pursuit of precision and an
            appreciation for enduring design. From the movement within to every
            considered detail, each watch is created to transcend seasons and
            accompany generations.
          </p>
        </div>

        <div
          className="
            mt-32
            flex
            w-full
            flex-col
            gap-12
            border-t
            border-black/10
            px-6
            pt-8
            md:mt-40
            md:flex-row
            md:items-start
            md:justify-between
          "
        >
          {/* Location */}
          <div className="flex flex-col gap-2">
            <span
              className="
                text-[10px]
                font-medium
                uppercase
                tracking-[0.3em]
                text-black/40
              "
            >
              Origin
            </span>

            <p className="text-sm uppercase">
              Switzerland
              <br />
              &amp; Worldwide
            </p>
          </div>

          {/* Craft */}
          <div className="flex flex-col gap-2">
            <span
              className="
                text-[10px]
                font-medium
                uppercase
                tracking-[0.3em]
                text-black/40
              "
            >
              Craftsmanship
            </span>

            <p className="text-sm uppercase">
              Swiss Precision
              <br />
              Hand Finished
            </p>
          </div>

          {/* Collection */}
          <div className="flex flex-col gap-2">
            <span
              className="
                text-[10px]
                font-medium
                uppercase
                tracking-[0.3em]
                text-black/40
              "
            >
              Collection
            </span>

            <p className="text-sm uppercase">
              Limited Editions
              <br />
              Timeless Design
            </p>
          </div>

          {/* Established */}
          <div className="flex flex-col gap-2">
            <span
              className="
                text-[10px]
                font-medium
                uppercase
                tracking-[0.3em]
                text-black/40
              "
            >
              Established
            </span>

            <p className="text-sm uppercase">
              1987
              <br />
              Independent
            </p>
          </div>
        </div>

        {/* Bottom statement */}
        <div className="mt-28 px-6 text-center md:mt-40">
          <p
            className="
              text-xs
              uppercase
              tracking-[0.35em]
              text-black/40
            "
          >
            Designed to endure
          </p>

          <p
            className="
              mt-4
              text-3xl
              font-medium
              tracking-tight
              md:text-5xl
            "
          >
            Beyond time.
          </p>
        </div>
      </div>
    </section>
  );
};

export { LuxuryWatchStory };

const LinePath = ({
  className,
  scrollYProgress,
}: {
  className: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scrollYProgress: any;
}) => {
  const pathLength = useTransform(scrollYProgress, [0, 1], [0.5, 1]);

  return (
    <svg
      width="1278"
      height="2319"
      viewBox="0 0 1278 2319"
      fill="none"
      overflow="visible"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <motion.path
        d="
          M876.605 394.131
          C788.982 335.917 696.198 358.139 691.836 416.303
          C685.453 501.424 853.722 498.43 941.95 409.714
          C1016.1 335.156 1008.64 186.907 906.167 142.846
          C807.014 100.212 712.699 198.494 789.049 245.127
          C889.053 306.207 986.062 116.979 840.548 43.3233
          C743.932 -5.58141 678.027 57.1682 672.279 112.188
          C666.53 167.208 712.538 172.943 736.353 163.088
          C760.167 153.234 764.14 120.924 746.651 93.3868
          C717.461 47.4252 638.894 77.8642 601.018 116.979
          C568.164 150.908 557 201.079 576.467 246.924
          C593.342 286.664 630.24 310.55 671.68 302.614
          C756.114 286.446 729.747 206.546 681.86 186.442
          C630.54 164.898 492 209.318 495.026 287.644
          C496.837 334.494 518.402 366.466 582.455 367.287
          C680.013 368.538 771.538 299.456 898.634 292.434
          C1007.02 286.446 1192.67 309.384 1242.36 382.258
          C1266.99 418.39 1273.65 443.108 1247.75 474.477
          C1217.32 511.33 1149.4 511.259 1096.84 466.093
          C1044.29 420.928 1029.14 380.576 1033.97 324.172
          C1038.31 273.428 1069.55 228.986 1117.2 216.384
          C1152.2 207.128 1188.29 213.629 1194.45 245.127
          C1201.49 281.062 1132.22 280.104 1100.44 272.673
          C1065.32 264.464 1044.22 234.837 1032.77 201.413
          C1019.29 162.061 1029.71 131.126 1056.44 100.965
          C1086.19 67.4032 1143.96 54.5526 1175.78 86.1513
          C1207.02 117.17 1186.81 143.379 1156.22 166.691
          C1112.57 199.959 1052.57 186.238 999.784 155.164
          C957.312 130.164 899.171 63.7054 931.284 26.3214
          C952.068 2.12513 996.288 3.87363 1007.22 43.58
          C1018.15 83.2749 1003.56 122.644 975.969 163.376
          C948.377 204.107 907.272 255.122 913.558 321.045
          C919.727 385.734 990.968 497.068 1063.84 503.35
          C1111.46 507.456 1166.79 511.984 1175.68 464.527
          C1191.52 379.956 1101.26 334.985 1030.29 377.017
          C971.109 412.064 956.297 483.647 953.797 561.655
          C947.587 755.413 1197.56 941.828 936.039 1140.66
          C745.771 1285.32 321.926 950.737 134.536 1202.19
          C-6.68295 1391.68 -53.4837 1655.38 131.935 1760.5
          C478.381 1956.91 1124.19 1515 1201.28 1997.83
          C1273.66 2451.23 100.805 1864.7 303.794 2668.89
        "
        stroke="#B7A57A"
        strokeWidth="18"
        strokeLinecap="round"
        style={{
          pathLength,
          strokeDashoffset: useTransform(pathLength, (value) => 1 - value),
        }}
      />
    </svg>
  );
};

export default LuxuryWatchStory;
