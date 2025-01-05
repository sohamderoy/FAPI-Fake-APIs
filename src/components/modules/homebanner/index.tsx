"use client";

import React, { useState } from "react";
import { HomeBannerProps } from "./types";
import { BANNER_DATA } from "./data";
import { getGradientStyles } from "./utils";
import FeatureCard from "../featureCard";
import Button from "@/components/lib/button";
import { useRouter } from "next/navigation";
import { FAPI_SIMULATOR_PAGE_PATH } from "@/utils/data/paths/paths.ui.constants";

const HomeBanner = ({
  title = BANNER_DATA.defaultTitle,
  subtitle = BANNER_DATA.defaultSubtitle,
}: HomeBannerProps) => {
  const router = useRouter();
  const handleNavigateToSimulator = () => {
    router.push(FAPI_SIMULATOR_PAGE_PATH);
  };
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4">
      <div className="text-center max-w-3xl mx-auto">
        <h1
          className="text-6xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 font-outfit tracking-[10px]"
          style={getGradientStyles()}
        >
          {title}
        </h1>
        <p className="text-xl text-gray-200 leading-relaxed font-outfit font-light">
          {subtitle}
        </p>

        {/* Quick action buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Button name="Let's Go !!!" onClick={handleNavigateToSimulator} />
        </div>

        {/* Feature highlights */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {BANNER_DATA.features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;
