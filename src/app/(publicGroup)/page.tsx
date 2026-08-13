import React from "react";
import AnimationCarousel from "./_components/HomeAnimation";
import HomeVideo from "./_components/HomeVideo";
import { Skiper47 } from "@/components/ui/skiper-ui/skiper47";
import LuxuryWatchStory from "@/components/ui/skiper-ui/skiper19";

const page = () => {
  return (
    <div>
      <AnimationCarousel />
      <HomeVideo />
      <Skiper47 />
      <LuxuryWatchStory />
    </div>
  );
};

export default page;
