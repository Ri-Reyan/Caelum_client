"use client";

const HomeVideo = () => {
  return (
    <section className="py-20 text-white lg:hidden bg-[#F4F1EA]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 px-6">
          <p className="text-sm uppercase tracking-[0.3em] text-yellow-700">
            Featured Experiences
          </p>

          <p className="mt-4 max-w-md text-green-900">
            Explore our latest interactive experiences and motion designs.
          </p>
        </div>

        <div className="flex gap-5 overflow-x-scroll px-6 pb-6 snap-x snap-mandatory p-2">
          <video
            src={"/animations/videos/video1.mp4"}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="aspect-video w-full object-cover rounded-md"
          />
        </div>
      </div>
    </section>
  );
};

export default HomeVideo;
