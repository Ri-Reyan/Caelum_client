"use client";

import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css";
import "swiper/css/effect-cards";

import { cn } from "@/lib/utils";
import onePng from "@/assets/cardImg/one.png";
import twoPng from "@/assets/cardImg/two.png";
import threePng from "@/assets/cardImg/three.png";
import Link from "next/link";

const Skiper47 = () => {
  const images = [
    {
      src: twoPng,
      alt: "Illustrations by my fav AarzooAly",
    },
    {
      src: threePng,
      alt: "Illustrations by my fav AarzooAly",
    },
    {
      src: onePng,
      alt: "Illustrations by my fav AarzooAly",
    },
    {
      src: twoPng,
      alt: "Illustrations by my fav AarzooAly",
    },
    {
      src: threePng,
      alt: "Illustrations by my fav AarzooAly",
    },
    {
      src: onePng,
      alt: "Illustrations by my fav AarzooAly",
    },
    {
      src: twoPng,
      alt: "Illustrations by my fav AarzooAly",
    },
    {
      src: threePng,
      alt: "Illustrations by my fav AarzooAly",
    },
    {
      src: onePng,
      alt: "Illustrations by my fav AarzooAly",
    },
  ];

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-[#f5f4f3] pt-10">
      <Carousel_001 className="" images={images} showPagination loop />
    </div>
  );
};

export { Skiper47 };

const Carousel_001 = ({
  images,
  className,
  showPagination = false,
  showNavigation = false,
  loop = true,
  autoplay = false,
  spaceBetween = 40,
}: {
  images: { src: string | StaticImageData; alt: string }[];
  className?: string;
  showPagination?: boolean;
  showNavigation?: boolean;
  loop?: boolean;
  autoplay?: boolean;
  spaceBetween?: number;
}) => {
  const css = `
  .Carousal_001 {
    padding-bottom: 50px !important;
  }
  `;
  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        duration: 0.3,
        delay: 0.5,
      }}
      className={cn("w-3xl relative", className)}
    >
      <style>{css}</style>

      <Swiper
        spaceBetween={spaceBetween}
        autoplay={
          autoplay
            ? {
                delay: 1500,
                disableOnInteraction: false,
              }
            : false
        }
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        loop={loop}
        slidesPerView={2.43}
        coverflowEffect={{
          rotate: 0,
          slideShadows: false,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
        }}
        pagination={
          showPagination
            ? {
                clickable: true,
              }
            : false
        }
        navigation={
          showNavigation
            ? {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }
            : false
        }
        className="Carousal_001"
        modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
      >
        {images.map((image, index) => (
          <SwiperSlide
            key={index}
            className="h-80! w-full border hover:transform hover:-translate-y-2 hover:rounded-md"
          >
            <Link href={"/watches"}>
              <Image
                className="h-full w-full object-cover rounded-md hover:rounded-md"
                src={image.src}
                alt={image.alt}
                width={500}
                height={500}
              />
            </Link>
          </SwiperSlide>
        ))}
        {showNavigation && (
          <div>
            <div className="swiper-button-next after:hidden">
              <ChevronRightIcon className="h-6 w-6 text-white" />
            </div>
            <div className="swiper-button-prev after:hidden">
              <ChevronLeftIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        )}
      </Swiper>
    </motion.div>
  );
};

export { Carousel_001 };
