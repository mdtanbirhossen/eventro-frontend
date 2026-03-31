import FeaturedEventSection from "@/components/modules/Events/FeaturedEventSection";
import CarouselPlugin from "@/components/modules/Home/Banner/Banner";
import CategoriesSection from "@/components/modules/Home/CategoriesSection/CategoriesSection";
import HowItWorksSection from "@/components/modules/Home/HowItWorksSection/HowItWorksSection";
import LatestEventsSection from "@/components/modules/Home/LatestEventsSection/LatestEventsSection";


export default function HomePage() {


  return (
    <div className="mt-5 px-2 md:px-5">
      <CarouselPlugin />


      <div className="max-w-7xl mx-auto ">

        <FeaturedEventSection className="mt-10" />
        <CategoriesSection className="mt-10" />
        <LatestEventsSection />
        <HowItWorksSection />
      </div>
    </div>
  );
}