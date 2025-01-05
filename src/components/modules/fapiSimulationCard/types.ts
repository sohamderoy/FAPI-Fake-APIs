import { EndpointDetails } from "@/store/types/endpoints";
import { FapiEndpoint, HttpMethods } from "@/types/fapi";

export interface FapiSimulationCardProps {
  endpoint?: FapiEndpoint;
}

export interface EndpointsListForFapiSimulationCard {
  path: string;
  method: HttpMethods;
  details: EndpointDetails;
}
