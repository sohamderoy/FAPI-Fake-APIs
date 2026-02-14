"use client";

import React from "react";
import { SUBTITLE, FEATURE_CARDS_DATA } from "./data";
import { FeatureCard } from "@/components";
import { Button, AnimatedBackground, AppName } from "@/lib";
import { useRouter } from "next/navigation";
import { FAPI_SIMULATOR_PAGE_PATH } from "@/utils/data";
import { ArrowRight, Rocket } from "lucide-react";

const HomePage = () => {
  const router = useRouter();
  const handleNavigateToSimulator = () => {
    router.push(FAPI_SIMULATOR_PAGE_PATH);
  };
  return (
    <div className="min-h-screen overflow-y-auto">
      <AnimatedBackground />
      <div className="flex flex-col items-center justify-center min-h-screen w-full py-12 px-4">
        <div className="text-center max-w-3xl mx-auto">
          <AppName logoWidth={350} logoHeight={126} />
          <p className="mt-2 text-lg text-gray-200 leading-relaxed font-googleSansFlex font-light whitespace-nowrap">
            {SUBTITLE}
          </p>

          {/* Hero CTA Card */}
          <div className="mt-12">
            <div
              onClick={handleNavigateToSimulator}
              className="group relative w-full cursor-pointer rounded-2xl p-[2px] bg-gradient-to-r from-[#0EA5E9] via-[#8B5CF6] to-[#EC4899] transition-all duration-300 hover:shadow-[0_0_40px_rgba(139,92,246,0.4)] hover:scale-[1.01]"
            >
              {/* Animated gradient glow on hover */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-40 transition duration-500"></div>

              {/* Main card container */}
              <div className="relative h-full p-8 bg-black rounded-2xl font-googleSansFlex">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      <Rocket
                        className="w-10 h-10 text-purple-400 group-hover:text-purple-300 transition-colors duration-300"
                        strokeWidth={2}
                      />
                    </div>
                    <div className="flex flex-col items-start">
                      <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                        Create your FAPIs in seconds
                      </h3>
                    </div>
                  </div>
                  <ArrowRight
                    className="w-8 h-8 text-purple-400 group-hover:translate-x-2 group-hover:text-purple-300 transition-all duration-300 flex-shrink-0"
                    strokeWidth={2.5}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Feature highlights */}

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {FEATURE_CARDS_DATA.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                iconColor={feature.iconColor}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
