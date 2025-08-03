"use client";

import FeaturesSectionDemo from "@/components/Landing/Features";
import Footer from "@/components/Landing/Footer";
import AnimatedHeading from "@/components/Landing/Heading";
import TimelineDemo from "@/components/Landing/Timeline";
import Spline from "@splinetool/react-spline";
import React from "react";

const Page = () => {
  return (
    <div>
      <AnimatedHeading />
      {/* <div
        className="min-h-screen relative"
        style={{
          backgroundColor: "#0A0A0F",
        }}
      >
        {/* Container for text and Spline with relative positioning */}
        {/* <div className="relative w-full max-w-[428px] mx-auto h-[80vh]"> */}
          {/* Text overlay */}
          {/* <div className="absolute top-1/4 left-1/2 -translate-x-1/2 z-10 w-full text-center px-4">
            <h2 className="text-white text-3xl font-bold">Just a based guy</h2>
          </div> */}

          {/* Spline container */}
          {/* <div className="w-full">
            <Spline
              scene={`https://prod.spline.design/${process.env.NEXT_PUBLIC_SPLINE}/scene.splinecode`}
            />
          </div>
        </div> */}
      {/* </div> */} 
      <FeaturesSectionDemo />
      <TimelineDemo />
      <Footer />
    </div>
  );
};

export default Page;
