import HomeBanner from "@/components/modules/homebanner";
import AnimatedBackground from "@/components/lib/animatedBackground";

const Home = () => {
  return (
    <div className="h-screen overflow-y-auto overflow-hidden">
      <AnimatedBackground />
      <HomeBanner></HomeBanner>
    </div>
  );
};

export default Home;
