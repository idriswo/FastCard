import { memo } from 'react';
import { Phone, Mail } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Contact = memo(() => {
  const { t } = useTranslation();
  return (
    <div className="w-full max-w-[1400px] mx-auto py-[60px] px-[16px] font-sans">
      <div className="flex items-center gap-[8px] text-[14px] mb-[60px]">
        <NavLink to="/" className="text-gray-500 dark:text-zinc-400">{t('header.home')}</NavLink>
        <span className="text-gray-500 dark:text-zinc-400">/</span>
        <span className="text-black dark:text-white font-medium">{t('header.contact')}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-[30px]">
        <div className="w-full lg:w-[340px] bg-white dark:bg-zinc-900 rounded-[4px] shadow-[0_1px_13px_rgba(0,0,0,0.05)] p-[32px] sm:p-[40px] flex flex-col gap-[32px]">
          
          <div className="flex flex-col gap-[24px]">
            <div className="flex items-center gap-[16px]">
              <div className="w-[40px] h-[40px] bg-[#DB4444] rounded-full flex items-center justify-center text-white">
                <Phone size={20} />
              </div>
              <h3 className="text-[16px] font-medium text-black dark:text-white">{t('contact.callToUs', 'Call To Us')}</h3>
            </div>
            
            <div className="flex flex-col gap-[16px] text-[14px] text-black dark:text-white">
              <p>{t('contact.available', 'We are available 24/7, 7 days a week.')}</p>
              <p>{t('contact.phone', 'Phone: +992111178171')}</p>
            </div>
          </div>

          <hr className="border-gray-300 dark:border-zinc-700" />

          <div className="flex flex-col gap-[24px]">
            <div className="flex items-center gap-[16px]">
              <div className="w-[40px] h-[40px] bg-[#DB4444] rounded-full flex items-center justify-center text-white">
                <Mail size={20} />
              </div>
              <h3 className="text-[16px] font-medium text-black dark:text-white">{t('contact.writeToUs', 'Write To US')}</h3>
            </div>
            
            <div className="flex flex-col gap-[16px] text-[14px] text-black dark:text-white">
              <p className="leading-relaxed">
                {t('contact.fillForm', 'Fill out our form and we will contact you within 24 hours.')}
              </p>
              <p>{t('contact.email1', 'Emails: customer@exclusive.com')}</p>
              <p>{t('contact.email2', 'Emails: support@exclusive.com')}</p>
            </div>
          </div>
          
        </div>

        <div className="flex-1 bg-white dark:bg-zinc-900 rounded-[4px] shadow-[0_1px_13px_rgba(0,0,0,0.05)] p-[32px] sm:p-[40px]">
          <form className="flex flex-col gap-[32px] h-full">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
              <input 
                type="text" 
                placeholder={t('contact.namePlaceholder', 'Name')} 
                className="w-full h-[50px] bg-[#F5F5F5] dark:bg-zinc-800 rounded-[4px] px-[16px] text-[16px] outline-none border border-transparent focus:border-gray-300 dark:border-zinc-700 transition-colors"
                required
              />
              <input 
                type="email" 
                placeholder={t('contact.emailPlaceholder', 'Email')} 
                className="w-full h-[50px] bg-[#F5F5F5] dark:bg-zinc-800 rounded-[4px] px-[16px] text-[16px] outline-none border border-transparent focus:border-gray-300 dark:border-zinc-700 transition-colors"
                required
              />
              <input 
                type="tel" 
                placeholder={t('contact.phonePlaceholder', 'Phone')} 
                className="w-full h-[50px] bg-[#F5F5F5] dark:bg-zinc-800 rounded-[4px] px-[16px] text-[16px] outline-none border border-transparent focus:border-gray-300 dark:border-zinc-700 transition-colors"
                required
              />
            </div>

            <textarea 
              placeholder={t('contact.messagePlaceholder', 'Your Massage')} 
              className="w-full flex-1 min-h-[200px] bg-[#F5F5F5] dark:bg-zinc-800 rounded-[4px] p-[16px] text-[16px] outline-none border border-transparent focus:border-gray-300 dark:border-zinc-700 transition-colors resize-none"
              required
            ></textarea>

            <div className="flex justify-end mt-auto">
              <button 
                type="submit" 
                className="bg-[#DB4444] hover:bg-red-600 text-white font-medium px-[48px] py-[16px] rounded-[4px] text-[16px] transition-colors"
              >
                {t('contact.sendButton', 'Send Massage')}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
});

export default Contact;