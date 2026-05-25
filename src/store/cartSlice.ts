import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { loginSuccess, logout } from './authSlice';
import { jwtDecode } from 'jwt-decode';
import { getToken } from '../utils/token';

export interface CartItem {
  id: string | number;
  productName: string;
  price: number;
  discountPrice: number;
  hasDiscount: boolean;
  image: string;
  quantity: number; // The user's requested quantity in cart
  stockQuantity?: number; // The actual stock available for the product
  rating?: number;
  description?: string;
}

interface CartState {
  items: CartItem[];
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

const loadState = (customToken?: string): CartItem[] => {
  try {
    const userId = getUserId(customToken);
    const serializedState = localStorage.getItem(`cartState_${userId}`);
    if (serializedState === null) {
      return [];
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return [];
  }
};

const saveState = (state: CartItem[]) => {
  try {
    const userId = getUserId();
    const serializedState = JSON.stringify(state);
    localStorage.setItem(`cartState_${userId}`, serializedState);
  } catch (err) {
    console.error("Could not save state", err);
  }
};

const initialState: CartState = {
  items: loadState(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<any>) => {
      const product = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);
      const addQty = product.addQty && product.addQty > 0 ? product.addQty : 1;
      
      if (existingItem) {
        existingItem.quantity += addQty;
      } else {
        state.items.push({
          id: product.id,
          productName: product.productName,
          price: product.price,
          discountPrice: product.discountPrice,
          hasDiscount: product.hasDiscount,
          image: product.image,
          quantity: addQty,
          stockQuantity: product.stockQuantity || product.quantity || 100
        });
      }
      saveState(state.items);
    },
    removeFromCart: (state, action: PayloadAction<string | number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveState(state.items);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string | number; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item && action.payload.quantity > 0) {
        item.quantity = action.payload.quantity;
      }
      saveState(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveState(state.items);
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loginSuccess, (state, action) => {
      state.items = loadState(action.payload);
    });
    builder.addCase(logout, (state) => {
      state.items = [];
    });
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
