import { memo, useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Heart } from 'lucide-react';
import { axiosRequest } from '../../utils/token';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../../store/wishlistSlice';
import { addToCart } from '../../store/cartSlice';
import {type RootState } from '../../store/store';
import { useTranslation } from 'react-i18next';

interface Category {
  id: number;
  categoryName: string;
}

interface Brand {
  id: number;
  brandName: string;
}

interface Product {
  id: number;
  productName: string;
  price: number;
  discountPrice: number;
  hasDiscount: boolean;
  quantity: number;
  image: string;
  rating: number;
  categoryId: number;
  brandId: number;
}

const ProductsPage = memo(() => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const initialCategoryId = searchParams.get('categoryId');

  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  const handleWishlist = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    dispatch(toggleWishlist(product));
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    dispatch(addToCart(product));
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    initialCategoryId ? Number(initialCategoryId) : null
  );
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [condition, setCondition] = useState<string>('Any');
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);

  const [sortBy, setSortBy] = useState('Popularity');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const catRes = await axiosRequest.get('/Category/get-categories');
        if (catRes.data?.statusCode === 200) {
          setCategories(catRes.data.data || []);
        }

        const brandRes = await axiosRequest.get('/Brand/get-brands');
        if (brandRes.data?.statusCode === 200) {
          setBrands(brandRes.data.data.brands || []);
        }

        let productUrl = '/Product/get-products';
        const params = new URLSearchParams();
        if (selectedCategory) params.append('CategoryId', selectedCategory.toString());
        // For brands, if API doesn't support multiple, we do it client side

        if (params.toString()) {
          productUrl += `?${params.toString()}`;
        }

        const prodRes = await axiosRequest.get(productUrl);
        if (prodRes.data?.statusCode === 200) {
          setProducts(prodRes.data.data.products || []);
        }
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory]);

  const filteredProducts = products.filter(product => {
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brandId)) return false;

    if (minPrice && product.price < Number(minPrice)) return false;
    if (maxPrice && product.price > Number(maxPrice)) return false;

    if (selectedRatings.length > 0) {
      const pRating = Math.floor(product.rating || 0);
      if (!selectedRatings.includes(pRating)) return false;
    }

    if (condition !== 'Any') {
      const conditions = ['Any', 'Refurbished', 'Brand new', 'Old items'];
      const productCondition = conditions[(product.id % 3) + 1]; // 1, 2, or 3
      if (productCondition !== condition) return false;
    }

    if (selectedFeatures.length > 0) {
      const allFeatures = ['Metallic', 'Plastic cover', '8GB Ram', 'Super power', 'Large Memory'];
      const productFeatures = [
        allFeatures[product.id % allFeatures.length],
        allFeatures[(product.id + 2) % allFeatures.length]
      ];
      const hasAnySelectedFeature = selectedFeatures.some(f => productFeatures.includes(f));
      if (!hasAnySelectedFeature) return false;
    }

    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'Price (Low to High)') return a.price - b.price;
    if (sortBy === 'Price (High to Low)') return b.price - a.price;
    return 0;
  });

  const toggleBrand = (id: number) => {
    setSelectedBrands(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev =>
      prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]
    );
  };

  const toggleRating = (rating: number) => {
    setSelectedRatings(prev =>
      prev.includes(rating) ? prev.filter(r => r !== rating) : [...prev, rating]
    );
  };

  const featuresList = ['Metallic', 'Plastic cover', '8GB Ram', 'Super power', 'Large Memory'];

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    category: true,
    brands: true,
    features: true,
    price: true,
    condition: true,
    ratings: true,
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setOpenSections({
          category: false,
          brands: false,
          features: false,
          price: false,
          condition: false,
          ratings: false,
        });
      } else {
        setOpenSections({
          category: true,
          brands: true,
          features: true,
          price: true,
          condition: true,
          ratings: true,
        });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-[16px] md:px-[32px] pt-[20px] pb-[80px] font-sans text-black dark:text-white">
      <div className="flex items-center gap-[8px] text-[14px] mb-[40px]">
        <Link to="/" className="text-gray-500 dark:text-zinc-400 hover:text-black dark:hover:text-white dark:text-white transition-colors">{t('header.home')}</Link>
        <span className="text-gray-500 dark:text-zinc-400">/</span>
        <span className="font-medium">{t('home.allProducts')}</span>
      </div>

      <div className="flex flex-col md:flex-row gap-[40px]">
        <div className="w-full md:w-[260px] flex-shrink-0 flex flex-col gap-[30px]">
          <div className="flex flex-col gap-[16px]">
            <div 
              className="flex items-center justify-between font-semibold text-[16px] cursor-pointer"
              onClick={() => toggleSection('category')}
            >
              <span>{t('header.category')}</span>
              {openSections.category ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            {openSections.category && (
              <div className="flex flex-col gap-[12px] text-[15px] text-gray-600 dark:text-zinc-300">
                <span
                  className={`cursor-pointer transition-colors ${selectedCategory === null ? 'text-black dark:text-white font-medium' : 'hover:text-black dark:hover:text-white dark:text-white'}`}
                  onClick={() => setSelectedCategory(null)}
                >
                  {t('home.allProducts')}
                </span>
                {categories.map(c => (
                  <span
                    key={c.id}
                    className={`cursor-pointer transition-colors ${selectedCategory === c.id ? 'text-black dark:text-white font-medium' : 'hover:text-black dark:hover:text-white dark:text-white'}`}
                    onClick={() => setSelectedCategory(c.id)}
                  >
                    {t(`dynamic.categories.${c.categoryName}`, c.categoryName)}
                  </span>
                ))}
                <span className="text-[#DB4444] cursor-pointer hover:underline text-[14px]">{t('home.viewAll')}</span>
              </div>
            )}
          </div>

          <hr className="border-gray-200 dark:border-zinc-700" />

          <div className="flex flex-col gap-[16px]">
            <div 
              className="flex items-center justify-between font-semibold text-[16px] cursor-pointer"
              onClick={() => toggleSection('brands')}
            >
              <span>{t('header.brands')}</span>
              {openSections.brands ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            {openSections.brands && (
              <div className="flex flex-col gap-[12px] text-[15px]">
                {brands.slice(0, 5).map(b => (
                  <label key={b.id} className="flex items-center gap-[12px] cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(b.id)}
                      onChange={() => toggleBrand(b.id)}
                      className="w-[18px] h-[18px] border-gray-300 dark:border-zinc-700 rounded-[4px] accent-black cursor-pointer"
                    />
                    <span className="text-gray-600 dark:text-zinc-300 group-hover:text-black dark:hover:text-white dark:text-white">{b.brandName}</span>
                  </label>
                ))}
                {brands.length > 5 && (
                  <span className="text-[#DB4444] cursor-pointer hover:underline text-[14px]">See all</span>
                )}
              </div>
            )}
          </div>

          <hr className="border-gray-200 dark:border-zinc-700" />

          <div className="flex flex-col gap-[16px]">
            <div 
              className="flex items-center justify-between font-semibold text-[16px] cursor-pointer"
              onClick={() => toggleSection('features')}
            >
              <span>Features</span>
              {openSections.features ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            {openSections.features && (
              <div className="flex flex-col gap-[12px] text-[15px]">
                {featuresList.map(f => (
                  <label key={f} className="flex items-center gap-[12px] cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedFeatures.includes(f)}
                      onChange={() => toggleFeature(f)}
                      className="w-[18px] h-[18px] border-gray-300 dark:border-zinc-700 rounded-[4px] accent-black cursor-pointer"
                    />
                    <span className="text-gray-600 dark:text-zinc-300 group-hover:text-black dark:hover:text-white dark:text-white">{f}</span>
                  </label>
                ))}
                <span className="text-[#DB4444] cursor-pointer hover:underline text-[14px]">See all</span>
              </div>
            )}
          </div>

          <hr className="border-gray-200 dark:border-zinc-700" />

          <div className="flex flex-col gap-[16px]">
            <div 
              className="flex items-center justify-between font-semibold text-[16px] cursor-pointer"
              onClick={() => toggleSection('price')}
            >
              <span>{t('header.price')}</span>
              {openSections.price ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            {openSections.price && (
              <div className="flex flex-col gap-[16px]">
                <div className="relative w-full h-[4px] bg-gray-200 rounded-full mt-2">
                  <div className="absolute left-[20%] right-[30%] h-full bg-[#DB4444]"></div>
                  <div className="absolute left-[20%] top-1/2 -translate-y-1/2 w-[16px] h-[16px] bg-white dark:bg-zinc-900 border-[2px] border-[#DB4444] rounded-full"></div>
                  <div className="absolute right-[30%] top-1/2 -translate-y-1/2 w-[16px] h-[16px] bg-white dark:bg-zinc-900 border-[2px] border-[#DB4444] rounded-full"></div>
                </div>
                <div className="flex items-center gap-[12px]">
                  <div className="flex-1">
                    <label className="text-[12px] text-gray-500 dark:text-zinc-400 mb-1 block">Min</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full border border-gray-300 dark:border-zinc-700 rounded-[4px] p-2 text-[14px] focus:outline-none focus:border-black dark:border-zinc-700"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[12px] text-gray-500 dark:text-zinc-400 mb-1 block">Max</label>
                    <input
                      type="number"
                      placeholder="999999"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full border border-gray-300 dark:border-zinc-700 rounded-[4px] p-2 text-[14px] focus:outline-none focus:border-black dark:border-zinc-700"
                    />
                  </div>
                </div>
                <button className="w-full py-[10px] border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-200 font-medium rounded-[4px] hover:border-[#DB4444] hover:text-[#DB4444] transition-colors mt-2">
                  Apply
                </button>
              </div>
            )}
          </div>

          <hr className="border-gray-200 dark:border-zinc-700" />

          {/* Condition */}
          <div className="flex flex-col gap-[16px]">
            <div 
              className="flex items-center justify-between font-semibold text-[16px] cursor-pointer"
              onClick={() => toggleSection('condition')}
            >
              <span>Condition</span>
              {openSections.condition ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            {openSections.condition && (
              <div className="flex flex-col gap-[12px] text-[15px]">
                {['Any', 'Refurbished', 'Brand new', 'Old items'].map(cond => (
                  <label key={cond} className="flex items-center gap-[12px] cursor-pointer group">
                    <input
                      type="radio"
                      name="condition"
                      checked={condition === cond}
                      onChange={() => setCondition(cond)}
                      className="w-[18px] h-[18px] border-gray-300 dark:border-zinc-700 accent-[#DB4444] cursor-pointer"
                    />
                    <span className="text-gray-600 dark:text-zinc-300 group-hover:text-black dark:hover:text-white dark:text-white">{cond}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <hr className="border-gray-200 dark:border-zinc-700" />

          {/* Ratings */}
          <div className="flex flex-col gap-[16px]">
            <div 
              className="flex items-center justify-between font-semibold text-[16px] cursor-pointer"
              onClick={() => toggleSection('ratings')}
            >
              <span>Ratings</span>
              {openSections.ratings ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            {openSections.ratings && (
              <div className="flex flex-col gap-[12px] text-[15px]">
                {[5, 4, 3, 2].map(rating => (
                  <label key={rating} className="flex items-center gap-[12px] cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedRatings.includes(rating)}
                      onChange={() => toggleRating(rating)}
                      className="w-[18px] h-[18px] border-gray-300 dark:border-zinc-700 rounded-[4px] accent-black cursor-pointer"
                    />
                    <div className="flex text-[#FFAD33] text-[14px]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < rating ? '' : 'text-gray-300'}>★</span>
                      ))}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">

          <div className="flex justify-end mb-[30px]">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none border border-gray-200 dark:border-zinc-700 rounded-[4px] px-[16px] py-[8px] pr-[40px] text-[14px] text-gray-700 dark:text-zinc-200 bg-white dark:bg-zinc-900 focus:outline-none focus:border-black dark:border-zinc-700 cursor-pointer"
              >
                <option value="Popularity">Popularity</option>
                <option value="Price (Low to High)">Price (Low to High)</option>
                <option value="Price (High to Low)">Price (High to Low)</option>
              </select>
              <ChevronDown size={16} className="absolute right-[12px] top-1/2 -translate-y-1/2 text-gray-500 dark:text-zinc-400 pointer-events-none" />
            </div>
          </div>

          {loading ? (
            <div className="w-full py-20 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-zinc-700"></div>
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="w-full py-20 flex justify-center text-gray-500 dark:text-zinc-400">
              No products found matching the criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-[40px] gap-x-[30px]">
              {sortedProducts.map((product, index) => {
                const discountPercent = product.hasDiscount && product.discountPrice < product.price
                  ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
                  : 0;

                const imgUrl = product.image && product.image.startsWith('http')
                  ? product.image
                  : `https://fastcard-1-o23z.onrender.com/uploads/images/${product.image}${product.image && product.image.includes('.') ? '' : '.jpg'}`;

                const isNew = index < 2; // fake new flag for design

                return (
                  <div key={product.id} className="group flex flex-col h-full">
                    <div className="relative bg-[#F5F5F5] dark:bg-zinc-800 rounded-[4px] p-[16px] h-[250px] flex items-center justify-center overflow-hidden transition-all duration-300">

                      {discountPercent > 0 ? (
                        <span className="absolute top-[12px] left-[12px] bg-[#DB4444] text-white text-[12px] font-semibold px-[12px] py-[4px] rounded-[4px] z-10">
                          -{discountPercent}%
                        </span>
                      ) : isNew ? (
                        <span className="absolute top-[12px] left-[12px] bg-[#00FF66] text-white text-[12px] font-semibold px-[12px] py-[4px] rounded-[4px] z-10">
                          NEW
                        </span>
                      ) : null}

                      <div className="absolute top-[12px] right-[12px] flex flex-col gap-[8px] z-10">
                        <button className="w-[34px] h-[34px] bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center shadow-sm text-gray-700 dark:text-zinc-200 hover:bg-red-500 hover:text-white transition-colors duration-200">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                          </svg>
                        </button>
                        <button 
                          onClick={(e) => handleWishlist(e, product)}
                          className={`w-[34px] h-[34px] bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center shadow-sm transition-colors duration-200 
                            ${wishlistItems.some(item => item.id === product.id) ? 'text-red-500 hover:bg-red-50' : 'text-gray-700 dark:text-zinc-200 hover:bg-red-500 hover:text-white'}`}
                        >
                          <Heart size={16} fill={wishlistItems.some(item => item.id === product.id) ? "currentColor" : "none"} className={wishlistItems.some(item => item.id === product.id) ? "text-red-500" : ""} />
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
                        {product.hasDiscount && (
                          <span className="text-gray-400 line-through text-[16px] font-medium">
                            ${product.price}
                          </span>
                        )}
                        <div className="flex items-center gap-[8px]">
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
                      </div>

                      {/* Fake Color options for design matching */}
                      <div className="flex items-center gap-[8px] mt-[4px]">
                        <button className="w-[20px] h-[20px] rounded-full bg-black border-[2px] border-white shadow-[0_0_0_1px_#000]"></button>
                        <button className="w-[20px] h-[20px] rounded-full bg-[#DB4444] hover:shadow-[0_0_0_1px_#DB4444] transition-shadow"></button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && sortedProducts.length > 0 && (
            <div className="flex justify-center mt-[60px]">
              <button className="bg-[#DB4444] text-white font-medium px-[48px] py-[16px] rounded-[4px] hover:bg-red-600 transition-colors">
                More Products
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default ProductsPage;
