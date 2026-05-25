import { lazy } from 'react';

const lazyWithRetry = (componentImport: () => Promise<any>) =>
  lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      window.sessionStorage.getItem('page-has-been-force-refreshed') || 'false'
    );

    try {
      const component = await componentImport();
      window.sessionStorage.setItem('page-has-been-force-refreshed', 'false');
      return component;
    } catch (error) {
      if (!pageHasAlreadyBeenForceRefreshed) {
        window.sessionStorage.setItem('page-has-been-force-refreshed', 'true');
        window.location.reload();
        return { default: () => null };
      }
      throw error;
    }
  });

export const Home = lazyWithRetry(() => import("../pages/Home/Homepage"));
export const Contact = lazyWithRetry(() => import("../pages/Contact/Contact"));
export const About = lazyWithRetry(() => import("../pages/About/About"));
export const Login = lazyWithRetry(() => import("../pages/Login/Login"));
export const SignUp = lazyWithRetry(() => import("../pages/SignUp/SignUp"));  
export const AccountPage = lazyWithRetry(() => import("../pages/AccountPage/AccountPage"));
export const CategoryPage = lazyWithRetry(() => import("../pages/Home/CategorySidebar/CategorySidebar"));
export const NotFound = lazyWithRetry(() => import("../pages/NotFound/NotFound"));
export const ProductDetail = lazyWithRetry(() => import("../pages/ProductDetail/ProductDetail"));
export const ProductsPage = lazyWithRetry(() => import("../pages/Products/ProductsPage"));
export const Wishlist = lazyWithRetry(() => import("../pages/Wishlist/Wishlist"));
export const Cart = lazyWithRetry(() => import("../pages/Cart/Cart"));
export const CheckOut = lazyWithRetry(() => import("../pages/CheckOut/CheckOut"));