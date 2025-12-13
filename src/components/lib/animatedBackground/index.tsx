import "./styles.css";

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
      {/* Radial gradient spotlights with smooth random floating */}
      <div className="orb1 absolute top-0 left-0 w-[800px] h-[800px] bg-blue-600 rounded-full blur-[150px]" />
      <div className="orb2 absolute top-1/3 right-0 w-[700px] h-[700px] bg-purple-600 rounded-full blur-[150px]" />
      <div className="orb3 absolute bottom-0 left-1/2 w-[750px] h-[750px] bg-pink-600 rounded-full blur-[150px]" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
    </div>
  );
};

export default AnimatedBackground;
