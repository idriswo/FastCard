import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { loginSuccess, logout } from './authSlice';
import { jwtDecode } from 'jwt-decode';
import { getToken } from '../utils/token';

export interface WishlistProduct {
  id: number | string;
  productName: string;
  price: number;
  discountPrice: number;
  hasDiscount: boolean;
  quantity?: number;
  image: string;
  rating?: number;
  categoryId?: number;
  brandId?: number;
  description?: string;
}

interface WishlistState {
  items: WishlistProduct[];
}

const getUserId = (customToken?: string) => {
  const token = customToken || getToken();
  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      return decoded.sid || decoded.id || decoded.userName || 'anonymous';
    } catch(e) {}
  }
  return 'anonymous';
};

const loadState = (customToken?: string): WishlistState => {
  try {
    const userId = getUserId(customToken);
    const serializedState = localStorage.getItem(`wishlistState_${userId}`);
    if (serializedState === null) {
      return { items: [] };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return { items: [] };
  }
};

const initialState: WishlistState = loadState();

export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action: PayloadAction<WishlistProduct>) => {
      const existingIndex = state.items.findIndex(item => item.id === action.payload.id);
      if (existingIndex >= 0) {
        state.items.splice(existingIndex, 1);
      } else {
        state.items.push(action.payload);
      }
      const userId = getUserId();
      localStorage.setItem(`wishlistState_${userId}`, JSON.stringify(state));
    },
    clearWishlist: (state) => {
      state.items = [];
      const userId = getUserId();
      localStorage.removeItem(`wishlistState_${userId}`);
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loginSuccess, (state, action) => {
      state.items = loadState(action.payload).items;
    });
    builder.addCase(logout, (state) => {
      state.items = [];
    });
  }
});

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;
