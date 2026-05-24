import { useFormik } from "formik";
import { memo, useState } from "react";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const AccountPage = memo(() => {
  const { t } = useTranslation();
  const { user } = useSelector((state: any) => state.auth);
  const orders = useSelector((state: any) => state.orders.orders || []);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');

  const formik = useFormik({
    initialValues: {
      firstName: user?.name || "Md", 
      lastName: "Rimel",
      email: user?.email || "rimel111@gmail.com",
      address: "Kingston, 5236, United State",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required(t('auth.firstNameRequired', "First name is required")),
      lastName: Yup.string().required(t('auth.lastNameRequired', "Last name is required")),
      email: Yup.string().email(t('auth.invalidEmail', "Invalid email")).required(t('auth.emailRequired', "Email is required")),
      address: Yup.string().required(t('auth.addressRequired', "Address is required")),
      currentPassword: Yup.string(),
      newPassword: Yup.string().min(6, t('auth.passwordMin', "Password must be at least 6 characters")),
      confirmPassword: Yup.string().oneOf(
        [Yup.ref("newPassword")],
        t('auth.passwordsMatch', "Passwords must match")
      ),
    }),
    onSubmit: async (values) => {
      try {
        console.log("Profile updated:", values);
        toast.success(t('account.profileUpdated', 'Profile updated successfully!'), { style: { background: '#4CAF50', color: '#fff' } });
      } catch (error) {
        console.error(error);
      }
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'processing': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'delivered': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: t('orders.pending', 'Pending'),
      processing: t('orders.processing', 'Processing'),
      delivered: t('orders.delivered', 'Delivered'),
      cancelled: t('orders.cancelled', 'Cancelled'),
    };
    return labels[status] || status;
  };

  const getImageUrl = (image: string) => {
    if (image && image.startsWith('http')) return image;
    return `https://fastcard-1-o23z.onrender.com/uploads/images/${image}${image && image.includes('.') ? '' : '.jpg'}`;
  };

  const formatDate = (isoDate: string) => {
    return new Date(isoDate).toLocaleDateString(undefined, { 
      year: 'numeric', month: 'short', day: 'numeric' 
    });
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-[16px] md:px-[32px] py-[40px] font-sans text-zinc-900 dark:text-white">
      
      <div className="text-[14px] text-zinc-500 dark:text-zinc-400 mb-[40px]">
        <NavLink to="/">{t('header.home')}   </NavLink>
/ <span className="text-zinc-900 dark:text-white font-medium">{t('account.myAccount', 'My Account')}</span>
      </div>

      <div className="w-full flex flex-col md:flex-row gap-[40px] md:gap-[80px]">
        
        <div className="w-full md:w-[250px] flex flex-col gap-[24px]">
          <div>
            <h3 className="text-[16px] font-semibold mb-[12px]">{t('account.manageAccount', 'Manage My Account')}</h3>
            <ul className="flex flex-col gap-[8px] pl-[20px] text-[15px]">
              <li
                onClick={() => setActiveTab('profile')}
                className={`cursor-pointer transition-colors ${activeTab === 'profile' ? 'text-[#DB4444] font-medium' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}`}
              >
                {t('account.myProfile', 'My Profile')}
              </li>
              <li className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer transition-colors">{t('account.addressBook', 'Address Book')}</li>
              <li className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer transition-colors">{t('account.paymentOptions', 'My Payment Options')}</li>
            </ul>
          </div>

          <div>
            <h3 className="text-[16px] font-semibold mb-[12px]">{t('account.myOrders', 'My Orders')}</h3>
            <ul className="flex flex-col gap-[8px] pl-[20px] text-[15px]">
              <li
                onClick={() => setActiveTab('orders')}
                className={`cursor-pointer transition-colors flex items-center gap-[8px] ${activeTab === 'orders' ? 'text-[#DB4444] font-medium' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}`}
              >
                {t('account.myOrders', 'My Orders')}
                {orders.length > 0 && (
                  <span className="bg-[#DB4444] text-white text-[11px] font-bold px-[7px] py-[1px] rounded-full">
                    {orders.length}
                  </span>
                )}
              </li>
              <li className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer transition-colors">{t('account.returns', 'My Returns')}</li>
              <li className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer transition-colors">{t('account.cancellations', 'My Cancellations')}</li>
            </ul>
          </div>

          <div>
            <h3 className="text-[16px] font-semibold cursor-pointer hover:text-[#DB4444] transition-colors">
              {t('account.myWishlist', 'My WishList')}
            </h3>
          </div>
        </div>

        <div className="flex-1">

          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-zinc-900 p-[24px] md:p-[40px] rounded-sm shadow-[0_1px_10px_rgba(0,0,0,0.05)] border border-zinc-100 dark:border-zinc-800">
              <h2 className="text-[20px] font-medium text-[#DB4444] mb-[24px]">{t('account.editProfile', 'Edit Your Profile')}</h2>
              
              <form onSubmit={formik.handleSubmit} className="flex flex-col gap-[24px]">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[32px]">
                  <div className="flex flex-col gap-[8px]">
                    <label className="text-[14px] text-zinc-600">{t('account.firstName', 'First Name')}</label>
                    <input
                      type="text"
                      name="firstName"
                      onChange={formik.handleChange}
                      value={formik.values.firstName}
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-transparent rounded px-[16px] py-[12px] outline-none focus:border-zinc-400 dark:border-zinc-700 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-[8px]">
                    <label className="text-[14px] text-zinc-600">{t('account.lastName', 'Last Name')}</label>
                    <input
                      type="text"
                      name="lastName"
                      onChange={formik.handleChange}
                      value={formik.values.lastName}
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-transparent rounded px-[16px] py-[12px] outline-none focus:border-zinc-400 dark:border-zinc-700 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-[32px]">
                  <div className="flex flex-col gap-[8px]">
                    <label className="text-[14px] text-zinc-600">{t('account.email', 'Email')}</label>
                    <input
                      type="email"
                      name="email"
                      onChange={formik.handleChange}
                      value={formik.values.email}
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-transparent rounded px-[16px] py-[12px] outline-none focus:border-zinc-400 dark:border-zinc-700 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-[8px]">
                    <label className="text-[14px] text-zinc-600">{t('account.address', 'Street Address')}</label>
                    <input
                      type="text"
                      name="address"
                      onChange={formik.handleChange}
                      value={formik.values.address}
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-transparent rounded px-[16px] py-[12px] outline-none focus:border-zinc-400 dark:border-zinc-700 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-[16px] mt-[16px]">
                  <h3 className="text-[16px] font-medium">{t('account.passwordChanges', 'Password Changes')}</h3>
                  
                  <div className="flex flex-col gap-[8px]">
                    <input
                      type="password"
                      name="currentPassword"
                      placeholder={t('account.currentPassword', "Current Password")}
                      onChange={formik.handleChange}
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-transparent rounded px-[16px] py-[12px] outline-none focus:border-zinc-400 dark:border-zinc-700 transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-[8px]">
                    <input
                      type="password"
                      name="newPassword"
                      placeholder={t('account.newPassword', "New Password")}
                      onChange={formik.handleChange}
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-transparent rounded px-[16px] py-[12px] outline-none focus:border-zinc-400 dark:border-zinc-700 transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-[8px]">
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder={t('account.confirmNewPassword', "Confirm New Password")}
                      onChange={formik.handleChange}
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-transparent rounded px-[16px] py-[12px] outline-none focus:border-zinc-400 dark:border-zinc-700 transition-colors"
                    />
                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                      <span className="text-red-500 text-[12px]">{formik.errors.confirmPassword}</span>
                    )}
                  </div>
                </div>

                <div className="flex justify-end items-center gap-[24px] mt-[16px]">
                  <button
                    type="button"
                    onClick={() => formik.resetForm()}
                    className="text-[16px] font-normal text-zinc-900 dark:text-white hover:underline transition-all"
                  >
                    {t('account.cancel', 'Cancel')}
                  </button>
                  <button
                    type="submit"
                    className="bg-[#DB4444] text-white px-[48px] py-[16px] rounded font-medium hover:bg-[#C23B3B] active:scale-[0.99] transition-all"
                  >
                    {t('account.saveChanges', 'Save Changes')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="flex flex-col gap-[24px]">
              <h2 className="text-[20px] font-semibold text-[#DB4444]">{t('account.myOrders', 'My Orders')}</h2>

              {orders.length === 0 ? (
                <div className="bg-white dark:bg-zinc-900 p-[40px] rounded-sm shadow-[0_1px_10px_rgba(0,0,0,0.05)] border border-zinc-100 dark:border-zinc-800 flex flex-col items-center justify-center gap-[16px] py-[80px]">
                  <span className="text-[60px]">📦</span>
                  <p className="text-[18px] text-zinc-500 dark:text-zinc-400">{t('orders.noOrders', 'You have no orders yet')}</p>
                  <NavLink
                    to="/products"
                    className="bg-[#DB4444] text-white px-[32px] py-[12px] rounded-[4px] hover:bg-red-600 transition-colors font-medium"
                  >
                    {t('orders.startShopping', 'Start Shopping')}
                  </NavLink>
                </div>
              ) : (
                orders.map((order: any) => (
                  <div key={order.id} className="bg-white dark:bg-zinc-900 rounded-sm shadow-[0_1px_10px_rgba(0,0,0,0.05)] border border-zinc-100 dark:border-zinc-800 overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[12px] px-[24px] py-[16px] border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-[12px] sm:gap-[24px]">
                        <div>
                          <p className="text-[12px] text-zinc-400 dark:text-zinc-500">{t('orders.orderId', 'Order ID')}</p>
                          <p className="text-[14px] font-semibold text-zinc-800 dark:text-zinc-200">{order.id}</p>
                        </div>
                        <div>
                          <p className="text-[12px] text-zinc-400 dark:text-zinc-500">{t('orders.date', 'Date')}</p>
                          <p className="text-[14px] font-medium">{formatDate(order.date)}</p>
                        </div>
                        <div>
                          <p className="text-[12px] text-zinc-400 dark:text-zinc-500">{t('orders.total', 'Total')}</p>
                          <p className="text-[14px] font-bold text-[#DB4444]">${order.total}</p>
                        </div>
                        <div>
                          <p className="text-[12px] text-zinc-400 dark:text-zinc-500">{t('orders.payment', 'Payment')}</p>
                          <p className="text-[14px] font-medium capitalize">{order.paymentMethod === 'cash' ? t('checkout.cashOnDelivery', 'Cash on Delivery') : 'Bank'}</p>
                        </div>
                      </div>
                      <span className={`text-[12px] font-semibold px-[12px] py-[6px] rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>

                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {order.items.map((item: any) => {
                        const price = item.hasDiscount ? item.discountPrice : item.price;
                        return (
                          <div key={item.id} className="flex items-center gap-[16px] px-[24px] py-[16px]">
                            <img
                              src={getImageUrl(item.image)}
                              alt={item.productName}
                              className="w-[56px] h-[56px] object-contain rounded-[4px] bg-zinc-50 dark:bg-zinc-800 p-[4px] flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-[15px] font-medium truncate">{item.productName}</p>
                              <p className="text-[13px] text-zinc-500 dark:text-zinc-400">
                                {t('cart.quantity')}: {item.quantity} × ${price}
                              </p>
                            </div>
                            <p className="text-[15px] font-semibold text-[#DB4444] flex-shrink-0">
                              ${price * item.quantity}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {order.shippingInfo?.firstName && (
                      <div className="px-[24px] py-[14px] border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
                        <p className="text-[12px] text-zinc-400 dark:text-zinc-500 mb-[4px]">{t('orders.shippingTo', 'Shipping to')}</p>
                        <p className="text-[14px] text-zinc-700 dark:text-zinc-300">
                          {order.shippingInfo.firstName} {order.shippingInfo.lastName}
                          {order.shippingInfo.address ? `, ${order.shippingInfo.address}` : ''}
                          {order.shippingInfo.city ? `, ${order.shippingInfo.city}` : ''}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
});

export default AccountPage;