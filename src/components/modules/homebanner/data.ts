import { Zap, Clock, Shield, Server } from "lucide-react";

export const BANNER_DATA = {
  defaultTitle: "FAPI",
  defaultSubtitle:
    "Create & simulate mock APIs within seconds, for rapid & independent frontend development",
  alternativeTaglines: [
    "Empowering frontend developers with instant mock APIs",
    "Create, customize, and deploy mock APIs in seconds",
    "Your local API mocking companion for seamless development",
  ],
  features: [
    {
      title: "Quick Setup",
      description: "Create mock APIs in seconds with intuitive interface",
      icon: Zap,
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      title: "Simulate Response",
      description:
        "Customize status codes, delays, and response bodies to simulate any user flow with ease",
      icon: Clock,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "100% Local & Private",
      description: "No data leaves your machine, runs completely offline",
      icon: Shield,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      title: "Multi Instance Support",
      description:
        "Run multiple instances of FAPI on different ports to support multiple UI project development and testing",
      icon: Server,
      gradient: "from-purple-500 to-pink-500",
    },
  ],
} as const;
