import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFound = memo(() => {
  const { t } = useTranslation();
  return (
    <div className="w-full max-w-[1400px] mx-auto py-[140px] px-[16px] font-sans flex flex-col items-center justify-center text-center">
      <h1 className="text-[64px] sm:text-[110px] font-medium text-black dark:text-white tracking-widest mb-[40px] leading-none">
        {t('notfound.title', '404 Not Found')}
      </h1>
      
      <p className="text-[16px] text-gray-800 dark:text-zinc-100 mb-[80px]">
        {t('notfound.description', 'Your visited page not found. You may go home page.')}
      </p>
      
      <Link 
        to="/"
        className="bg-[#DB4444] hover:bg-red-600 text-white font-medium px-[48px] py-[16px] rounded-[4px] text-[16px] transition-colors"
      >
        {t('notfound.backToHome', 'Back to home page')}
      </Link>
    </div>
  );
});

export default NotFound;
