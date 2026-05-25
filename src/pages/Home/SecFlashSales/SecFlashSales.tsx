import { memo, useEffect, useState } from 'react';
import { axiosRequest } from '../../../utils/token';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../../../store/wishlistSlice';
import { addToCart } from '../../../store/cartSlice';
import {type RootState } from '../../../store/store';
import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import 'swiper/css';
import 'swiper/css/navigation';

interface Product {
  id: string | number;
  productName: string;
  price: number;
  discountPrice: number;
  hasDiscount: boolean;
  image: string;
  rating: number;
  quantity: number;
}

const SecFlashSales = memo(() => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 
  const [showAll, setShowAll] = useState(false);

  const [prevEl, setPrevEl] = useState<HTMLButtonElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLButtonElement | null>(null);
  
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const navigate = useNavigate();

  const handleWishlist = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    dispatch(toggleWishlist(product));
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    dispatch(addToCart(product));
  };

  const renderProductCard = (product: Product, index: number = 0) => {
    const discountPercent = product.hasDiscount && product.discountPrice < product.price
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : 0;

    const imgUrl = product.image && product.image.startsWith('http') 
      ? product.image 
      : `https://fastcard-1-o23z.onrender.com/uploads/images/${product.image}${product.image && product.image.includes('.') ? '' : '.jpg'}`;
      
    const isWishlisted = wishlistItems.some(item => item.id === product.id);

    return (
      <div 
        key={product.id} 
        data-aos="fade-up" 
        data-aos-delay={(index % 4) * 100}
        className="group flex flex-col justify-between h-full"
      >
        <div className="relative bg-[#F5F5F5] dark:bg-zinc-800 rounded-md p-4 h-64 flex items-center justify-center overflow-hidden transition-all duration-300">
          
          {discountPercent > 0 && (
            <span className="absolute top-3 left-3 bg-[#DB4444] text-white text-xs font-semibold px-3 py-1 rounded">
              -{discountPercent}%
            </span>
          )}

          <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
            <button 
              onClick={(e) => handleWishlist(e, product)}
              className={`w-8 h-8 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center shadow-sm transition-colors duration-200 
                ${isWishlisted ? 'text-red-500 hover:bg-red-50' : 'text-gray-700 dark:text-zinc-200 hover:bg-red-500 hover:text-white'}`}
            >
              <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} className={isWishlisted ? "text-red-500" : ""} />
            </button>
            <Link 
              to={`/product/${product.id}`}
              className="w-8 h-8 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center shadow-sm text-gray-700 dark:text-zinc-200 hover:bg-blue-500 hover:text-white transition-colors duration-200"
            >
              👁
            </Link>
          </div>

          <img 
            src={imgUrl} 
            alt={product.productName} 
            className="max-h-40 max-w-full object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=400&q=80';
            }}
          />

          <button 
            onClick={(e) => handleAddToCart(e, product)}
            className="absolute bottom-0 left-0 right-0 bg-black text-white py-2.5 text-sm font-medium transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2"
          >
            <span>🛒</span> {t('product.addToCart', 'Add To Cart')}
          </button>
        </div>

        <div className="pt-4 flex flex-col gap-1.5">
          <h3 className="font-bold text-base text-gray-800 dark:text-zinc-100 line-clamp-1 group-hover:text-red-500 transition-colors">
            {t(`dynamic.products.${product.productName}`, product.productName)}
          </h3>
          
          <div className="flex items-center gap-3">
            <span className="text-red-500 font-bold text-base">
              ${product.hasDiscount ? product.discountPrice : product.price}
            </span>
            {product.hasDiscount && (
              <span className="text-gray-400 line-through text-sm">
                ${product.price}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex text-amber-400 text-sm">
              {Array.from({ length: 5 }).map((_, index) => (
                <span key={index}>
                  {index < Math.floor(product.rating) ? '★' : '☆'}
                </span>
              ))}
            </div>
            <span className="text-xs text-gray-500 dark:text-zinc-400 font-semibold">
              ({product.quantity})
            </span>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosRequest.get("/Product/get-products");
        if (response.data?.statusCode === 200) {
          setProducts(response.data.data?.products || []);
        } else {
          throw new Error(response.data?.message || 'Данные не найдены');
        }
      } catch (err: unknown) {
        console.error("Ошибка при загрузке товаров:", err);
        const error = err as { response?: { data?: { message?: string } }, message?: string };
        setError(error.response?.data?.message || error.message || "Ошибка сервера");
      } finally {
        setLoading(false);
        setTimeout(() => {
          import('aos').then((AOS) => {
            const aosInstance = AOS.default || AOS;
            if (aosInstance?.refresh) aosInstance.refresh();
          });
        }, 100);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-[1400px] mx-auto py-8 font-sans px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex flex-col h-full animate-pulse">
              <div className="bg-gray-200 rounded-md h-64 w-full"></div>
              <div className="pt-4 flex flex-col gap-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-500 font-sans">{error}</div>;
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto py-8 font-sans px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-5 h-10 bg-red-500 rounded-sm"></div>
            <span className="text-red-500 font-semibold text-sm">{t('home.todays')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-wide text-gray-900 dark:text-white mt-1">
            {t('home.flashSales')}
          </h2>
        </div>

        <div className="hidden md:flex items-center gap-6 ml-10 mb-2">
          <div className="flex flex-col items-center">
            <span className="text-xs font-medium text-gray-500 dark:text-zinc-400">{t('home.days', 'Days')}</span>
            <span className="text-2xl font-bold">03</span>
          </div>
          <span className="text-red-500 text-xl font-bold animate-pulse">:</span>
          <div className="flex flex-col items-center">
            <span className="text-xs font-medium text-gray-500 dark:text-zinc-400">{t('home.hours', 'Hours')}</span>
            <span className="text-2xl font-bold">23</span>
          </div>
          <span className="text-red-500 text-xl font-bold animate-pulse">:</span>
          <div className="flex flex-col items-center">
            <span className="text-xs font-medium text-gray-500 dark:text-zinc-400">{t('home.minutes', 'Minutes')}</span>
            <span className="text-2xl font-bold">19</span>
          </div>
          <span className="text-red-500 text-xl font-bold animate-pulse">:</span>
          <div className="flex flex-col items-center">
            <span className="text-xs font-medium text-gray-500 dark:text-zinc-400">{t('home.seconds', 'Seconds')}</span>
            <span className="text-2xl font-bold">56</span>
          </div>
        </div>

        {!showAll && (
          <div className="flex gap-2">
            <button
              ref={(node) => setPrevEl(node)}
              className="w-11 h-11 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 dark:text-zinc-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ←
            </button>
            <button
              ref={(node) => setNextEl(node)}
              className="w-11 h-11 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 dark:text-zinc-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              →
            </button>
          </div>
        )}
      </div>

      {showAll ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product, index) => renderProductCard(product, index))}
        </div>
      ) : (
        <Swiper
          modules={[Navigation]}
          spaceBetween={24}
          slidesPerView={1}
          navigation={{ 
            prevEl, 
            nextEl 
          }}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          className="mySwiper"
        >
          {products.map((product, index) => {
            return (
              <SwiperSlide key={product.id}>
                {renderProductCard(product, index)}
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}

      <div className="text-center mt-12">
        <button 
          onClick={() => setShowAll(!showAll)}
          className="bg-red-500 hover:bg-red-600 text-white font-medium px-12 py-4 rounded transition-all duration-200 tracking-wide shadow-md hover:shadow-lg"
        >
          {showAll ? t('home.viewLess') : t('home.viewAll')}
        </button>
      </div>
    </div>
  );
});

export default SecFlashSales;