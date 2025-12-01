"use client";

import Button from "@/components/lib/button";
import SpeedDial from "@/components/lib/speedDial";
import { SpeedDialAction } from "@/components/lib/speedDial/types";
import EndpointModal from "@/components/modules/endpointModal";
import FapiSimulationCard from "@/components/modules/fapiSimulationCard";
import { EndpointsListForFapiSimulationCard } from "@/components/modules/fapiSimulationCard/types";
import { RootState } from "@/store/store";
import { HttpMethods } from "@/types/fapi";
import { PlusCircle, Upload, Download } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";

const FAPI_SPEED_DIAL_ACTIONS: SpeedDialAction[] = [
  {
    icon: PlusCircle,
    name: "Create FAPI",
    action: "create",
  },
  {
    icon: Download,
    name: "Export FAPI Details",
    action: "export",
  },
  {
    icon: Upload,
    name: "Import FAPI Details",
    action: "import",
  },
];

const FapiSimulatorPage = () => {
  const endpoints = useSelector(
    (state: RootState) => state.endpoints.endpoints
  );
  const [isCreateEndpointModalOpen, setIsCreateEndpointModalOpen] =
    useState<boolean>(false);
  const handleOpenCreateEndpointModal = () =>
    setIsCreateEndpointModalOpen(true);
  const handleCloseCreateEndpointModal = () =>
    setIsCreateEndpointModalOpen(false);

  const endpointsList: EndpointsListForFapiSimulationCard[] = Object.entries(
    endpoints
  ).map(([key, details]) => {
    const [method, ...pathParts] = key.split(" ");
    return {
      path: pathParts.join(" "),
      method: method as HttpMethods,
      details,
    };
  });

  const handleSpeedDialAction = (action: string) => {
    switch (action) {
      case "create":
        handleOpenCreateEndpointModal();
        break;
      case "export":
        console.log("Export Speed dial clicked");
        break;
      case "import":
        console.log("Import Speed dial clicked");
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tl from-black via-gray-900 to-black p-6">
      <div className="backdrop-blur-3xl bg-black/20 min-h-screen fixed inset-0 -z-10" />
      <div className="max-w-[1440px] mx-auto">
        {/* Header Section - Title and Create FAPI Button*/}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-outfit">
            FAPI Simulator
          </h1>
          <Button
            onClick={handleOpenCreateEndpointModal}
            name="Create New FAPI"
          ></Button>
        </div>

        {/* FAPI Simulation Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
          {endpointsList.map((endpoint, index) => (
            <FapiSimulationCard
              key={index}
              method={endpoint.method}
              path={endpoint.path}
              details={endpoint.details}
            ></FapiSimulationCard>
          ))}
        </div>
      </div>

      {/* Speed Dial */}
      <SpeedDial
        actions={FAPI_SPEED_DIAL_ACTIONS}
        onActionClick={handleSpeedDialAction}
      ></SpeedDial>

      <EndpointModal
        isOpen={isCreateEndpointModalOpen}
        onClose={handleCloseCreateEndpointModal}
      ></EndpointModal>
    </div>
  );
};

export default FapiSimulatorPage;
