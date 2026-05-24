import { memo } from 'react'
import { NavLink } from 'react-router-dom'
import { Send, } from "lucide-react";
import { FaFacebookF , FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const Footer = memo(() => {
  const { t } = useTranslation();
  return (
    <footer className="w-full bg-black text-white font-sans pt-[80px] pb-[24px]">
      <div className="max-w-[1400px] mx-auto px-[16px] md:px-[32px]">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-[40px] lg:gap-[24px] items-start">
          
          <div className="flex flex-col gap-[16px]">
            <h2 className="text-[24px] font-bold tracking-wider">FastCard</h2>
            <h3 className="text-[20px] font-medium">{t('footer.subscribe')}</h3>
            <p className="text-[16px] text-zinc-300">{t('footer.get10Off')}</p>
            <div className="relative w-full max-w-[242px]">
              <input
                type="email"
                placeholder={t('footer.enterEmail', 'Enter your email')}
                className="w-full bg-transparent border border-white rounded-md py-[12px] pl-[16px] pr-[48px] text-[16px] placeholder:text-zinc-500 dark:text-zinc-400 outline-none focus:border-zinc-400 dark:border-zinc-700 transition-colors"
              />
              <Send className="absolute top-1/2 right-[16px] -translate-y-1/2 w-5 h-5 text-white cursor-pointer hover:text-zinc-300 transition-colors" />
            </div>
          </div>

          <div className="flex flex-col gap-[16px]">
            <h3 className="text-[20px] font-medium">{t('footer.support')}</h3>
            <p className="text-[16px] text-zinc-300 max-w-[175px] leading-6">
              {t('footer.address')}
            </p>
            <a href="mailto:exclusive@gmail.com" className="text-[16px] text-zinc-300 hover:underline">
              {t('footer.email', 'exclusive@gmail.com')}
            </a>
            <a href="tel:+8801588889999" className="text-[16px] text-zinc-300 hover:underline">
              {t('footer.phone', '+88015-8888-9999')}
            </a>
          </div>

          <div className="flex flex-col gap-[16px]">
            <h3 className="text-[20px] font-medium">{t('footer.account')}</h3>
            <div className="flex flex-col gap-[12px] text-[16px] text-zinc-300">
              <NavLink to="/account" className="hover:underline">{t('header.manageAccount')}</NavLink>
              <NavLink to="/cart" className="hover:underline">{t('cart.title')}</NavLink>
              <NavLink to="/wishlist" className="hover:underline">{t('wishlist.title')}</NavLink>
              <NavLink to="/products" className="hover:underline">{t('home.allProducts')}</NavLink>
            </div>
          </div>

          <div className="flex flex-col gap-[16px]">
            <h3 className="text-[20px] font-medium">{t('footer.quickLink')}</h3>
            <div className="flex flex-col gap-[12px] text-[16px] text-zinc-300">
              <NavLink to="/privacy-policy" className="hover:underline">{t('footer.privacyPolicy')}</NavLink>
              <NavLink to="/terms" className="hover:underline">{t('footer.termsOfUse')}</NavLink>
              <NavLink to="/faq" className="hover:underline">{t('footer.faq')}</NavLink>
              <NavLink to="/contact" className="hover:underline">{t('header.contact')}</NavLink>
            </div>
          </div>

          <div className="flex flex-col gap-[16px]">
            <h3 className="text-[20px] font-medium">{t('footer.social', 'Social')}</h3>
            <div className="flex items-center gap-[24px]">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-white hover:text-zinc-400 dark:text-zinc-500 transition-colors">
                <FaFacebookF className="w-6 h-6" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-white hover:text-zinc-400 dark:text-zinc-500 transition-colors">
                <FaTwitter className="w-6 h-6" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-white hover:text-zinc-400 dark:text-zinc-500 transition-colors">
                <FaInstagram className="w-6 h-6" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-white hover:text-zinc-400 dark:text-zinc-500 transition-colors">
                <FaLinkedin className="w-6 h-6" />
              </a>
            </div>
          </div>

        </div>

        <div className="w-full h-[1px] bg-zinc-800 mt-[60px] mb-[24px]" />
        
        <p className="text-center text-[16px] text-zinc-600">
          {t('footer.copyright', '\u00A9 Copyright Rimel 2022. All right reserved')}
        </p>

      </div>
    </footer>
  )
})

export default Footer