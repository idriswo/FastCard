import { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {type RootState } from "../../store/store";
import { toggleWishlist } from "../../store/wishlistSlice";
import { addToCart } from "../../store/cartSlice";
import { axiosRequest } from "../../utils/token";
import { Trash2, Eye } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Product {
  id: number;
  productName: string;
  price: number;
  discountPrice: number;
  hasDiscount: boolean;
  quantity: number;
  image: string;
  rating: number;
  categoryId?: number;
  brandId?: number;
}

const WishlistPage = memo(() => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  
  const [justForYou, setJustForYou] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJustForYou = async () => {
      try {
        setLoading(true);
        const res = await axiosRequest.get("/Product/get-products");
        if (res.data?.statusCode === 200) {
          const allProducts = res.data.data.products || [];
          setJustForYou(allProducts.slice(0, 4));
        }
      } catch (err) {
        console.error("Error fetching just for you", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJustForYou();
  }, []);

  const handleRemove = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    dispatch(toggleWishlist(product));
  };

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    dispatch(addToCart(product));
  };

  const renderProduct = (product: any, isWishlist: boolean) => {
    const discountPercent = product.hasDiscount && product.discountPrice < product.price
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : 0;

    const imgUrl = product.image && product.image.startsWith('http') 
      ? product.image 
      : `https://fastcard-1-o23z.onrender.com/uploads/images/${product.image}${product.image && product.image.includes('.') ? '' : '.jpg'}`;

    return (
      <Link 
        to={`/product/${product.id}`}
        key={product.id} 
        className="group flex flex-col justify-between h-full cursor-pointer"
      >
        <div className="relative bg-[#F5F5F5] dark:bg-zinc-800 rounded-[4px] p-[16px] h-[250px] flex items-center justify-center overflow-hidden transition-all duration-300">
          
          {discountPercent > 0 && (
            <span className="absolute top-[12px] left-[12px] bg-[#DB4444] text-white text-[12px] font-semibold px-[12px] py-[4px] rounded-[4px] z-10">
              -{discountPercent}%
            </span>
          )}

          <div className="absolute top-[12px] right-[12px] flex flex-col gap-[8px] z-10">
            {isWishlist ? (
              <button 
                onClick={(e) => handleRemove(e, product)}
                className="w-[34px] h-[34px] bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center shadow-sm text-gray-700 dark:text-zinc-200 hover:bg-red-500 hover:text-white transition-colors duration-200"
              >
                <Trash2 size={18} />
              </button>
            ) : (
              <button className="w-[34px] h-[34px] bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center shadow-sm text-gray-700 dark:text-zinc-200 hover:bg-blue-500 hover:text-white transition-colors duration-200">
                <Eye size={18} />
              </button>
            )}
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
            {t(`dynamic.products.${product.productName}`, product.productName) as string}
          </h3>
          
          <div className="flex items-center gap-[12px]">
            <span className="text-[#DB4444] font-semibold text-[16px]">
              ${product.hasDiscount ? product.discountPrice : product.price}
            </span>
            {product.hasDiscount && (
              <span className="text-gray-400 line-through text-[16px] font-medium">
                ${product.price}
              </span>
            )}
          </div>

          {!isWishlist && (
             <div className="flex items-center gap-[8px] mt-[4px]">
               <div className="flex text-[#FFAD33] text-[14px]">
                 {Array.from({ length: 5 }).map((_, i) => (
                   <span key={i}>
                     {i < Math.floor(product.rating || 0) ? '★' : '☆'}
                   </span>
                 ))}
               </div>
               <span className="text-[14px] text-gray-400 font-medium">
                 ({product.quantity || 0})
               </span>
             </div>
          )}
        </div>
      </Link>
    );
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto px-[16px] md:px-[32px] pt-[40px] pb-[80px] font-sans">
      
      <div className="flex items-center justify-between mb-[40px]">
        <h2 className="text-[20px] md:text-[24px] font-medium">
          {t('wishlist.title')} ({wishlistItems.length})
        </h2>
        <button className="border border-gray-400 px-[40px] py-[12px] text-[16px] font-medium rounded-[4px] hover:border-black dark:border-zinc-700 transition-colors">
          {t('wishlist.moveAllToBag')}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-[40px] gap-x-[30px] mb-[80px]">
        {wishlistItems.length === 0 ? (
          <div className="col-span-full py-10 text-gray-500 dark:text-zinc-400 text-center">
            {t('wishlist.empty')}
          </div>
        ) : (
          wishlistItems.map((product) => renderProduct(product, true))
        )}
      </div>

      {/* Just For You Section */}
      <div className="flex items-center justify-between mb-[40px]">
        <div className="flex items-center gap-[16px]">
          <div className="w-[20px] h-[40px] bg-[#DB4444] rounded-[4px]"></div>
          <h2 className="text-[20px] md:text-[24px] font-medium">{t('wishlist.justForYou')}</h2>
        </div>
        <button className="border border-gray-400 px-[40px] py-[12px] text-[16px] font-medium rounded-[4px] hover:border-black dark:border-zinc-700 transition-colors">
          {t('home.viewAll')}
        </button>
      </div>

      {/* Just For You Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-[40px] gap-x-[30px]">
        {loading ? (
          <div className="col-span-full flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-zinc-700"></div>
          </div>
        ) : (
          justForYou.map((product) => renderProduct(product, false))
        )}
      </div>

    </div>
  );
});

export default WishlistPage;
