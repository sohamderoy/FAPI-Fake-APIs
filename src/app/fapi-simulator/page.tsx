"use client";

import Button from "@/components/lib/button";
import FapiSimulationCard from "@/components/modules/fapiSimulationCard";
import { useRouter } from "next/router";

const FapiSimulatorPage = () => {
  const mockEndpoints = [
    {
      id: "1",
      path: "/api/users",
      method: "GET",
      responseCode: 200,
      responseDelay: 0,
      response: {},
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      path: "/api/products",
      method: "POST",
      responseCode: 201,
      responseDelay: 2000,
      response: {},
      createdAt: new Date().toISOString(),
    },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-tl from-black via-gray-900 to-black p-6">
      <div className="backdrop-blur-3xl bg-black/20 min-h-screen fixed inset-0 -z-10" />
      <div className="max-w-[1440px] mx-auto">
        {/* Header Section - Title and Create FAPI Button*/}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-outfit">
            FAPI Simulator
          </h1>
          <Button name="Create New FAPI"></Button>
        </div>

        {/* FAPI Simulation Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
          <FapiSimulationCard></FapiSimulationCard>
          <FapiSimulationCard></FapiSimulationCard>
          <FapiSimulationCard></FapiSimulationCard>
          <FapiSimulationCard></FapiSimulationCard>
          <FapiSimulationCard></FapiSimulationCard>
          <FapiSimulationCard></FapiSimulationCard>
          <FapiSimulationCard></FapiSimulationCard>
          <FapiSimulationCard></FapiSimulationCard>
          <FapiSimulationCard></FapiSimulationCard>
          <FapiSimulationCard></FapiSimulationCard>
          <FapiSimulationCard></FapiSimulationCard>
          <FapiSimulationCard></FapiSimulationCard>
        </div>
      </div>
    </div>
  );
};

export default FapiSimulatorPage;
