import { memo, useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';

import img1 from '../../../assets/3cc943ca7e210f637fc0504b7d93cd207df744c2.png'

const PromoBanner = memo(() => {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState({
    days: 5,
    hours: 23,
    minutes: 59,
    seconds: 35,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              hours = 23;
              if (days > 0) {
                days--;
              }
            }
          }
        }
        
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-[1400px] mx-auto px-[16px] md:px-[32px] mt-[60px] mb-[70px] font-sans">
      <div 
        data-aos="fade-up" 
        data-aos-duration="800"
        className="w-full bg-black flex flex-col-reverse md:flex-row items-center justify-between p-[40px] md:p-[60px] lg:px-[80px] lg:py-[20px] rounded-[4px]"
      >
        <div className="flex flex-col items-start w-full md:w-1/2">
          <span className="text-[#00FF66] text-[16px] font-semibold mb-[24px]">
            {t('home.categories')}
          </span>
          
          <h2 className="text-white text-[48px] font-semibold leading-[1.2] tracking-wider mb-[32px] max-w-[450px]">
            {t('home.enhanceMusicExperience', 'Enhance Your Music Experience')}
          </h2>
          
          <div className="flex gap-[24px] mb-[40px]">
            <div className="w-[62px] h-[62px] bg-white dark:bg-zinc-900 rounded-full flex flex-col items-center justify-center shadow-sm">
              <span className="text-black dark:text-white text-[16px] font-bold leading-none">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="text-black dark:text-white text-[11px] font-medium mt-[2px]">{t('home.hours', 'Hours')}</span>
            </div>
            
            <div className="w-[62px] h-[62px] bg-white dark:bg-zinc-900 rounded-full flex flex-col items-center justify-center shadow-sm">
              <span className="text-black dark:text-white text-[16px] font-bold leading-none">{String(timeLeft.days).padStart(2, '0')}</span>
              <span className="text-black dark:text-white text-[11px] font-medium mt-[2px]">{t('home.days', 'Days')}</span>
            </div>
            
            <div className="w-[62px] h-[62px] bg-white dark:bg-zinc-900 rounded-full flex flex-col items-center justify-center shadow-sm">
              <span className="text-black dark:text-white text-[16px] font-bold leading-none">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="text-black dark:text-white text-[11px] font-medium mt-[2px]">{t('home.minutes', 'Minutes')}</span>
            </div>
            
            <div className="w-[62px] h-[62px] bg-white dark:bg-zinc-900 rounded-full flex flex-col items-center justify-center shadow-sm">
              <span className="text-black dark:text-white text-[16px] font-bold leading-none">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="text-black dark:text-white text-[11px] font-medium mt-[2px]">{t('home.seconds', 'Seconds')}</span>
            </div>
          </div>
          
          <button className="bg-[#00FF66] hover:bg-[#00e65c] text-black dark:text-white text-[16px] font-semibold px-[48px] py-[16px] rounded-[4px] transition-colors duration-300">
            {t('product.buyNow', 'Buy Now')}
          </button>
        </div>
        
        <div className="w-full md:w-1/2 flex justify-center md:justify-end mb-[40px] md:mb-0 relative">
          <div className="absolute inset-0 bg-[#D9D9D9] opacity-[0.3] blur-[100px] rounded-full w-[85%] h-[85%] top-[10%] left-[10%] z-0"></div>
          
          <img 
            src={img1} 
            alt="JBL Boombox" 
            className="w-full max-w-[700px] object-contain drop-shadow-[0_0_40px_rgba(255,255,255,0.15)] z-10 transition-transform duration-500 hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = img1;
            }}
          />
        </div>
      </div>
    </div>
  );
});

export default PromoBanner;
