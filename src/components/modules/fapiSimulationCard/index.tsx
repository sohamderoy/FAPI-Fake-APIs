import Card from "@/components/lib/card";

const FapiSimulationCard = () => {
  return (
    <>
      <Card borderGradient="hover" height="md">
        <div className="text-white">Simulation Card Content</div>
      </Card>

      <Card borderGradient={true} height="md">
        <div className="text-white">Feature Card Content</div>
      </Card>
    </>
  );
};

export default FapiSimulationCard;
