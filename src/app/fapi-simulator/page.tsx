"use client";

import Button from "@/components/lib/button";
import FapiSimulationCard from "@/components/modules/fapiSimulationCard";
import { useRouter } from "next/router";

const FapiSimulatorPage = () => {
  //   const router = useRouter();

  return (
    <div className="min-h-screen bg-black p-6 border border-red-600">
      <div className="max-w-7xl mx-auto border border-blue-400">
        {/* Header Section - Title and Create FAPI Button*/}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-outfit">
            FAPI Simulator
          </h1>
          <Button name="Create New FAPI"></Button>
        </div>

        {/* FAPI Simulation Cards */}
        <div className="space-y-6">
          <p className="text-gray-400 text-center py-12">
            FAPI CARDS PLACEHOLDER
          </p>
          <FapiSimulationCard></FapiSimulationCard>
        </div>
      </div>
    </div>
  );
};

export default FapiSimulatorPage;
