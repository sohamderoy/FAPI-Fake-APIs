import HomeBanner from "@/components/modules/homebanner";

const Home = () => {
  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold text-gray-800">
        <HomeBanner></HomeBanner>
      </h1>
    </div>
  );
};

export default Home;
