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

const BestProducts = memo(() => {
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
      : `${import.meta.env.VITE_BASE_URL}/uploads/images/${product.image}${product.image && product.image.includes('.') ? '' : '.jpg'}`;

    const isWishlisted = wishlistItems.some(item => item.id === product.id);

    return (
      <div
        key={product.id}
        data-aos="fade-up"
        data-aos-delay={(index % 4) * 100}
        className="group flex flex-col h-full"
      >
        <div className="relative bg-[#F5F5F5] dark:bg-zinc-800 rounded-md p-4 h-[250px] flex items-center justify-center overflow-hidden transition-all duration-300">

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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
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
              <span className="text-gray-400 line-through text-sm font-medium">
                ${product.price}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1">
            <div className="flex text-amber-400 text-sm">
              {Array.from({ length: 5 }).map((_, index) => (
                <span key={index}>
                  {index < Math.floor(product.rating || 0) ? '★' : '☆'}
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-400 font-medium">
              ({product.quantity || 0})
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto py-12 font-sans px-4">
      <div className="flex items-end justify-between mb-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-5 h-10 bg-red-500 rounded-sm"></div>
            <span className="text-red-500 font-semibold text-sm">{t('home.thisMonth')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-wide text-gray-900 dark:text-white mt-2">
            {t('home.bestSelling')}
          </h2>
        </div>

        <button
          onClick={() => setShowAll(!showAll)}
          className="bg-[#DB4444] hover:bg-red-600 text-white font-medium px-8 py-3 rounded text-sm transition-all duration-200 tracking-wide shadow-sm hover:shadow-md h-[46px]"
        >
          {showAll ? t('home.viewLess') : t('home.viewAll')}
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex flex-col h-full animate-pulse">
              <div className="bg-gray-200 rounded-md h-[250px] w-full"></div>
              <div className="pt-4 flex flex-col gap-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500 font-sans">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[30px]">
          {(showAll ? products : products.slice(0, 4)).map((product, index) => renderProductCard(product, index))}
        </div>
      )}
    </div>
  );
});

export default BestProducts;