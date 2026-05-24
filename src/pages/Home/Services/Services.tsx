import { memo } from 'react';
import { Truck, Headphones, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Services = memo(() => {
  const { t } = useTranslation();
  return (
    <div className="w-full max-w-[1400px] mx-auto py-[60px] md:py-[100px] font-sans px-[16px]">
      <div className="flex flex-col md:flex-row items-center justify-center gap-[40px] md:gap-[88px]">
        
        {/* Service 1 */}
        <div className="flex flex-col items-center justify-center text-center group" data-aos="fade-up" data-aos-delay="0">
          <div className="w-[80px] h-[80px] rounded-full bg-[#C1C0C1] flex items-center justify-center mb-[24px] group-hover:bg-gray-400 transition-colors duration-300">
            <div className="w-[58px] h-[58px] rounded-full bg-black flex items-center justify-center text-white">
              <Truck size={32} strokeWidth={1.5} />
            </div>
          </div>
          <h3 className="text-[20px] font-bold text-black dark:text-white mb-[8px] tracking-wide">
            {t('home.freeDelivery', 'FREE AND FAST DELIVERY')}
          </h3>
          <p className="text-[14px] text-gray-800 dark:text-zinc-100 font-medium">
            {t('home.freeDeliveryDesc', 'Free delivery for all orders over $140')}
          </p>
        </div>

        {/* Service 2 */}
        <div className="flex flex-col items-center justify-center text-center group" data-aos="fade-up" data-aos-delay="100">
          <div className="w-[80px] h-[80px] rounded-full bg-[#C1C0C1] flex items-center justify-center mb-[24px] group-hover:bg-gray-400 transition-colors duration-300">
            <div className="w-[58px] h-[58px] rounded-full bg-black flex items-center justify-center text-white">
              <Headphones size={32} strokeWidth={1.5} />
            </div>
          </div>
          <h3 className="text-[20px] font-bold text-black dark:text-white mb-[8px] tracking-wide">
            {t('home.customerService', '24/7 CUSTOMER SERVICE')}
          </h3>
          <p className="text-[14px] text-gray-800 dark:text-zinc-100 font-medium">
            {t('home.customerServiceDesc', 'Friendly 24/7 customer support')}
          </p>
        </div>

        {/* Service 3 */}
        <div className="flex flex-col items-center justify-center text-center group" data-aos="fade-up" data-aos-delay="200">
          <div className="w-[80px] h-[80px] rounded-full bg-[#C1C0C1] flex items-center justify-center mb-[24px] group-hover:bg-gray-400 transition-colors duration-300">
            <div className="w-[58px] h-[58px] rounded-full bg-black flex items-center justify-center text-white">
              <ShieldCheck size={32} strokeWidth={1.5} />
            </div>
          </div>
          <h3 className="text-[20px] font-bold text-black dark:text-white mb-[8px] tracking-wide">
            {t('home.moneyBack', 'MONEY BACK GUARANTEE')}
          </h3>
          <p className="text-[14px] text-gray-800 dark:text-zinc-100 font-medium">
            {t('home.moneyBackDesc', 'We return money within 30 days')}
          </p>
        </div>

      </div>
    </div>
  );
});

export default Services;
