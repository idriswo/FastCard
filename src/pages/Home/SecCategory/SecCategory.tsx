import { useEffect, useState, memo } from "react";
import { useTranslation } from 'react-i18next';
import svg from '../../../assets/dc40ba897215f42e5883a64157f0aa3a4d1a866a.jpg'

const SLIDES = [
  {
    id: 1,
    title: "iPhone 14 Series",
    discount: "Up to 10% off Voucher",
    svg:svg,
    linkText: "Shop Now",
    imgBg: "from-purple-900 to-indigo-950", 
    mockImgText: "📱 iPhone 14 Pro"
  },
  {
    id: 2,
    title: "Samsung S24 Ultra",
    discount: "New Era of Galaxy AI",
    linkText: "Explore Now",
    url: "https://www.samsung.com/global/galaxy/galaxy-s24-ultra/",
    svg: svg,
    imgBg: "from-zinc-800 to-zinc-950",
    mockImgText: "✨ Galaxy S24"
  },
  {
    id: 3,
    title: "MacBook Pro M3",
    discount: "Mind-blowing Performance",
    linkText: "Buy MacBook",
    url: "https://www.apple.com/macbook-pro/",
    svg: svg,
    imgBg: "from-slate-800 to-slate-950",
    mockImgText: "💻 MacBook M3"
  },
  {
    id: 4,
    title: "Sony WH-1000XM5",
    discount: "Your World. Nothing Else.",
    linkText: "Shop Audio",
    url: "https://electronics.sony.com/audio/headphones/headband/p/wh1000xm5-b",
    svg: svg,
    imgBg: "from-neutral-800 to-neutral-950",
    mockImgText: "🎧 Sony XM5"
  },
  {
    id: 5,
    title: "Apple Watch Ultra 2",
    discount: "Adventure Awaits Again",
    linkText: "Discover More",
    url: "https://www.apple.com/apple-watch-ultra-2/",
    svg: svg,
    imgBg: "from-amber-950 to-stone-950",
    mockImgText: "⌚ Watch Ultra"
  }
];

const SecCategory = memo(() => {
  const { t } = useTranslation();
  const [current, setCurrent] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full relative bg-black text-white rounded-sm overflow-hidden min-h-[420px] md:min-h-[380px] flex items-center font-sans select-none">
      
      {SLIDES.map((slide, index) => {
        const isActive = index === current;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full flex flex-col md:flex-row items-center justify-between px-[20px] sm:px-[30px] md:px-[60px] py-[30px] md:py-[40px] transition-all duration-700 ease-in-out ${
              isActive 
                ? "opacity-100 pointer-events-auto scale-100" 
                : "opacity-0 pointer-events-none scale-95"
            }`}
          >
            <div className="flex flex-col items-start justify-center flex-1 z-10 text-left w-full">
              <div className="flex items-center gap-[12px] mb-[12px] md:mb-[16px]">
                <svg
                  className="w-[20px] h-[24px] fill-white flex-shrink-0"
                  viewBox="0 0 170 170"
                >
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.92-14.37-6.13-3.41-2.73-7.39-7.48-11.93-14.22-5.71-8.55-10.14-18.42-13.29-29.62-3.15-11.2-4.72-21.67-4.72-31.41 0-14.88 3.73-26.6 11.19-35.15 7.46-8.55 16.51-12.92 27.15-13.11 5.04-.13 10.64 1.41 16.8 4.63 6.16 3.22 10.59 4.82 13.29 4.82 2.32 0 6.81-1.61 13.47-4.82 6.66-3.22 11.96-4.69 15.92-4.42 11.17.65 20.08 4.89 26.75 12.7 5.09 6.01 8.78 13.29 11.07 21.84-12.39 5.04-20.57 12.7-24.53 23-3.96 10.29-4.14 21.2-.54 32.74 3.6 11.28 9.54 19.38 17.84 24.31 2.32 1.41 4.7 2.65 7.15 3.72-.82 2.4-1.65 4.83-2.51 7.29zm-26.07-123.51c0 7.84-2.88 15.11-8.65 21.81-5.77 6.7-12.8 10.96-21.09 12.79.16-7.31 3.03-14.54 8.62-21.69 5.59-7.15 12.87-11.63 21.84-13.44.42 1.93.43 3.69.43 5.4c-.15.43-.15.75-.15 1.13z" />
                </svg>
                <p className="text-[14px] md:text-[16px] text-zinc-300 tracking-wide font-normal">
                  {t(`dynamic.slides.${slide.title}`, slide.title)}
                </p>
              </div>
              
              <h2 className="text-[28px] sm:text-[32px] md:text-[48px] font-bold tracking-tight leading-[1.2] mb-[20px] md:mb-[24px] max-w-[350px]">
                {t(`dynamic.slides.${slide.title}_discount`, slide.discount)}
              </h2>
              
              <a
                href="#shop"
                className="flex items-center gap-[8px] text-[15px] md:text-[16px] font-medium border-b border-zinc-400 dark:border-zinc-700 pb-[4px] hover:text-[#DB4444] hover:border-[#DB4444] transition-all duration-300 group/btn"
              >
                <p>{t(`dynamic.slides.${slide.title}_linkText`, slide.linkText)}</p>
                <p className="transform group-hover/btn:translate-x-1 transition-transform duration-300">➔</p>
              </a>
            </div>

            <div className="flex-1 w-full flex items-center justify-center mt-6 md:mt-0 relative h-[180px] md:h-full">
               <img src={slide.svg} alt="" />
            </div>
          </div>
        );
      })}

      <div className="absolute bottom-[15px] md:bottom-[20px] left-0 right-0 flex justify-center items-center gap-[12px] z-20">
        {SLIDES.map((_, index) => {
          const isSelected = index === current;
          return (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`transition-all duration-300 rounded-full ${
                isSelected 
                  ? "w-[12px] h-[12px] bg-[#DB4444] border-[2px] border-white scale-110" 
                  : "w-[8px] h-[8px] bg-zinc-50 dark:bg-zinc-8000 hover:bg-zinc-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          );
        })}
      </div>

    </div>
  );
});

SecCategory.displayName = "SecCategory";

export default SecCategory;