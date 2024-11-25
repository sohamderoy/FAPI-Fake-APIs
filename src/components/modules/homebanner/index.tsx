import React from "react";
import { HomeBannerProps } from "./types";
import { BANNER_DATA } from "./data";
import { getGradientStyles } from "./utils";
import FeatureCard from "../featureCard";
import Button from "@/components/lib/button";

const HomeBanner = ({
  title = BANNER_DATA.defaultTitle,
  subtitle = BANNER_DATA.defaultSubtitle,
}: HomeBannerProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
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

        <div className="mt-12 flex gap-4 justify-center">
          {/* Create Mock API button */}
          <Button name="Create Mock API" />

          {/* Upload Mock API Generator JSON button */}
          <Button name="Upload Mock API Creator JSON" />
        </div>

        {/* Feature highlights */}

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
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
