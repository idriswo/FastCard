import { memo, useEffect } from "react";
import { useSelector } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';
import Layout from "./Layout/Layout";
import { Home,Contact,About,Login,SignUp, AccountPage, NotFound, ProductDetail, ProductsPage, Wishlist, Cart, CheckOut } from "./Router/Router";
import { Toaster } from "react-hot-toast";
import type { RootState } from './store/store';

const App = memo(() => {
  const isDarkMode = useSelector((state: RootState) => state.theme?.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children:[
        {
          index: true,
          element: <Home />
        },
        {
          path: "contact",
          element: <Contact />
        },
        {
          path: "about",
          element: <About />
        },
        {
          path: "login",
          element: <Login />
        },
        {
          path: "signup",
          element: <SignUp />
        },
        {
          path: "account",
          element: <AccountPage />
        },
        {
          path: "product/:id",
          element: <ProductDetail />
        },
        {
          path: "products",
          element: <ProductsPage />
        },
        {
          path: "wishlist",
          element: <Wishlist />
        },
        {
          path: "cart",
          element: <Cart />
        },
        {
          path: "checkout",
          element: <CheckOut />
        },
        {
          path: "*",
          element: <NotFound />
        }
      ]
    }
  ]);
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={router} />
    </>
  );  
});

export default App;
