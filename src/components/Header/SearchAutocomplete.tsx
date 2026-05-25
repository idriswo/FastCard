import React, { useState, useEffect, useRef, memo } from 'react';
import { Search, Loader2, X, Smartphone, Shirt, Home, Dumbbell, Gift, Camera, Monitor, Watch, Headphones, Gamepad2, ArrowRight, Heart, ShoppingCart, ShoppingBag, Tag } from 'lucide-react';
import { Input } from "../ui/input";
import { useTranslation } from 'react-i18next';
import { axiosRequest } from '../../utils/token';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '../../store/store';

interface Category {
  id: number;
  categoryName: string;
}

interface Brand {
  id: number;
  brandName: string;
}

interface Product {
  id: string | number;
  productName: string;
  price: number;
  discountPrice: number;
  hasDiscount: boolean;
  image: string;
}

const getCategoryIcon = (categoryName: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    Electronics: <Smartphone size={18} />,
    Fashion: <Shirt size={18} />,
    'Home & Garden': <Home size={18} />,
    Sports: <Dumbbell size={18} />,
    Toys: <Gift size={18} />,
    Camera: <Camera size={18} />,
    Computers: <Monitor size={18} />,
    SmartWatch: <Watch size={18} />,
    HeadPhones: <Headphones size={18} />,
    Gaming: <Gamepad2 size={18} />,
  };
  return iconMap[categoryName] || <Search size={18} />;
};

interface SearchAutocompleteProps {
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

// Global cache to avoid refetching on every focus
let cachedProducts: Product[] | null = null;
let cachedCategories: Category[] | null = null;
let cachedBrands: Brand[] | null = null;

const SearchAutocomplete = memo(({ isMobile = false, onCloseMobile }: SearchAutocompleteProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const orders = useSelector((state: RootState) => state.orders.orders);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch data on focus if not already cached
  const handleFocus = async () => {
    setIsFocused(true);
    if (!cachedProducts || !cachedCategories) {
      setLoading(true);
      try {
        const [prodRes, catRes, brandRes] = await Promise.all([
          axiosRequest.get("/Product/get-products"),
          axiosRequest.get("/Category/get-categories"),
          axiosRequest.get("/Brand/get-brands")
        ]);
        
        if (prodRes.data?.statusCode === 200) {
          cachedProducts = prodRes.data.data?.products || [];
          setProducts(cachedProducts || []);
        }
        if (catRes.data?.statusCode === 200) {
          cachedCategories = catRes.data.data || [];
          setCategories(cachedCategories || []);
        }
        if (brandRes.data?.statusCode === 200) {
          cachedBrands = brandRes.data.data?.brands || [];
          setBrands(cachedBrands || []);
        }
      } catch (err) {
        console.error("Error fetching search data:", err);
      } finally {
        setLoading(false);
      }
    } else {
      setProducts(cachedProducts);
      setCategories(cachedCategories);
      setBrands(cachedBrands || []);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCategories = query.trim() === '' 
    ? [] 
    : categories.filter(c => c.categoryName.toLowerCase().includes(query.toLowerCase())).slice(0, 3);

  const filteredBrands = query.trim() === '' 
    ? [] 
    : brands.filter(b => b.brandName.toLowerCase().includes(query.toLowerCase())).slice(0, 3);

  const filteredWishlist = query.trim() === '' 
    ? [] 
    : wishlistItems.filter(p => p.productName.toLowerCase().includes(query.toLowerCase())).slice(0, 3);

  const filteredCart = query.trim() === '' 
    ? [] 
    : cartItems.filter(p => p.productName.toLowerCase().includes(query.toLowerCase())).slice(0, 3);

  const filteredOrders = query.trim() === '' 
    ? [] 
    : orders.filter(o => o.id.toLowerCase().includes(query.toLowerCase()) || o.items.some(i => i.productName.toLowerCase().includes(query.toLowerCase()))).slice(0, 2);

  const filteredProducts = query.trim() === '' 
    ? [] 
    : products.filter(p => p.productName.toLowerCase().includes(query.toLowerCase())).slice(0, 5);

  const hasResults = filteredCategories.length > 0 || filteredBrands.length > 0 || filteredWishlist.length > 0 || filteredCart.length > 0 || filteredOrders.length > 0 || filteredProducts.length > 0;
  const showDropdown = isFocused && query.trim().length > 0;

  const handleProductClick = (id: string | number) => {
    setIsFocused(false);
    if (onCloseMobile) onCloseMobile();
    setQuery('');
    navigate(`/product/${id}`);
  };

  const handleCategoryClick = (id: number) => {
    setIsFocused(false);
    if (onCloseMobile) onCloseMobile();
    setQuery('');
    navigate(`/products?categoryId=${id}`);
  };

  const handleBrandClick = (id: number) => {
    setIsFocused(false);
    if (onCloseMobile) onCloseMobile();
    setQuery('');
    navigate(`/products?brandId=${id}`);
  };

  const handleNavigate = (path: string) => {
    setIsFocused(false);
    if (onCloseMobile) onCloseMobile();
    setQuery('');
    navigate(path);
  };

  const searchInputClasses = isMobile
    ? "w-full pl-[16px] pr-[40px] py-[8px] text-[13px] rounded-md border border-zinc-200 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none"
    : `w-full pl-[16px] pr-[40px] py-[8.5px] text-[13px] rounded-lg border border-zinc-200 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none placeholder:text-zinc-400 dark:text-zinc-500 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] focus:bg-white dark:bg-zinc-900 focus:border-zinc-900 focus:shadow-[0_0_0_4px_rgba(24,24,27,0.05)]`;

  return (
    <div className={`relative ${isMobile ? 'w-full mb-4' : 'flex-grow max-w-[280px] group'}`}>
      <div className="relative w-full">
        <Input 
          ref={inputRef}
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          placeholder={t('header.searchPlaceholder', 'What are you looking for?')} 
          className={searchInputClasses} 
        />
        <div className="absolute top-1/2 right-[12px] -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-md transition-colors duration-200 group-focus-within:bg-zinc-100 dark:bg-zinc-800">
          {query && isFocused ? (
            <X onClick={() => setQuery('')} className="w-4 h-4 text-zinc-400 dark:text-zinc-500 hover:text-red-500 cursor-pointer" />
          ) : (
            <Search className="w-4 h-4 text-zinc-400 dark:text-zinc-500 transition-colors duration-300 group-focus-within:text-zinc-900 dark:text-white cursor-pointer" />
          )}
        </div>
      </div>

      {showDropdown && (
        <div 
          ref={dropdownRef}
          className={`absolute ${isMobile ? 'top-full left-0 right-0' : 'top-[calc(100%+8px)] left-0 right-0'} bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl z-[100] overflow-hidden animate-[fadeIn_0.2s_ease-out]`}
        >
          {loading ? (
            <div className="p-6 flex flex-col items-center justify-center text-zinc-500 dark:text-zinc-400">
              <Loader2 className="w-6 h-6 animate-spin mb-2" />
              <span className="text-[13px]">Searching...</span>
            </div>
          ) : !hasResults ? (
            <div className="p-6 text-center text-zinc-500 dark:text-zinc-400 text-[13px]">
              No results found for "<span className="font-semibold text-zinc-900 dark:text-white">{query}</span>"
            </div>
          ) : (
            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
              
              {/* Categories Section */}
              {filteredCategories.length > 0 && (
                <div className="p-2">
                  <div className="px-3 py-2 text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    Categories
                  </div>
                  <div className="flex flex-col">
                    {filteredCategories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.id)}
                        className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group/item"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-md text-red-500 group-hover/item:bg-white dark:group-hover/item:bg-zinc-700 transition-colors">
                            {getCategoryIcon(cat.categoryName)}
                          </div>
                          <span className="text-[14px] font-medium text-zinc-700 dark:text-zinc-200 group-hover/item:text-zinc-900 dark:group-hover/item:text-white">
                            {cat.categoryName}
                          </span>
                        </div>
                        <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-full group-hover/item:bg-zinc-200 dark:group-hover/item:bg-zinc-700">
                          CATEGORY
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Brands Section */}
              {filteredBrands.length > 0 && (
                <div className="p-2 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="px-3 py-2 text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    Brands
                  </div>
                  <div className="flex flex-col">
                    {filteredBrands.map(brand => (
                      <button
                        key={brand.id}
                        onClick={() => handleBrandClick(brand.id)}
                        className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group/item"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-md text-red-500 group-hover/item:bg-white dark:group-hover/item:bg-zinc-700 transition-colors">
                            <Tag size={18} />
                          </div>
                          <span className="text-[14px] font-medium text-zinc-700 dark:text-zinc-200 group-hover/item:text-zinc-900 dark:group-hover/item:text-white">
                            {brand.brandName}
                          </span>
                        </div>
                        <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-full group-hover/item:bg-zinc-200 dark:group-hover/item:bg-zinc-700">
                          BRAND
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Wishlist Section */}
              {filteredWishlist.length > 0 && (
                <div className="p-2 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="px-3 py-2 text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    In Wishlist
                  </div>
                  <div className="flex flex-col gap-1">
                    {filteredWishlist.map(prod => (
                      <button
                        key={`w-${prod.id}`}
                        onClick={() => handleNavigate('/wishlist')}
                        className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group/item text-left"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <Heart size={14} className="text-red-500 flex-shrink-0" />
                          <span className="text-[13px] font-medium text-zinc-900 dark:text-white truncate">
                            {prod.productName}
                          </span>
                        </div>
                        <span className="text-[10px] bg-red-50 text-red-500 px-2 py-0.5 rounded-full flex-shrink-0">
                          WISHLIST
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Cart Section */}
              {filteredCart.length > 0 && (
                <div className="p-2 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="px-3 py-2 text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    In Cart
                  </div>
                  <div className="flex flex-col gap-1">
                    {filteredCart.map(prod => (
                      <button
                        key={`c-${prod.id}`}
                        onClick={() => handleNavigate('/cart')}
                        className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group/item text-left"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <ShoppingCart size={14} className="text-zinc-500 dark:text-zinc-400 flex-shrink-0" />
                          <span className="text-[13px] font-medium text-zinc-900 dark:text-white truncate">
                            {prod.productName} (x{prod.quantity})
                          </span>
                        </div>
                        <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-full flex-shrink-0">
                          CART
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Orders Section */}
              {filteredOrders.length > 0 && (
                <div className="p-2 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="px-3 py-2 text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    Your Orders
                  </div>
                  <div className="flex flex-col gap-1">
                    {filteredOrders.map(order => (
                      <button
                        key={order.id}
                        onClick={() => handleNavigate('/account')}
                        className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group/item text-left"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <ShoppingBag size={14} className="text-green-600 dark:text-green-500 flex-shrink-0" />
                          <span className="text-[13px] font-medium text-zinc-900 dark:text-white truncate">
                            Order {order.id}
                          </span>
                        </div>
                        <span className="text-[10px] bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full flex-shrink-0">
                          ORDER
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Divider if products exist */}
              {filteredProducts.length > 0 && (
                <div className="h-px bg-zinc-100 dark:bg-zinc-800 mx-4" />
              )}

              {/* Products Section */}
              {filteredProducts.length > 0 && (
                <div className="p-2">
                  <div className="px-3 py-2 text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex justify-between items-center">
                    <span>Products</span>
                    <button 
                      onClick={() => { setIsFocused(false); navigate(`/products?search=${query}`); }}
                      className="text-red-500 hover:text-red-600 flex items-center gap-1 hover:underline"
                    >
                      View All <ArrowRight size={10} />
                    </button>
                  </div>
                  <div className="flex flex-col gap-1">
                    {filteredProducts.map(prod => {
                      const imgUrl = prod.image && prod.image.startsWith('http') 
                        ? prod.image 
                        : `https://fastcard-1-o23z.onrender.com/uploads/images/${prod.image}${prod.image && prod.image.includes('.') ? '' : '.jpg'}`;
                      
                      return (
                        <button
                          key={`p-${prod.id}`}
                          onClick={() => handleProductClick(prod.id)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
                        >
                          <div className="w-[40px] h-[40px] rounded-md bg-[#F5F5F5] dark:bg-zinc-800 flex items-center justify-center overflow-hidden flex-shrink-0 border border-zinc-100 dark:border-zinc-700">
                            <img src={imgUrl} alt={prod.productName} className="w-full h-full object-contain p-1" />
                          </div>
                          <div className="flex flex-col flex-grow min-w-0">
                            <span className="text-[13px] font-medium text-zinc-900 dark:text-white truncate">
                              {prod.productName}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              {prod.hasDiscount ? (
                                <>
                                  <span className="text-[12px] font-bold text-[#DB4444]">${prod.discountPrice}</span>
                                  <span className="text-[11px] text-zinc-400 line-through">${prod.price}</span>
                                </>
                              ) : (
                                <span className="text-[12px] font-bold text-[#DB4444]">${prod.price}</span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default SearchAutocomplete;
