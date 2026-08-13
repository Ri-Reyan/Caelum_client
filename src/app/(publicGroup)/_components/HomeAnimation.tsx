"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

type AnimationCardProps = {
  prefix: string;
  title: string;
  description: string;
  frameCount: number;
};

const padFrame = (index: number) => String(index).padStart(3, "0");

const buildFrames = (prefix: string, length: number) =>
  Array.from(
    { length },
    (_, index) =>
      `/animations/${prefix}/ezgif-frame-${padFrame(index + 1)}.jpg`,
  );

function AnimationCard({ prefix, title, frameCount }: AnimationCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const frames = useMemo(
    () => buildFrames(prefix, frameCount),
    [prefix, frameCount],
  );

  const [frameIndex, setFrameIndex] = useState(0);
  const progressRef = useRef(0);

  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const card = cardRef.current;

    if (!card) return;

    const handleWheel = (event: WheelEvent) => {
      if (!isHovering) return;

      event.preventDefault();

      const sensitivity = 0.0008;

      progressRef.current += event.deltaY * sensitivity;

      progressRef.current = Math.max(0, Math.min(1, progressRef.current));

      const nextFrame = Math.round(progressRef.current * (frames.length - 1));

      setFrameIndex(nextFrame);
    };

    card.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    return () => {
      card.removeEventListener("wheel", handleWheel);
    };
  }, [frames.length, isHovering]);

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="
        relative
        w-[40vw]
        max-w-5xl
        shrink-0
        snap-center
        rounded-[2rem]
        bg-[#B7A57A]
        shadow-2xl
      "
    >
      <div className="relative">
        <div
          className="
            sticky
            top-0
            flex
            items-center
            p-5
            md:p-8
          "
        >
          <div className="w-full">
            <div
              className="
                overflow-hidden
                rounded-3xl
              "
            >
              <div className="relative aspect-video">
                <Image
                  src={frames[frameIndex]}
                  alt={`${title} animation`}
                  fill
                  priority
                  className="object-cover"
                  draggable={false}
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AnimationCarousel() {
  return (
    <section className="py-20 hidden md:hidden lg:block xl:block bg-[#F4F1EA]">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-10 px-6">
          <p className="text-sm uppercase tracking-[0.3em] text-black/40">
            Explore
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-6xl text-[#111111]">
            Scroll through our work
          </h1>
        </div>

        <div
          className="
            flex
            gap-6
            overflow-x-auto
            px-6
            pb-8
            snap-x
            snap-mandatory
            scrollbar-none
          "
        >
          <AnimationCard
            prefix="ezgif-1-jpg"
            title="Animation One"
            description="Scroll inside the card to control the animation."
            frameCount={282}
          />

          <AnimationCard
            prefix="ezgif-2-jpg"
            title="Animation Two"
            description="Scroll inside the card to control the animation."
            frameCount={240}
          />
        </div>
      </div>
    </section>
  );
}
