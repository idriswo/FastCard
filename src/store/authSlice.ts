import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import { getToken, removeToken } from '../utils/token'; 

interface User {
  sid?: string;
  name?: string;
  email?: string;
  role?: string;
  exp?: number;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const loadUserFromToken = (): AuthState => {
  const token = getToken();
  if (token) {
    try {
      const decoded = jwtDecode<User>(token);
      if (decoded.exp && decoded.exp * 1000 > Date.now()) {
        return {
          user: decoded,
          isAuthenticated: true,
        };
      } else {
        removeToken(); 
      }
    } catch (e) {
      console.error("Invalid token");
    }
  }
  return initialState;
};

const authSlice = createSlice({
  name: 'auth',
  initialState: loadUserFromToken(),
  reducers: {
    loginSuccess: (state, action: PayloadAction<string>) => {
      try {
        const decoded = jwtDecode<User>(action.payload);
        state.user = decoded;
        state.isAuthenticated = true;
      } catch (e) {
        console.error("Invalid token on login", e);
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      removeToken(); 
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;