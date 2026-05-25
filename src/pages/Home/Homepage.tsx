import { useState } from "react";
import CategorySidebar from "./CategorySidebar/CategorySidebar";
import SecCategory from "./SecCategory/SecCategory"; 
import SecFlashSales from "./SecFlashSales/SecFlashSales";
import BrowseByCategory from "./BrowseByCategory/BrowseByCategory";
import BestProducts from "./BestProducts/BestProducts";
import PromoBanner from "./PromoBanner/PromoBanner";
import ExploreProducts from "./ExploreProducts/ExploreProducts";
import NewArrival from "./NewArrival/NewArrival";
import Services from "./Services/Services";
import { ArrowUp } from "lucide-react";   

const Homepage = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  return (
    <div className="w-full max-w-[1400px] mx-auto px-[16px] md:px-[32px] font-sans overflow-x-hidden">

      <div className="flex flex-col md:flex-row gap-[40px] mb-[60px]">
        <div data-aos="fade-right" data-aos-duration="800">
          <CategorySidebar
            selectedId={selectedCategoryId}
            onSelectCategory={(id) => setSelectedCategoryId(id)}
          />
        </div>

        <div className="flex-1 pt-[40px]" data-aos="fade-left" data-aos-duration="1000" data-aos-delay="200">
          <SecCategory />
        </div>
      </div>

      <div className="w-full" data-aos="fade-up" data-aos-duration="800">
        <SecFlashSales />
      </div>
      
      <div data-aos="fade-up" data-aos-duration="800">
        <BrowseByCategory 
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={(id) => setSelectedCategoryId(id)}
        />
      </div>
      
      <div data-aos="fade-up" data-aos-duration="800">
        <BestProducts />
      </div>

      <PromoBanner />
      
      <div data-aos="fade-up" data-aos-duration="800">
        <ExploreProducts />
      </div>

      <div data-aos="fade-up" data-aos-duration="800">
        <NewArrival />
      </div>

      <Services />

      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-[40px] right-[40px] w-[46px] h-[46px] bg-[#F5F5F5] dark:bg-zinc-800 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors z-50 shadow-sm"
        aria-label="Scroll to top"
      >
        <ArrowUp size={24} strokeWidth={1.5} className="text-black dark:text-white" />
      </button>
    </div>
  );
};

export default Homepage;