import { memo, useEffect, useState, useRef } from 'react';
import { axiosRequest } from '../../../utils/token';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../../../store/wishlistSlice';
import { addToCart } from '../../../store/cartSlice';
import { type RootState } from '../../../store/store';
import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import 'swiper/css';
import 'swiper/css/navigation';
import {
  Smartphone,
  Shirt,
  Home,
  Dumbbell,
  Gift,
  Camera,
  Monitor,
  Watch,
  Headphones,
  Gamepad2,
} from 'lucide-react';

interface Category {
  id: number;
  categoryName: string;
  categoryImage: string | null;
}

interface Product {
  id: string | number;
  productName: string;
  price: number;
  discountPrice: number;
  hasDiscount: boolean;
  image: string;
  description?: string;
  reviews?: number;
  rating?: number;
  quantity?: number;
}


const getCategoryIcon = (categoryName: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    Electronics: <Smartphone size={48} strokeWidth={1.5} />,
    Fashion: <Shirt size={48} strokeWidth={1.5} />,
    'Home & Garden': <Home size={48} strokeWidth={1.5} />,
    Sports: <Dumbbell size={48} strokeWidth={1.5} />,
    Toys: <Gift size={48} strokeWidth={1.5} />,
    Camera: <Camera size={48} strokeWidth={1.5} />,
    Computers: <Monitor size={48} strokeWidth={1.5} />,
    SmartWatch: <Watch size={48} strokeWidth={1.5} />,
    HeadPhones: <Headphones size={48} strokeWidth={1.5} />,
    Gaming: <Gamepad2 size={48} strokeWidth={1.5} />,
  };
  return iconMap[categoryName] || <Smartphone size={48} strokeWidth={1.5} />;
};

interface BrowseByCategoryProps {
  selectedCategoryId: number | null;
  onSelectCategory: (id: number | null) => void;
}

const BrowseByCategory = memo(({ onSelectCategory, selectedCategoryId }: BrowseByCategoryProps) => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosRequest.get('/Category/get-categories');
        if (response.data?.statusCode === 200) {
          const data = response.data.data || [];
          setCategories(data);
          if (data.length > 0 && selectedCategoryId === null) {
            onSelectCategory(data[0]?.id);
          }
        } else {
          throw new Error(response.data?.message || 'Категории не найдены');
        }
      } catch (err: unknown) {
        console.error('Ошибка при загрузке категорий:', err);
        const error = err as { response?: { data?: { message?: string } }, message?: string };
        setError(error.response?.data?.message || error.message || 'Ошибка сервера');
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      setProductsLoading(true);
      try {
        const url = selectedCategoryId === null
          ? `/Product/get-products`
          : `/Product/get-products?CategoryId=${selectedCategoryId}`;

        const response = await axiosRequest.get(url);
        if (response.data?.statusCode === 200) {
          setProducts(response.data.data?.products || []);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error('Ошибка при загрузке товаров по категории:', err);
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProductsByCategory();
  }, [selectedCategoryId]);

  const renderProductCard = (product: Product) => {
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
        className="group flex flex-col justify-between h-full"
      >
        <div className="relative bg-[#F5F5F5] dark:bg-zinc-800 rounded-md p-4 h-64 flex items-center justify-center overflow-hidden transition-all duration-300">

          {product.hasDiscount && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded z-10">
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
            {t(`dynamic.products.${product.productName}`, product.productName) as string}
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

          <div className="flex items-center gap-2 mt-1">
            <div className="flex text-amber-400 text-sm">
              {Array.from({ length: 5 }).map((_, index) => (
                <span key={index}>
                  {index < Math.floor(product.rating || 0) ? '★' : '☆'}
                </span>
              ))}
            </div>
            <span className="text-xs text-gray-500 dark:text-zinc-400 font-semibold">
              ({product.quantity || 0})
            </span>
          </div>
        </div>
      </div>
    );
  };




  if (categoriesLoading) {
    return (
      <div className="w-full max-w-[1400px] mx-auto py-12 font-sans px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-zinc-700 rounded-md h-[145px] w-full flex flex-col items-center justify-center gap-3 animate-pulse"
            >
              <div className="w-14 h-14 bg-gray-200 rounded-full"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500 font-sans">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto py-12 font-sans px-4 border-b border-gray-200 dark:border-zinc-700">
      <div className="flex items-end justify-between mb-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-5 h-10 bg-red-500 rounded-sm"></div>
            <span className="text-red-500 font-semibold text-sm">
              {t('home.categories')}
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-wide text-gray-900 dark:text-white">
            {t('home.browseByCategory')}
          </h2>
        </div>

        <div className="flex gap-2">
          <button
            ref={prevRef}
            className="w-11 h-11 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 dark:text-zinc-200 transition"
          >
            ←
          </button>
          <button
            ref={nextRef}
            className="w-11 h-11 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 dark:text-zinc-200 transition"
          >
            →
          </button>
        </div>
      </div>

      <Swiper
        modules={[Navigation]}
        spaceBetween={24}
        slidesPerView={2}
        navigation={{
          prevEl: prevRef.current as HTMLElement | null,
          nextEl: nextRef.current as HTMLElement | null,
        }}
        onBeforeInit={(swiper) => {
          if (swiper.params.navigation && typeof swiper.params.navigation !== 'boolean') {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }
        }}
        breakpoints={{
          480: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 6 },
        }}
        className="categorySwiper"
      >
        {categories.map((category) => {
          const isActive = selectedCategoryId !== null && Number(category.id) === Number(selectedCategoryId);

          return (
            <SwiperSlide key={category.id}>
              <div
                onClick={() => onSelectCategory(category.id)}
                className={`flex flex-col items-center justify-center gap-4 h-[145px] border-2 rounded-md cursor-pointer transition-all duration-200 select-none
                  ${isActive
                    ? 'bg-red-500 border-red-500 text-white shadow-md'
                    : 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white hover:border-gray-400'
                  }`}
              >
                <div
                  className={`transition-all duration-200 ${isActive ? 'text-white' : 'text-gray-700 dark:text-zinc-200'
                    }`}
                >
                  {getCategoryIcon(category.categoryName)}
                </div>

                <span className="text-sm font-medium tracking-wide text-center px-2">
                  {t(`dynamic.categories.${category.categoryName}`, category.categoryName)}
                </span>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Отображение товаров по выбранной категории */}
      <div className="mt-12">
        {productsLoading ? (
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
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => renderProductCard(product))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500 dark:text-zinc-400 font-medium">
            {t('home.noProducts', 'Нет товаров в этой категории.')}
          </div>
        )}
      </div>
    </div>
  );
});

export default BrowseByCategory;  