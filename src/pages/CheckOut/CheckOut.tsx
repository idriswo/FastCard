import { memo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { type RootState } from '../../store/store';
import { clearCart } from '../../store/cartSlice';
import { placeOrder } from '../../store/ordersSlice';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const CheckOut = memo(() => {
  const { t } = useTranslation();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'cash'>('cash');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    phone: '',
    email: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.hasDiscount ? item.discountPrice : item.price;
    return acc + (price * item.quantity);
  }, 0);

  const getImageUrl = (image: string) => {
    if (image && image.startsWith('http')) return image;
    return `https://fastcard-1-o23z.onrender.com/uploads/images/${image}${image && image.includes('.') ? '' : '.jpg'}`;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error(t('checkout.cartEmpty', 'Your cart is empty!'), { style: { background: '#333', color: '#fff' } });
      return;
    }
    dispatch(placeOrder({
      items: cartItems,
      total: subtotal,
      paymentMethod,
      shippingInfo: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        city: formData.city,
        phone: formData.phone,
        email: formData.email,
      },
    }));
    dispatch(clearCart());
    toast.success(t('checkout.orderSuccess', 'Order placed successfully!'), { 
      duration: 4000, 
      style: { background: '#4CAF50', color: '#fff', padding: '16px', fontSize: '16px' },
      icon: '🎉'
    });
    navigate('/');
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-[16px] md:px-[32px] pt-[40px] pb-[80px] font-sans text-black dark:text-white">
      
      <div className="flex items-center gap-[8px] text-[14px] mb-[60px]">
        <Link to="/products" className="text-gray-500 dark:text-zinc-400 hover:text-black dark:hover:text-white dark:text-white transition-colors">{t('home.allProducts')}</Link>
        <span className="text-gray-400">/</span>
        <Link to="/cart" className="text-gray-500 dark:text-zinc-400 hover:text-black dark:hover:text-white dark:text-white transition-colors">{t('cart.title')}</Link>
        <span className="text-gray-400">/</span>
        <span className="text-black dark:text-white font-medium">{t('checkout.title')}</span>
      </div>

      <h1 className="text-[36px] font-medium mb-[40px]">{t('checkout.billingDetails')}</h1>

      <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-[80px]">
        
        {/* Left Column - Billing Form */}
        <div className="flex-1 flex flex-col gap-[24px]">
          <input 
            type="text" 
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder={t('checkout.firstName', 'First name')} 
            required
            className="w-full bg-[#F5F5F5] dark:bg-zinc-800 rounded-[4px] px-[16px] py-[16px] outline-none border border-transparent focus:border-gray-300 dark:border-zinc-700 transition-colors"
          />
          <input 
            type="text" 
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder={t('checkout.lastName', 'Last name')} 
            required
            className="w-full bg-[#F5F5F5] dark:bg-zinc-800 rounded-[4px] px-[16px] py-[16px] outline-none border border-transparent focus:border-gray-300 dark:border-zinc-700 transition-colors"
          />
          <input 
            type="text" 
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder={t('checkout.streetAddress', 'Street address')} 
            required
            className="w-full bg-[#F5F5F5] dark:bg-zinc-800 rounded-[4px] px-[16px] py-[16px] outline-none border border-transparent focus:border-gray-300 dark:border-zinc-700 transition-colors"
          />
          <input 
            type="text" 
            name="apartment"
            value={formData.apartment}
            onChange={handleInputChange}
            placeholder={t('checkout.apartment', 'Apartment, floor, etc. (optional)')} 
            className="w-full bg-[#F5F5F5] dark:bg-zinc-800 rounded-[4px] px-[16px] py-[16px] outline-none border border-transparent focus:border-gray-300 dark:border-zinc-700 transition-colors"
          />
          <input 
            type="text" 
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder={t('checkout.townCity', 'Town/City')} 
            required
            className="w-full bg-[#F5F5F5] dark:bg-zinc-800 rounded-[4px] px-[16px] py-[16px] outline-none border border-transparent focus:border-gray-300 dark:border-zinc-700 transition-colors"
          />
          <input 
            type="tel" 
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder={t('checkout.phoneNumber', 'Phone number')} 
            required
            className="w-full bg-[#F5F5F5] dark:bg-zinc-800 rounded-[4px] px-[16px] py-[16px] outline-none border border-transparent focus:border-gray-300 dark:border-zinc-700 transition-colors"
          />
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder={t('checkout.emailAddress', 'Email address')} 
            required
            className="w-full bg-[#F5F5F5] dark:bg-zinc-800 rounded-[4px] px-[16px] py-[16px] outline-none border border-transparent focus:border-gray-300 dark:border-zinc-700 transition-colors"
          />
          
          <label className="flex items-center gap-[16px] mt-[10px] cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input type="checkbox" className="peer appearance-none w-[24px] h-[24px] border-[1.5px] border-[#DB4444] rounded-[4px] checked:bg-[#DB4444] cursor-pointer transition-colors" />
              <svg className="absolute w-[14px] h-[14px] text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <span className="text-[16px] group-hover:text-black dark:hover:text-white dark:text-white transition-colors">{t('checkout.saveInfo')}</span>
          </label>
        </div>

        {/* Right Column - Order Summary */}
        <div className="flex-1 lg:max-w-[450px] flex flex-col pt-[30px]">
          
          {/* Cart Items List */}
          <div className="flex flex-col gap-[30px] mb-[30px]">
            {cartItems.map((item) => {
              const price = item.hasDiscount ? item.discountPrice : item.price;
              const itemSubtotal = price * item.quantity;
              return (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-[20px]">
                    <img src={getImageUrl(item.image)} alt={item.productName} className="w-[50px] h-[50px] object-contain mix-blend-multiply dark:mix-blend-normal" />
                    <span className="text-[16px]">{t(`dynamic.products.${item.productName}`, item.productName)}</span>
                  </div>
                  <span className="text-[16px] font-medium">${itemSubtotal}</span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-[16px] border-b border-gray-300 dark:border-zinc-700 pb-[16px] mb-[16px]">
            <div className="flex items-center justify-between">
              <span className="text-[16px]">{t('cart.subtotal')}:</span>
              <span className="text-[16px]">${subtotal}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[16px]">{t('cart.shipping')}:</span>
              <span className="text-[16px]">{t('cart.free')}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-[30px]">
            <span className="text-[20px] font-medium">{t('cart.total')}:</span>
            <span className="text-[20px] font-medium">${subtotal}</span>
          </div>

          {/* Payment Methods */}
          <div className="flex flex-col gap-[20px] mb-[30px]">
            <label className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-[16px]">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="radio" 
                    name="payment" 
                    value="bank"
                    checked={paymentMethod === 'bank'}
                    onChange={() => setPaymentMethod('bank')}
                    className="peer appearance-none w-[20px] h-[20px] border-[1.5px] border-black dark:border-zinc-700 rounded-full checked:border-black dark:border-zinc-700 cursor-pointer transition-colors" 
                  />
                  <div className="absolute w-[10px] h-[10px] bg-black rounded-full scale-0 peer-checked:scale-100 transition-transform"></div>
                </div>
                <span className="text-[16px]">Bank</span>
              </div>
              <div className="flex items-center gap-[8px]">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Visa.svg/1200px-Visa.svg.png" alt="Visa" className="h-[14px] object-contain" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1200px-Mastercard-logo.svg.png" alt="Mastercard" className="h-[14px] object-contain" />
              </div>
            </label>

            <label className="flex items-center gap-[16px] cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input 
                  type="radio" 
                  name="payment" 
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={() => setPaymentMethod('cash')}
                  className="peer appearance-none w-[20px] h-[20px] border-[1.5px] border-black dark:border-zinc-700 rounded-full checked:border-black dark:border-zinc-700 cursor-pointer transition-colors" 
                />
                <div className="absolute w-[10px] h-[10px] bg-black rounded-full scale-0 peer-checked:scale-100 transition-transform"></div>
              </div>
              <span className="text-[16px]">{t('checkout.cashOnDelivery')}</span>
            </label>
          </div>

          <div className="flex items-center gap-[16px] mb-[30px]">
            <input 
              type="text" 
              placeholder={t('cart.coupon')} 
              className="flex-1 border border-gray-400 rounded-[4px] px-[20px] py-[16px] outline-none focus:border-black dark:border-zinc-700 transition-colors"
            />
            <button type="button" className="bg-[#DB4444] text-white font-medium px-[40px] py-[16px] rounded-[4px] hover:bg-red-600 transition-colors">
              {t('cart.applyCoupon')}
            </button>
          </div>

          <button type="submit" className="bg-[#DB4444] text-white font-medium px-[48px] py-[16px] rounded-[4px] self-start hover:bg-red-600 transition-colors">
            {t('checkout.placeOrder')}
          </button>
          
        </div>

      </form>
    </div>
  );
});

export default CheckOut;
