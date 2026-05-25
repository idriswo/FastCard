import { configureStore, type Middleware } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import wishlistReducer from './wishlistSlice';
import cartReducer from './cartSlice';
import themeReducer from './themeSlice';
import ordersReducer from './ordersSlice';
import toast from 'react-hot-toast';
import i18n from '../i18n';

const authMiddleware: Middleware = storeAPI => next => action => {
  const act = action as { type: string };
  if (act.type === 'cart/addToCart' || act.type === 'wishlist/toggleWishlist') {
    const state = storeAPI.getState() as any;
    if (!state.auth.isAuthenticated) {
      toast.error(i18n.t('auth.pleaseLogin', 'Аввал ба система ворид шавед!'), { style: { background: '#333', color: '#fff' } });
      return;
    }
  }
  return next(action);
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    wishlist: wishlistReducer,
    cart: cartReducer,
    theme: themeReducer,
    orders: ordersReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authMiddleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
