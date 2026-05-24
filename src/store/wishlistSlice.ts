import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

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

const loadState = (): WishlistState => {
  try {
    const serializedState = localStorage.getItem('wishlistState');
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
      localStorage.setItem('wishlistState', JSON.stringify(state));
    },
    clearWishlist: (state) => {
      state.items = [];
      localStorage.removeItem('wishlistState');
    }
  },
});

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;
