import { Zap, Clock, Shield, Server } from "lucide-react";
import { FeatureCardData } from "./types";

export const SUBTITLE =
  "Create & simulate Fake APIs (FAPIs) within seconds, for rapid & independent frontend development";

export const FEATURE_CARDS_DATA: FeatureCardData[] = [
  {
    title: "Quick Setup",
    description: "Create mock APIs in seconds with intuitive interface",
    icon: Zap,
    iconColor: "text-yellow-400",
  },
  {
    title: "Simulate Response",
    description:
      "Customize status codes, delays, and response bodies to simulate any user flow with ease",
    icon: Clock,
    iconColor: "text-blue-400",
  },
  {
    title: "100% Local & Private",
    description: "No data leaves your machine, runs completely offline",
    icon: Shield,
    iconColor: "text-green-400",
  },
  {
    title: "Multi Instance Support",
    description:
      "Run multiple instances of FAPI on different ports to support multiple UI project development and testing",
    icon: Server,
    iconColor: "text-purple-400",
  },
];
