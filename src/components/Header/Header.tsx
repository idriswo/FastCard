import { memo, useState, useRef, useEffect } from 'react';

import { Separator } from "../../components/ui/separator";
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice'; 
import { toggleTheme } from '../../store/themeSlice';
import type { RootState } from '../../store/store';
import { Heart, ShoppingCart, User, LogOut, Menu, X, Sun, Moon, Globe } from 'lucide-react';
import Logo from "../../assets/Group 1116606595.png";
import { useTranslation } from 'react-i18next';
import SearchAutocomplete from './SearchAutocomplete';

const Header = memo(() => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const wishlistCount = wishlistItems.length;
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const isDarkMode = useSelector((state: RootState) => state.theme?.isDarkMode);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setProfileOpen(false);
    navigate("/login");
  };

  const linkStyles = ({ isActive }: { isActive: boolean }) =>
    `relative text-[15px] font-medium transition-all duration-300 ease-in-out hover:text-red-500 
    after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-full after:h-[2px] after:bg-red-500 after:transform 
    ${isActive ? 'after:scale-x-100 text-red-500' : 'after:scale-x-0'} 
    hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-in-out`;

  const mobileLinkStyles = "py-2 border-b border-zinc-100 text-[15px] font-medium hover:pl-2 transition-all duration-200";



  return (
    <div className="dark:bg-zinc-950  sticky top-0 z-50 w-full bg-white  text-zinc-900 dark:text-white font-sans max-w-[1560px] m-auto">
      <div className="container mx-auto px-[16px] md:px-[32px] pt-[18px]">
        <div className="flex items-center justify-between">

          <button
            className="block md:hidden p-1 text-zinc-900 dark:text-white transition-transform duration-300 active:scale-90"
            onClick={() => setIsOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-grow md:flex-grow-0 text-center md:text-left pl-4 md:pl-0">
            <img
              src={Logo}
              alt="Logo"
              onClick={() => navigate("/")}
              className="mx-auto md:mx-0 transition-transform duration-300 hover:scale-105 cursor-pointer"
            />
          </div>

          <nav className="hidden md:flex items-center gap-[32px] lg:gap-[48px]">
            <NavLink to="/" className={linkStyles}>{t('header.home')}</NavLink>
            <NavLink to="/contact" className={linkStyles}>{t('header.contact')}</NavLink>
            <NavLink to="/about" className={linkStyles}>{t('header.about')}</NavLink>
            
            {!isAuthenticated && (
              <NavLink to="/signup" className={linkStyles}>{t('header.signup')}</NavLink>
            )}
          </nav>

          <div className="flex items-center gap-[16px] md:gap-[24px]">
            
            <SearchAutocomplete />

            <div className="relative hidden sm:block" ref={langDropdownRef}>
              <button 
                onClick={() => setLangOpen(!langOpen)}
                className="relative cursor-pointer group p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors flex items-center gap-1"
              >
                <Globe className="w-5 h-5 text-zinc-900 dark:text-white" />
                <span className="text-[12px] font-medium text-zinc-900 dark:text-white uppercase">{i18n.language}</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-[120px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg py-2 z-[100] animate-[fadeIn_0.2s_ease-out]">
                  <button onClick={() => { i18n.changeLanguage('en'); setLangOpen(false); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 ${i18n.language === 'en' ? 'font-bold text-red-500' : 'text-zinc-900 dark:text-white'}`}>English</button>
                  <button onClick={() => { i18n.changeLanguage('ru'); setLangOpen(false); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 ${i18n.language === 'ru' ? 'font-bold text-red-500' : 'text-zinc-900 dark:text-white'}`}>Русский</button>
                  <button onClick={() => { i18n.changeLanguage('tj'); setLangOpen(false); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 ${i18n.language === 'tj' ? 'font-bold text-red-500' : 'text-zinc-900 dark:text-white'}`}>Тоҷикӣ</button>
                </div>
              )}
            </div>

            <button 
              onClick={() => dispatch(toggleTheme())}
              className="relative cursor-pointer group p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-800 rounded-full transition-colors hidden sm:block"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-zinc-900 dark:text-white dark:text-zinc-100 transition-transform duration-300 group-hover:rotate-90" />
              ) : (
                <Moon className="w-5 h-5 text-zinc-900 dark:text-white transition-transform duration-300 group-hover:-rotate-12" />
              )}
            </button>

            <Link to="/wishlist" className="relative cursor-pointer group hidden sm:block">
              <Heart className="w-5 h-5 text-zinc-900 dark:text-white transition-all duration-300 group-hover:text-red-500 group-hover:scale-110 active:scale-95" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative cursor-pointer group">
              <ShoppingCart className="w-5 h-5 text-zinc-900 dark:text-white transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 active:scale-95" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className={`p-1.5 rounded-full transition-all duration-300 active:scale-95 ${
                    profileOpen ? 'bg-[#DB4444] text-white' : 'text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:bg-zinc-800'
                  }`}
                >
                  <User className="w-5 h-5" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-[224px] bg-black/90 backdrop-blur-md text-zinc-100 rounded-lg shadow-2xl py-3 z-[100] border border-zinc-800 dark:border-zinc-700 animate-[fadeIn_0.2s_ease-out]">
                    
                    <NavLink 
                      to="/account" 
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-[14px] hover:bg-white hover:text-[black] dark:bg-zinc-900/10 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>{t('header.manageAccount')}</span>
                    </NavLink>

                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[14px] hover:bg-white/10 text-red-400 hover:text-red-300 transition-colors border-t border-zinc-800 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('header.logout')}</span>
                    </button>

                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        <div 
          className={`fixed inset-0 bg-black/50 z-50 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setIsOpen(false)}
        />

        <div
          className={`fixed top-0 left-0 h-full w-[280px] bg-white dark:bg-zinc-900 shadow-2xl z-[60] md:hidden flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="flex items-center justify-between p-5 border-b border-zinc-100">
            <img src={Logo} alt="Logo" className="h-[24px]" />
            <button onClick={() => setIsOpen(false)} className="p-1 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col p-5 gap-4 overflow-y-auto flex-grow">
            <SearchAutocomplete isMobile onCloseMobile={() => setIsOpen(false)} />

            <NavLink to="/" onClick={() => setIsOpen(false)} className={mobileLinkStyles}>{t('header.home')}</NavLink>
            <NavLink to="/contact" onClick={() => setIsOpen(false)} className={mobileLinkStyles}>{t('header.contact')}</NavLink>
            <NavLink to="/about" onClick={() => setIsOpen(false)} className={mobileLinkStyles}>{t('header.about')}</NavLink>
            
            <Separator className="bg-zinc-100 dark:bg-zinc-800 my-2" />

            {/* Mobile Actions: Wishlist, Theme, Language */}
            <div className="flex items-center justify-between py-2">
              <NavLink to="/wishlist" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-zinc-900 dark:text-white font-medium hover:text-red-500 transition-colors">
                <div className="relative">
                  <Heart className="w-5 h-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                      {wishlistCount}
                    </span>
                  )}
                </div>
                <span>{t('header.wishlist', 'Wishlist')}</span>
              </NavLink>

              <button onClick={() => dispatch(toggleTheme())} className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white">
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex flex-col gap-2 mt-2 mb-2">
              <span className="text-[13px] text-zinc-500 dark:text-zinc-400 font-medium uppercase">{t('header.language', 'Language')}</span>
              <div className="flex gap-2">
                <button onClick={() => { i18n.changeLanguage('en'); setIsOpen(false); }} className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${i18n.language === 'en' ? 'bg-red-50 text-red-500 dark:bg-red-500/10' : 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white'}`}>EN</button>
                <button onClick={() => { i18n.changeLanguage('ru'); setIsOpen(false); }} className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${i18n.language === 'ru' ? 'bg-red-50 text-red-500 dark:bg-red-500/10' : 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white'}`}>RU</button>
                <button onClick={() => { i18n.changeLanguage('tj'); setIsOpen(false); }} className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${i18n.language === 'tj' ? 'bg-red-50 text-red-500 dark:bg-red-500/10' : 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white'}`}>TJ</button>
              </div>
            </div>

            <Separator className="bg-zinc-100 dark:bg-zinc-800 my-2" />
            {!isAuthenticated ? (
              <NavLink to="/signup" onClick={() => setIsOpen(false)} className="py-2 text-[15px] font-semibold text-zinc-900 dark:text-white hover:pl-2 transition-all duration-200">{t('header.signup')}</NavLink>
            ) : (
              <>
                <NavLink to="/account" onClick={() => setIsOpen(false)} className={mobileLinkStyles}>{t('header.manageAccount')}</NavLink>
                <button onClick={() => { setIsOpen(false); handleLogout(); }} className="py-2 text-[15px] font-semibold text-red-500 text-left hover:pl-2 transition-all duration-200">{t('header.logout')}</button>
              </>
            )}
          </div>
        </div>

      </div>

      <Separator className="mt-[20px] bg-zinc-200" />
    </div>
  );
});

export default Header;