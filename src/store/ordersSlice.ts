import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface OrderItem {
  id: string | number;
  productName: string;
  price: number;
  discountPrice: number;
  hasDiscount: boolean;
  image: string;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
  paymentMethod: string;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  shippingInfo: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    phone: string;
    email: string;
  };
}

interface OrdersState {
  orders: Order[];
}

const loadOrders = (): Order[] => {
  try {
    const data = localStorage.getItem('ordersState');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveOrders = (orders: Order[]) => {
  try {
    localStorage.setItem('ordersState', JSON.stringify(orders));
  } catch (err) {
    console.error('Could not save orders', err);
  }
};

const initialState: OrdersState = {
  orders: loadOrders(),
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    placeOrder: (state, action: PayloadAction<Omit<Order, 'id' | 'date' | 'status'>>) => {
      const newOrder: Order = {
        ...action.payload,
        id: `ORD-${Date.now()}`,
        date: new Date().toISOString(),
        status: 'pending',
      };
      state.orders.unshift(newOrder); // newest first
      saveOrders(state.orders);
    },
    cancelOrder: (state, action: PayloadAction<string>) => {
      const order = state.orders.find(o => o.id === action.payload);
      if (order) {
        order.status = 'cancelled';
        saveOrders(state.orders);
      }
    },
  },
});

export const { placeOrder, cancelOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
