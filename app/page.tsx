import HeroSection from "@/components/HeroSection";
import ShuttlecockPath from "@/components/ShuttlecockPath";

export default function Home() {
  return (
    <div className="relative w-full font-sans antialiased">
      <HeroSection />
      <div className="relative h-[500vh] w-full">
        <ShuttlecockPath />
      </div>
    </div>
  );
}
