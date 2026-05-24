import { memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { type RootState } from '../../store/store';
import { removeFromCart, updateQuantity, clearCart } from '../../store/cartSlice';
import { ChevronUp, ChevronDown, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Cart = memo(() => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.hasDiscount ? item.discountPrice : item.price;
    return acc + (price * item.quantity);
  }, 0);

  const handleQuantityChange = (id: string | number, currentQuantity: number, type: 'inc' | 'dec') => {
    if (type === 'inc') {
      dispatch(updateQuantity({ id, quantity: currentQuantity + 1 }));
    } else if (type === 'dec' && currentQuantity > 1) {
      dispatch(updateQuantity({ id, quantity: currentQuantity - 1 }));
    }
  };

  const handleRemove = (id: string | number) => {
    dispatch(removeFromCart(id));
  };

  const getImageUrl = (image: string) => {
    if (image && image.startsWith('http')) return image;
    return `https://fastcard-1-o23z.onrender.com/uploads/images/${image}${image && image.includes('.') ? '' : '.jpg'}`;
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-[16px] md:px-[32px] pt-[20px] pb-[80px] font-sans text-black dark:text-white">
      
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <h2 className="text-2xl font-semibold mb-4">{t('cart.empty')}</h2>
          <Link to="/" className="bg-[#DB4444] text-white px-8 py-3 rounded hover:bg-red-600 transition-colors">
            {t('cart.returnToShop')}
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-[40px]">
          <div className="flex items-center gap-[12px] text-[14px] mb-[80px]">
            <Link to="/" className="text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">{t('header.home')}</Link>
            <span className="text-zinc-500 dark:text-zinc-400">/</span>
            <span className="text-black dark:text-white font-medium">{t('cart.title')}</span>
          </div>

          <div className="hidden md:grid grid-cols-4 gap-4 py-[24px] px-[40px] bg-white dark:bg-zinc-900 shadow-[0_1px_13px_rgba(0,0,0,0.05)] dark:shadow-[0_1px_13px_rgba(255,255,255,0.02)] rounded-[4px] mb-[40px] text-[16px] font-medium text-black dark:text-white border dark:border-zinc-800">
            <div>{t('cart.product')}</div>
            <div className="text-center">{t('cart.price')}</div>
            <div className="text-center">{t('cart.quantity')}</div>
            <div className="text-right">{t('cart.subtotal')}</div>
          </div>

          <div className="flex flex-col gap-[20px]">
            {cartItems.map((item) => {
              const price = item.hasDiscount ? item.discountPrice : item.price;
              const itemSubtotal = price * item.quantity;

              return (
                <div key={item.id} className="relative flex flex-col md:grid md:grid-cols-4 items-center bg-white dark:bg-zinc-900 shadow-[0_1px_13px_rgba(0,0,0,0.05)] rounded-[4px] py-[24px] px-[40px] gap-4 md:gap-0">
                  
                  <button 
                    onClick={() => handleRemove(item.id)}
                    className="md:hidden absolute top-4 right-4 text-red-500"
                  >
                    <X size={20} />
                  </button>

                  <div className="flex items-center gap-[20px] w-full md:w-auto">
                    <img 
                      src={getImageUrl(item.image)} 
                      alt={item.productName} 
                      className="w-[50px] h-[50px] object-contain"
                    />
                    <span className="font-medium text-[16px] truncate">{item.productName}</span>
                  </div>
                  
                  <div className="w-full md:w-auto flex justify-between md:block md:text-center font-medium">
                    <span className="md:hidden text-gray-500 dark:text-zinc-400">{t('cart.price')}:</span>
                    ${price}
                  </div>
                  
                  <div className="w-full md:w-auto flex justify-between md:justify-center items-center">
                    <span className="md:hidden text-gray-500 dark:text-zinc-400 font-medium">{t('cart.quantity')}:</span>
                    <div className="w-[72px] h-[44px] border border-gray-300 dark:border-zinc-700 rounded-[4px] flex items-center justify-between px-[12px]">
                      <span className="font-medium">{String(item.quantity).padStart(2, '0')}</span>
                      <div className="flex flex-col">
                        <button onClick={() => handleQuantityChange(item.id, item.quantity, 'inc')} className="hover:text-[#DB4444] transition-colors">
                          <ChevronUp size={16} />
                        </button>
                        <button onClick={() => handleQuantityChange(item.id, item.quantity, 'dec')} className="hover:text-[#DB4444] transition-colors">
                          <ChevronDown size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-auto flex justify-between md:justify-end items-center font-medium">
                    <span className="md:hidden text-gray-500 dark:text-zinc-400">{t('cart.subtotal')}:</span>
                    ${itemSubtotal}
                    
                    <button 
                      onClick={() => handleRemove(item.id)}
                      className="hidden md:flex ml-[20px] w-[24px] h-[24px] bg-[#DB4444] text-white rounded-full items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-[24px]">
            <Link 
              to="/" 
              className="w-full sm:w-auto px-[48px] py-[16px] border border-black dark:border-zinc-700 rounded-[4px] text-[16px] font-medium hover:bg-black hover:text-white dark:hover:bg-zinc-800 transition-colors text-center text-black dark:text-white"
            >
              {t('cart.returnToShop')}
            </Link>
            <button 
              onClick={() => dispatch(clearCart())}
              className="w-full sm:w-auto px-[48px] py-[16px] border border-black dark:border-zinc-700 rounded-[4px] text-[16px] font-medium hover:bg-black hover:text-white dark:hover:bg-zinc-800 transition-colors text-black dark:text-white"
            >
              {t('cart.updateCart')}
            </button>
          </div>

          <div className="flex flex-col lg:flex-row justify-between gap-[40px] lg:gap-[80px] mt-[80px]">
            <div className="flex gap-[16px] items-start w-full lg:w-[50%]">
              <input 
                type="text" 
                placeholder={t('cart.coupon')} 
                className="flex-grow max-w-[300px] border border-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-white rounded-[4px] px-[24px] py-[16px] outline-none focus:border-red-500 transition-colors text-black"
              />
              <button className="px-[48px] py-[16px] bg-[#DB4444] text-white rounded-[4px] font-medium hover:bg-red-600 transition-colors whitespace-nowrap">
                {t('cart.applyCoupon')}
              </button>
            </div>

            <div className="w-full lg:w-[470px] border-[1.5px] border-black dark:border-zinc-700 rounded-[4px] px-[24px] py-[32px] dark:bg-zinc-900">
              <h2 className="text-[20px] font-medium mb-[24px] text-black dark:text-white">{t('cart.cartTotal')}</h2>
              
              <div className="flex justify-between pb-[16px] border-b border-black/20 dark:border-zinc-700 mb-[16px] text-black dark:text-zinc-300">
                <span>{t('cart.subtotal')}:</span>
                <span>${subtotal}</span>
              </div>
              
              <div className="flex justify-between pb-[16px] border-b border-black/20 dark:border-zinc-700 mb-[16px] text-black dark:text-zinc-300">
                <span>{t('cart.shipping')}:</span>
                <span>{t('cart.free')}</span>
              </div>
              
              <div className="flex justify-between mb-[24px] text-black dark:text-white font-medium">
                <span>{t('cart.total')}:</span>
                <span>${subtotal}</span>
              </div>
              
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-[#DB4444] text-white font-medium py-[16px] rounded-[4px] hover:bg-red-600 transition-colors"
              >
                {t('cart.proceedToCheckout')}
              </button>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
});

export default Cart;
