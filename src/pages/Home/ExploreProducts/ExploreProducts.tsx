import { memo, useEffect, useState } from 'react';
import { axiosRequest } from '../../../utils/token';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../../../store/wishlistSlice';
import { addToCart } from '../../../store/cartSlice';
import { type RootState } from '../../../store/store';
import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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

const ExploreProducts = memo(() => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const navigate = useNavigate();

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

  const renderProductCard = (product: Product, index: number) => {
    const imgUrl = product.image && product.image.startsWith('http') 
      ? product.image 
      : `https://fastcard-1-o23z.onrender.com/uploads/images/${product.image}${product.image && product.image.includes('.') ? '' : '.jpg'}`;

    // Мок для бейджа NEW (покажем на некоторых карточках для дизайна)
    const isNew = index === 4 || index === 6;
    
    // Мок для цветов (покажем на некоторых карточках)
    const hasColors = index >= 4;
    
    const isWishlisted = wishlistItems.some(item => item.id === product.id);

    return (
      <div 
        key={product.id} 
        data-aos="fade-up" 
        data-aos-delay={(index % 4) * 100}
        className="group flex flex-col h-full"
      >
        <div className="relative bg-[#F5F5F5] dark:bg-zinc-800 rounded-[4px] p-[16px] h-[250px] flex items-center justify-center overflow-hidden transition-all duration-300">
          
          {isNew && (
            <span className="absolute top-[12px] left-[12px] bg-[#00FF66] text-white text-[12px] font-semibold px-[12px] py-[4px] rounded-[4px] z-10">
              NEW
            </span>
          )}

          <div className="absolute top-[12px] right-[12px] flex flex-col gap-[8px] z-10">
            <button 
              onClick={(e) => handleWishlist(e, product)}
              className={`w-[34px] h-[34px] bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center shadow-sm transition-colors duration-200 
                ${isWishlisted ? 'text-red-500 hover:bg-red-50' : 'text-gray-700 dark:text-zinc-200 hover:bg-red-500 hover:text-white'}`}
            >
              <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} className={isWishlisted ? "text-red-500" : ""} />
            </button>
            <Link 
              to={`/product/${product.id}`}
              className="w-[34px] h-[34px] bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center shadow-sm text-gray-700 dark:text-zinc-200 hover:bg-blue-500 hover:text-white transition-colors duration-200"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </Link>
          </div>

          <img 
            src={imgUrl} 
            alt={product.productName} 
            className="max-h-[160px] max-w-[80%] object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=400&q=80';
            }}
          />

          <button 
            onClick={(e) => handleAddToCart(e, product)}
            className="absolute bottom-0 left-0 right-0 bg-black text-white py-[10px] text-[14px] font-medium transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-[8px]"
          >
            <span>🛒</span> {t('product.addToCart', 'Add To Cart')}
          </button>
        </div>

        <div className="pt-[16px] flex flex-col gap-[6px]">
          <h3 className="font-semibold text-[16px] text-black dark:text-white line-clamp-1 group-hover:text-red-500 transition-colors">
            {t(`dynamic.products.${product.productName}`, product.productName)}
          </h3>
          
          <div className="flex items-center gap-[12px]">
            <span className="text-[#DB4444] font-semibold text-[16px]">
              ${product.hasDiscount ? product.discountPrice : product.price}
            </span>
            <div className="flex items-center gap-[8px]">
              <div className="flex text-[#FFAD33] text-[14px]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span key={index}>
                    {index < Math.floor(product.rating || 0) ? '★' : '☆'}
                  </span>
                ))}
              </div>
              <span className="text-[14px] text-gray-400 font-medium">
                ({product.quantity || 0})
              </span>
            </div>
          </div>
          
          {hasColors && (
            <div className="flex items-center gap-[8px] mt-[4px]">
              <button onClick={(e) => e.preventDefault()} className="w-[20px] h-[20px] rounded-full bg-black border-[2px] border-white shadow-[0_0_0_1px_#000]"></button>
              <button onClick={(e) => e.preventDefault()} className="w-[20px] h-[20px] rounded-full bg-[#DB4444] hover:shadow-[0_0_0_1px_#DB4444] transition-shadow"></button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto py-[60px] font-sans px-[16px]">
      <div className="flex flex-col gap-[8px] mb-[40px]">
        <div className="flex items-center gap-[12px]">
          <div className="w-[20px] h-[40px] bg-[#DB4444] rounded-[4px]"></div>
          <span className="text-[#DB4444] font-semibold text-[14px]">{t('home.ourProducts')}</span>
        </div>
        <h2 className="text-[32px] sm:text-[36px] font-bold tracking-wide text-black dark:text-white mt-[8px]">
          {t('home.exploreProducts')}
        </h2>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[30px]">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex flex-col h-full animate-pulse">
              <div className="bg-gray-200 rounded-[4px] h-[250px] w-full"></div>
              <div className="pt-[16px] flex flex-col gap-[8px]">
                <div className="h-[16px] bg-gray-200 rounded-[4px] w-3/4"></div>
                <div className="h-[16px] bg-gray-200 rounded-[4px] w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-[40px] text-red-500 font-sans">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-[30px] gap-y-[60px]">
          {(showAll ? products : products.slice(0, 8)).map((product, index) => renderProductCard(product, index))}
        </div>
      )}

      <div className="flex justify-center mt-[60px]">
        <button 
          onClick={() => setShowAll(!showAll)}
          className="bg-[#DB4444] hover:bg-red-600 text-white font-medium px-[48px] py-[16px] rounded-[4px] text-[16px] transition-all duration-300 shadow-sm hover:shadow-md"
        >
          {showAll ? t('home.viewLess') : t('home.viewAll')}
        </button>
      </div>
    </div>
  );
});

export default ExploreProducts;
