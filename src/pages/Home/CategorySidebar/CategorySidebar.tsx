import { useEffect, useState, memo } from "react";
import { axiosRequest } from "../../../utils/token";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Smartphone,
  Shirt,
  Home,
  Dumbbell,
  Gift,
  Camera,
  Monitor,
  Watch,
  Headphones,
  Gamepad2,
  ChevronRight,
} from "lucide-react";

interface SubCategory {
  id: number;
  subCategoryName: string;
  categoryId: number;
}

interface Category {
  id: number;
  categoryName: string;
  categoryImage: string | null;
  subCategories?: SubCategory[];
}

interface SidebarProps {
  onSelectCategory: (id: number | null) => void;
  selectedId: number | null;
}

const getCategoryIcon = (categoryName: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    Electronics: <Smartphone size={20} strokeWidth={1.5} />,
    Fashion: <Shirt size={20} strokeWidth={1.5} />,
    "Home & Garden": <Home size={20} strokeWidth={1.5} />,
    Sports: <Dumbbell size={20} strokeWidth={1.5} />,
    Toys: <Gift size={20} strokeWidth={1.5} />,
    Camera: <Camera size={20} strokeWidth={1.5} />,
    Computers: <Monitor size={20} strokeWidth={1.5} />,
    SmartWatch: <Watch size={20} strokeWidth={1.5} />,
    HeadPhones: <Headphones size={20} strokeWidth={1.5} />,
    Gaming: <Gamepad2 size={20} strokeWidth={1.5} />,
  };
  return iconMap[categoryName] || <Smartphone size={20} strokeWidth={1.5} />;
};

const CategorySidebar = memo(
  ({ onSelectCategory, selectedId }: SidebarProps) => {
    const { t } = useTranslation();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await axiosRequest.get("/Category/get-categories");
        if (catRes.data?.statusCode === 200) {
          setCategories(catRes.data.data || []);
        } else {
          throw new Error(catRes.data?.message || "Категории не найдены");
        }
      } catch (err: unknown) {
        console.error("Ошибка при загрузке данных:", err);
        const error = err as { response?: { data?: { message?: string } }, message?: string };
        setError(error.response?.data?.message || error.message || "Ошибка");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCategoryClick = (categoryId: number) => {
    navigate(`/products?categoryId=${categoryId}`);
    onSelectCategory(categoryId);
  };

  const handleSubcategoryClick = (e: React.MouseEvent, subCatId: number) => {
    e.stopPropagation();
    navigate(`/products?subCategoryId=${subCatId}`);
    onSelectCategory(null);
  };

  if (loading) {
    return (
      <div className="w-full md:w-[240px] flex overflow-x-auto md:flex-col gap-[12px] pt-[20px] md:pr-[16px] md:border-r border-zinc-100 animate-pulse pb-4 md:pb-0 hide-scrollbar">
        {[...Array(6)].map((_, idx) => (
          <div key={idx} className="shrink-0 h-[40px] md:h-[24px] bg-zinc-200 rounded-full md:rounded w-[120px] md:w-full md:last:w-[80%]" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full md:w-[240px] text-red-500 text-sm pt-[20px] pr-[16px]">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full md:w-[240px] flex overflow-x-auto md:overflow-visible md:flex-col pt-[20px] md:pr-[16px] md:border-r border-zinc-100 font-sans select-none gap-3 md:gap-0 pb-4 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <button
        onClick={() => { navigate("/products"); onSelectCategory(null); }}
        className={`shrink-0 md:w-full text-left md:py-[10px] px-4 py-2 md:px-0 md:py-0 rounded-full md:rounded-none text-[14px] md:text-[15px] font-medium transition-all duration-300 flex items-center gap-2 md:pl-[4px] border md:border-transparent
          ${
            selectedId === null || selectedId === undefined
              ? "text-white bg-[#DB4444] md:text-[#DB4444] md:bg-transparent border-[#DB4444] font-semibold"
              : "text-zinc-800 dark:text-zinc-200 bg-zinc-50 dark:bg-zinc-800 md:bg-transparent border-zinc-200 hover:text-[#DB4444] hover:border-[#DB4444]"
          }`}
      >
        <span className="hidden md:inline">•</span>
        All Products
      </button>

      {categories.map((category) => {
        const isSelected = selectedId !== null && Number(selectedId) === Number(category.id);
        const categorySubcategories = category.subCategories || [];
        const hasSubcategories = categorySubcategories.length > 0;

        return (
          <div key={category.id} className="group relative shrink-0 md:w-full">
            <button
              onClick={() => handleCategoryClick(category.id)}
              className={`w-full flex items-center justify-between text-left md:py-[10px] px-4 py-2 md:px-0 md:py-0 rounded-full md:rounded-none text-[14px] md:text-[15px] font-medium transition-all duration-300 md:pl-[4px] border md:border-transparent relative z-10
                ${
                  isSelected
                    ? "text-white bg-[#DB4444] md:text-[#DB4444] md:bg-transparent border-[#DB4444] font-semibold"
                    : "text-zinc-800 dark:text-zinc-200 bg-zinc-50 dark:bg-zinc-800 md:bg-transparent border-zinc-200 hover:text-[#DB4444] hover:border-[#DB4444]"
                }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`transition-colors duration-300 ${
                    isSelected ? "text-white md:text-[#DB4444]" : "text-zinc-500 dark:text-zinc-400 group-hover:text-[#DB4444]"
                  }`}
                >
                  {getCategoryIcon(category.categoryName)}
                </span>
                <span className="truncate">{t(`dynamic.categories.${category.categoryName}`, category.categoryName)}</span>
              </div>
              {hasSubcategories && (
                <ChevronRight size={16} className={`hidden md:block transition-transform duration-300 ${isSelected ? "text-[#DB4444]" : "text-zinc-400 group-hover:text-[#DB4444] group-hover:translate-x-1"}`} />
              )}
            </button>

            {/* Flyout Menu (Desktop Only) */}
            {hasSubcategories && (
              <div className="hidden md:block absolute top-0 left-full ml-0 pl-4 w-[260px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] overflow-hidden animate-[fadeIn_0.2s_ease-out]">
                  <div className="px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-[13px] font-semibold text-zinc-900 dark:text-white uppercase tracking-wider">
                      {t(`dynamic.categories.${category.categoryName}`, category.categoryName)}
                    </span>
                  </div>
                  <div className="flex flex-col py-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                    {categorySubcategories.map(sub => (
                      <button
                        key={sub.id}
                        onClick={(e) => handleSubcategoryClick(e, sub.id)}
                        className="text-left px-5 py-2.5 text-[14px] text-zinc-600 dark:text-zinc-400 hover:text-[#DB4444] dark:hover:text-[#DB4444] hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors w-full group/sub"
                      >
                        <span className="group-hover/sub:translate-x-1 inline-block transition-transform duration-300">
                          {t(`dynamic.subcategories.${sub.subCategoryName}`, sub.subCategoryName)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
});

CategorySidebar.displayName = "CategorySidebar";
export default CategorySidebar;