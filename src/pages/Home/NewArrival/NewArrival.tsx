import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import img1 from '../../../assets/1c360f790c1817d3afa266b3c9f8c81ff0ed4428 (1).png'
import img2 from '../../../assets/455c8d6408463f7e8f57dd3048a2444dbfa0cb90.jpg'
import img3 from '../../../assets/e5659d572977438364a41d7e8c9d1e9a794d43ed.png'
import img4 from '../../../assets/15315cd15102562cf220504d288fa568eaa816dd.png'

const NewArrival = memo(() => {
  const { t } = useTranslation();
  return (
    <div className="w-full max-w-[1400px] mx-auto py-[60px] font-sans px-[16px]">
      <div className="flex flex-col gap-[8px] mb-[40px]">
        <div className="flex items-center gap-[12px]">
          <div className="w-[20px] h-[40px] bg-[#DB4444] rounded-[4px]"></div>
          <span className="text-[#DB4444] font-semibold text-[14px]">{t('home.featured')}</span>
        </div>
        <h2 className="text-[32px] sm:text-[36px] font-bold tracking-wide text-black dark:text-white mt-[8px]">
          {t('home.newArrival')}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[30px]">
        <div className="bg-black rounded-[4px] relative overflow-hidden h-[400px] lg:h-[600px] group flex items-end p-[32px]">
          <img 
            src={img1} 
            alt="PlayStation 5" 
            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          <div className="relative z-10 flex flex-col items-start gap-[12px]">
            <h3 className="text-white text-[24px] font-semibold tracking-wide">{t('home.ps5Title', 'PlayStation 5')}</h3>
            <p className="text-[#FAFAFA] text-[14px] max-w-[250px] leading-relaxed opacity-80">
              {t('home.ps5Desc', 'Black and White version of the PS5 coming out on sale.')}
            </p>
            <button className="text-white text-[16px] font-medium underline underline-offset-4 decoration-gray-400 hover:decoration-white transition-colors mt-[4px]">
              {t('home.shopNow', 'Shop Now')}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-[30px]">
          <div className="bg-[#0D0D0D] rounded-[4px] relative overflow-hidden h-[285px] group flex items-end p-[24px]">
            <img 
              src={img2} 
              alt="Women's Collections" 
              className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
              style={{ objectPosition: 'top' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
            
            <div className="relative z-10 flex flex-col items-start gap-[12px]">
              <h3 className="text-white text-[24px] font-semibold tracking-wide">{t('home.womensCollectionsTitle', 'Women\'s Collections')}</h3>
              <p className="text-[#FAFAFA] text-[14px] max-w-[280px] leading-relaxed opacity-80">
                {t('home.womensCollectionsDesc', 'Featured woman collections that give you another vibe.')}
              </p>
              <button className="text-white text-[16px] font-medium underline underline-offset-4 decoration-gray-400 hover:decoration-white transition-colors mt-[4px]">
                {t('home.shopNow', 'Shop Now')}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[30px] h-auto lg:h-[285px]">
            <div className="bg-[#121212] rounded-[4px] relative overflow-hidden h-[250px] lg:h-full group flex items-end p-[24px]">
              <div className="absolute inset-0 flex justify-center items-center p-[20px]">
                <div className="absolute inset-0 bg-[#D9D9D9] opacity-[0.2] blur-[80px] rounded-full w-[80%] h-[80%] top-[10%] left-[10%] z-0"></div>
                <img 
                  src={img3} 
                  alt="Speakers" 
                  className="w-[70%] object-contain z-10 group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-10"></div>
              
              <div className="relative z-20 flex flex-col items-start gap-[8px]">
                <h3 className="text-white text-[24px] font-semibold tracking-wide">{t('home.speakersTitle', 'Speakers')}</h3>
                <p className="text-[#FAFAFA] text-[14px] leading-relaxed opacity-80">
                  {t('home.speakersDesc', 'Amazon wireless speakers')}
                </p>
                <button className="text-white text-[16px] font-medium underline underline-offset-4 decoration-gray-400 hover:decoration-white transition-colors mt-[4px]">
                  {t('home.shopNow', 'Shop Now')}
                </button>
              </div>
            </div>

            <div className="bg-[#121212] rounded-[4px] relative overflow-hidden h-[250px] lg:h-full group flex items-end p-[24px]">
              <div className="absolute inset-0 flex justify-center items-center p-[20px]">
                <div className="absolute inset-0 bg-[#D9D9D9] opacity-[0.2] blur-[80px] rounded-full w-[80%] h-[80%] top-[10%] left-[10%] z-0"></div>
                <img 
                  src={img4} 
                  alt="Perfume" 
                  className="w-[70%] object-contain z-10 group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-10"></div>
              
              <div className="relative z-20 flex flex-col items-start gap-[8px]">
                <h3 className="text-white text-[24px] font-semibold tracking-wide">{t('home.perfumeTitle', 'Perfume')}</h3>
                <p className="text-[#FAFAFA] text-[14px] leading-relaxed opacity-80">
                  {t('home.perfumeDesc', 'GUCCI INTENSE OUD EDP')}
                </p>
                <button className="text-white text-[16px] font-medium underline underline-offset-4 decoration-gray-400 hover:decoration-white transition-colors mt-[4px]">
                  {t('home.shopNow', 'Shop Now')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default NewArrival;
