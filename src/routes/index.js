import React from "react";
import { useRoutes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "../component/home";
import Login from "../container/login";
import Registration from "../container/registration";
import Checkout from "../container/checkout";
import ProductDetails from "../container/productDetails";
import Profile from "../container/profile";
import CartPage from "../container/shoppingcart";
import WishlistPage from "../container/wishlistpage";
import PrivateRoute from "../utils/privateRoute";
import AuthRoute from "../utils/authRoute";
import Orders from "../container/orders";

const Routing = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth);
  const isAdmin = user && (user.admin === "admin1@gmail.com" || user.role === "admin");

  const routes = [
    {
      path: "/",
      element: <Home />,
    },
    {
      id: "login",
      path: "/login",
      element: isAuthenticated ? <Navigate to="/" /> : <Login />,
    },
    {
      id: "registration",
      path: "/registration",
      element: isAuthenticated ? <Navigate to="/" /> : <Registration />,
    },
    {
      id: "checkout",
      path: "/checkout",
      element: isAuthenticated ? <Checkout /> : <Navigate to="/login" />,
    },
    {
      id: "profile",
      path: "/profile",
      element: isAuthenticated ? <Profile /> : <Navigate to="/login" />,
    },
    {
      id: "shoppingcart",
      path: "/cartpage",
      element: isAuthenticated ? <CartPage /> : <Navigate to="/login" />,
    },
    {
      id: "wishlistpage",
      path: "/wishlist",
      element: isAuthenticated ? <WishlistPage /> : <Navigate to="/login" />,
    },
    {
      id: "productdetails",
      path: "/product/:productId",
      element: <ProductDetails />,
    },
    {
      id:"orders",
      path:"/orders",
      element: isAdmin ? <Orders /> : <Navigate to="/" />,
    }
  ];

  return useRoutes(routes);
};

export default Routing;
