import { memo, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { axiosRequest } from '../../utils/token';
import { Truck, RefreshCcw, Heart, Minus, Plus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../../store/wishlistSlice';
import { addToCart } from '../../store/cartSlice';
import {type RootState } from '../../store/store';
import { useTranslation } from 'react-i18next';

interface ProductData {
  id: number;
  productName: string;
  description: string;
  price: number;
  discountPrice: number;
  hasDiscount: boolean;
  quantity: number;
  image: string;
  images: string[];
  rating: number;
  size: string;
  color?: { colorName: string };
  categoryName: string;
}

const ProductDetail = memo(() => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  const handleWishlist = (e: React.MouseEvent, productToToggle: any) => {
    e.preventDefault();
    dispatch(toggleWishlist(productToToggle));
  };
  
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = (e: React.MouseEvent, productToToggle: any, qty: number = 1) => {
    e.preventDefault();
    dispatch(addToCart({ ...productToToggle, addQty: qty }));
  };
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [activeImage, setActiveImage] = useState<string>('');
  
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosRequest.get(`/Product/get-product-by-id?id=${id}`);
        if (response.data?.statusCode === 200) {
          const data = response.data.data;
          setProduct(data);
          
          const imgUrl = data.image && data.image.startsWith('http') 
            ? data.image 
            : `https://fastcard-1-o23z.onrender.com/uploads/images/${data.image}${data.image && data.image.includes('.') ? '' : '.jpg'}`;
          
          setActiveImage(imgUrl);
          
          if (data.size) {
            setSelectedSize(data.size.split(',')[0]);
          }
        } else {
          throw new Error(response.data?.message || 'Product not found');
        }
      } catch (err: any) {
        console.error("Error loading product:", err);
        setError(err.response?.data?.message || err.message || "Server Error");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetails();
      window.scrollTo(0, 0);
    }
  }, [id]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const response = await axiosRequest.get("/Product/get-products");
        if (response.data?.statusCode === 200) {
          const allProducts = response.data.data?.products || [];
          const filtered = allProducts.filter((p: any) => p.id !== Number(id)).slice(0, 4);
          setRelatedProducts(filtered);
        }
      } catch (err) {
        console.error("Error loading related products", err);
      }
    };
    fetchRelated();
  }, [id]);

  const handleQuantityChange = (type: 'inc' | 'dec') => {
    if (type === 'inc') {
      setQuantity(prev => prev + 1);
    } else if (type === 'dec' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const getImageUrl = (imgName: string) => {
    if (!imgName) return '';
    return imgName.startsWith('http') 
      ? imgName 
      : `https://fastcard-1-o23z.onrender.com/uploads/images/${imgName}${imgName.includes('.') ? '' : '.jpg'}`;
  };

  if (loading) {
    return <div className="w-full max-w-[1400px] mx-auto py-[60px] px-[16px] text-center">{t('product.loading', 'Loading product...')}</div>;
  }

  if (error || !product) {
    return <div className="w-full max-w-[1400px] mx-auto py-[60px] px-[16px] text-center text-red-500">{error || "Product not found"}</div>;
  }

  const galleryImages = product.images?.length > 0 
    ? product.images.map(img => getImageUrl(img))
    : [getImageUrl(product.image), getImageUrl(product.image), getImageUrl(product.image), getImageUrl(product.image)]; // fallback to repeat main image if no gallery

  const sizes = product.size ? product.size.split(',') : [];

  return (
    <div className="w-full max-w-[1400px] mx-auto py-[60px] px-[16px] font-sans">
      <div className="flex items-center gap-[8px] text-[14px] mb-[40px]">
        <Link to="/" className="text-gray-500 dark:text-zinc-400 hover:text-black dark:text-white dark:hover:text-white transition-colors">{t('header.home')}</Link>
        <span className="text-gray-500 dark:text-zinc-400">/</span>
        <Link to="/products" className="text-gray-500 dark:text-zinc-400 hover:text-black dark:text-white dark:hover:text-white transition-colors">{product.categoryName ? t(`dynamic.categories.${product.categoryName}`, product.categoryName) : t('header.category')}</Link>
        <span className="text-gray-500 dark:text-zinc-400">/</span>
        <span className="text-black dark:text-white font-medium">{t(`dynamic.products.${product.productName}`, product.productName)}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-[30px] lg:gap-[70px] mb-[100px]">
        <div className="flex flex-col-reverse md:flex-row gap-[30px] w-full lg:w-3/5">
          <div className="flex md:flex-col gap-[16px] overflow-x-auto md:overflow-visible">
            {galleryImages.slice(0, 4).map((imgUrl, index) => (
              <div 
                key={index} 
                className={`w-[100px] h-[100px] sm:w-[170px] sm:h-[138px] bg-[#F5F5F5] dark:bg-zinc-800 rounded-[4px] flex items-center justify-center cursor-pointer p-[10px] border-2 transition-colors flex-shrink-0 ${activeImage === imgUrl ? 'border-[#DB4444]' : 'border-transparent'}`}
                onClick={() => setActiveImage(imgUrl)}
              >
                <img src={imgUrl} alt={`Thumbnail ${index}`} className="w-[80%] h-[80%] object-contain" />
              </div>
            ))}
            {galleryImages.slice(0, 4).map((imgUrl, index) => (
              <div 
                key={index} 
                className={`w-[100px] h-[100px] sm:w-[170px] sm:h-[138px] bg-[#F5F5F5] dark:bg-zinc-800 rounded-[4px] flex items-center justify-center cursor-pointer p-[10px] border-2 transition-colors flex-shrink-0 ${activeImage === imgUrl ? 'border-[#DB4444]' : 'border-transparent'}`}
                onClick={() => setActiveImage(imgUrl)}
              >
                <img src={imgUrl} alt={`Thumbnail ${index}`} className="w-[80%] h-[80%] object-contain" />
              </div>
            ))}
            {galleryImages.slice(0, 4).map((imgUrl, index) => (
              <div 
                key={index} 
                className={`w-[100px] h-[100px] sm:w-[170px] sm:h-[138px] bg-[#F5F5F5] dark:bg-zinc-800 rounded-[4px] flex items-center justify-center cursor-pointer p-[10px] border-2 transition-colors flex-shrink-0 ${activeImage === imgUrl ? 'border-[#DB4444]' : 'border-transparent'}`}
                onClick={() => setActiveImage(imgUrl)}
              >
                <img src={imgUrl} alt={`Thumbnail ${index}`} className="w-[80%] h-[80%] object-contain" />
              </div>
            ))}
            {galleryImages.slice(0, 4).map((imgUrl, index) => (
              <div 
                key={index} 
                className={`w-[100px] h-[100px] sm:w-[170px] sm:h-[138px] bg-[#F5F5F5] dark:bg-zinc-800 rounded-[4px] flex items-center justify-center cursor-pointer p-[10px] border-2 transition-colors flex-shrink-0 ${activeImage === imgUrl ? 'border-[#DB4444]' : 'border-transparent'}`}
                onClick={() => setActiveImage(imgUrl)}
              >
                <img src={imgUrl} alt={`Thumbnail ${index}`} className="w-[80%] h-[80%] object-contain" />
              </div>
            ))}
          </div>
          
          <div className="flex-1 bg-[#F5F5F5] dark:bg-zinc-800 rounded-[4px] flex items-center justify-center p-[40px] min-h-[300px] sm:min-h-[500px]">
            <img src={activeImage} alt={product.productName} className="w-[80%] h-[80%] object-contain mix-blend-multiply dark:mix-blend-normal" />
          </div>
        </div>
        <div className="flex flex-col w-full lg:w-2/5">
          <h1 className="text-[24px] font-semibold text-black dark:text-white mb-[16px]">{t(`dynamic.products.${product.productName}`, product.productName)}</h1>
          
          <div className="flex items-center gap-[16px] mb-[16px]">
            <div className="flex text-amber-400 text-[14px]">
              {Array.from({ length: 5 }).map((_, index) => (
                <span key={index}>{index < Math.floor(product.rating || 0) ? '★' : '☆'}</span>
              ))}
            </div>
            <span className="text-gray-400 text-[14px]">({t('product.reviews', 'Reviews')})</span>
            <span className="text-gray-400 text-[14px]">|</span>
            <span className={product.quantity > 0 ? "text-green-500 text-[14px]" : "text-red-500 text-[14px]"}>
              {product.quantity > 0 ? t('product.inStock', 'In Stock') : t('product.outOfStock', 'Out of Stock')}
            </span>
          </div>
          
          <p className="text-[24px] font-medium text-black dark:text-white mb-[24px]">
            ${product.hasDiscount ? product.discountPrice : product.price}.00
          </p>
          
          <p className="text-[14px] text-black dark:text-white leading-[21px] mb-[24px] max-w-[370px]">
            {t(`dynamic.products.${product.productName}_desc`, product.description) || 'No description available for this product.'}
          </p>
          
          <hr className="border-gray-300 dark:border-zinc-700 mb-[24px] max-w-[400px]" />
          
          <div className="flex items-center gap-[24px] mb-[24px]">
            <span className="text-[20px] text-black dark:text-white font-medium">{t('product.colours', 'Colours')}:</span>
            <div className="flex items-center gap-[8px]">
              {product.color?.colorName ? (
                <div 
                  className={`w-[20px] h-[20px] rounded-full cursor-pointer ring-2 ring-offset-2 ring-black`}
                  style={{ backgroundColor: product.color.colorName.toLowerCase() }}
                  title={product.color.colorName}
                ></div>
              ) : (
                <div className="w-[20px] h-[20px] rounded-full bg-blue-200 cursor-pointer ring-2 ring-offset-2 ring-black"></div>
              )}
              <div className="w-[20px] h-[20px] rounded-full bg-red-400 cursor-pointer"></div>
            </div>
          </div>
          {sizes.length > 0 && (
            <div className="flex items-center gap-[24px] mb-[32px]">
              <span className="text-[20px] text-black dark:text-white font-medium">{t('product.size', 'Size')}:</span>
              <div className="flex items-center gap-[16px] flex-wrap">
                {sizes.map((size) => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-[32px] h-[32px] rounded-[4px] border ${selectedSize === size ? 'bg-[#DB4444] border-[#DB4444] text-white' : 'border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-white'} flex items-center justify-center text-[14px] font-medium transition-colors`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-[16px] mb-[40px]">
            <div className="flex items-center border border-gray-300 dark:border-zinc-700 rounded-[4px] h-[44px]">
              <button 
                onClick={() => handleQuantityChange('dec')}
                className="w-[40px] h-full flex items-center justify-center hover:bg-[#DB4444] hover:text-white hover:border-[#DB4444] rounded-l-[4px] transition-colors"
              >
                <Minus size={20} />
              </button>
              <div className="w-[80px] h-full flex items-center justify-center border-x border-gray-300 dark:border-zinc-700 font-medium text-[20px]">
                {quantity}
              </div>
              <button 
                onClick={() => handleQuantityChange('inc')}
                className="w-[40px] h-full flex items-center justify-center bg-[#DB4444] text-white border-[#DB4444] rounded-r-[4px] transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
            
            <button 
              onClick={(e) => handleAddToCart(e, product, quantity)}
              className="bg-[#DB4444] text-white font-medium px-[48px] h-[44px] rounded-[4px] hover:bg-red-600 transition-colors"
            >
              {t('product.addToCart', 'Add To Cart')}
            </button>
            
            <button 
              onClick={(e) => handleWishlist(e, product)}
              className={`w-[40px] h-[44px] border border-gray-300 dark:border-zinc-700 rounded-[4px] flex items-center justify-center transition-colors 
                ${wishlistItems.some(item => item.id === product.id) ? 'bg-red-50 text-red-500 border-red-200' : 'hover:bg-gray-100 text-gray-700 dark:text-zinc-200'}`}
            >
              <Heart size={20} fill={wishlistItems.some(item => item.id === product.id) ? "currentColor" : "none"} className={wishlistItems.some(item => item.id === product.id) ? "text-red-500" : ""} />
            </button>
          </div>
          
          <div className="flex flex-col border border-gray-300 dark:border-zinc-700 rounded-[4px] max-w-[400px]">
            <div className="flex items-center gap-[16px] p-[24px] border-b border-gray-300 dark:border-zinc-700">
              <Truck size={40} strokeWidth={1} />
              <div className="flex flex-col gap-[8px]">
                <span className="font-medium text-black dark:text-white">{t('product.delivery', 'Free Delivery')}</span>
                <span className="text-[12px] text-black dark:text-white underline cursor-pointer">{t('product.deliveryDesc', 'Enter your postal code for Delivery Availability')}</span>
              </div>
            </div>
            <div className="flex items-center gap-[16px] p-[24px]">
              <RefreshCcw size={40} strokeWidth={1} />
              <div className="flex flex-col gap-[8px]">
                <span className="font-medium text-black dark:text-white">{t('product.return', 'Return Delivery')}</span>
                <span className="text-[12px] text-black dark:text-white">{t('product.returnDesc', 'Free 30 Days Delivery Returns. Details')}</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
      
      {relatedProducts.length > 0 && (
        <div className="flex flex-col gap-[60px] mb-[40px]">
          <div className="flex items-center gap-[16px]">
            <div className="w-[20px] h-[40px] bg-[#DB4444] rounded-[4px]"></div>
            <span className="text-[#DB4444] font-semibold text-[16px]">Related Item</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[30px]">
            {relatedProducts.map((product) => (
              <Link 
                to={`/product/${product.id}`}
                key={product.id} 
                className="group flex flex-col h-full cursor-pointer"
              >
                <div className="bg-[#F5F5F5] dark:bg-zinc-800 rounded-[4px] relative overflow-hidden h-[250px] flex items-center justify-center p-[40px]">
                  {product.hasDiscount && (
                    <span className="absolute top-[12px] left-[12px] bg-[#DB4444] text-white text-[12px] px-[12px] py-[4px] rounded-[4px]">
                      -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                    </span>
                  )}
                  
                  <div className="absolute top-[12px] right-[12px] flex flex-col gap-[8px]">
                    <button 
                      onClick={(e) => handleWishlist(e, product)}
                      className={`p-[6px] rounded-full transition-colors shadow-sm 
                        ${wishlistItems.some(item => item.id === product.id) ? 'bg-red-50 text-red-500' : 'bg-white dark:bg-zinc-900 hover:bg-gray-200'}`}
                    >
                      <Heart size={20} fill={wishlistItems.some(item => item.id === product.id) ? "currentColor" : "none"} className={wishlistItems.some(item => item.id === product.id) ? "text-red-500" : ""} />
                    </button>
                    <button className="bg-white dark:bg-zinc-900 p-[6px] rounded-full hover:bg-gray-200 transition-colors shadow-sm">
                      <span className="text-[20px]">👁</span>
                    </button>
                  </div>
                  
                  <img 
                    src={getImageUrl(product.image)} 
                    alt={product.productName} 
                    className="w-[80%] h-[80%] object-contain group-hover:scale-105 transition-transform duration-300 mix-blend-multiply dark:mix-blend-normal"
                  />
                  
                  <button 
                    onClick={(e) => handleAddToCart(e, product)}
                    className="absolute bottom-0 left-0 right-0 bg-black text-white py-[8px] text-[16px] font-medium transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                  >
                    {t('product.addToCart', 'Add To Cart')}
                  </button>
                </div>

                <div className="pt-[16px] flex flex-col gap-[8px]">
                  <h3 className="font-medium text-[16px] text-black dark:text-white line-clamp-1">
                    {t(`dynamic.products.${product.productName}`, product.productName) as string}
                  </h3>
                  
                  <div className="flex items-center gap-[12px]">
                    <span className="text-[#DB4444] font-medium text-[16px]">
                      ${product.hasDiscount ? product.discountPrice : product.price}
                    </span>
                    {product.hasDiscount && (
                      <span className="text-gray-400 line-through text-[16px]">
                        ${product.price}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-[8px]">
                    <div className="flex text-amber-400 text-[14px]">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <span key={index}>
                          {index < Math.floor(product.rating || 0) ? '★' : '☆'}
                        </span>
                      ))}
                    </div>
                    <span className="text-[14px] text-gray-500 dark:text-zinc-400 font-semibold">
                      ({product.quantity || 0})
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      
    </div>
  );
});

export default ProductDetail;
