import {lazy} from 'react';


export const Home = lazy(() => import("../pages/Home/Homepage"));
export const Contact = lazy(() => import("../pages/Contact/Contact"));
export const About = lazy(() => import("../pages/About/About"));
export const Login = lazy(() => import("../pages/Login/Login"));
export const SignUp = lazy(() => import("../pages/SignUp/SignUp"));  
export const AccountPage = lazy(() => import("../pages/AccountPage/AccountPage"));
export const CategoryPage = lazy(() => import("../pages/Home/CategorySidebar/CategorySidebar"));
export const NotFound = lazy(() => import("../pages/NotFound/NotFound"));
export const ProductDetail = lazy(() => import("../pages/ProductDetail/ProductDetail"));
export const ProductsPage = lazy(() => import("../pages/Products/ProductsPage"));
export const Wishlist = lazy(() => import("../pages/Wishlist/Wishlist"));
export const Cart = lazy(() => import("../pages/Cart/Cart"));
export const CheckOut = lazy(() => import("../pages/CheckOut/CheckOut"));