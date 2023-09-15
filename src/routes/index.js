import React from "react";
import {  Route, Routes } from "react-router-dom";
import CartPage from "../container/shoppingcart";
import Home from "../component/home";
import WishlistPage from "../container/wishlistpage";
import Login from "../container/login";
import Registration from "../container/registration";
import ProductDetails from "../container/productDetails";
import PrivateRoute from "../utils/privateRoute";
import AuthRoute from "../utils/authRoute";
import Profile from "../container/profile";

const Routing = () => {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
       
        <Route path="/cartpage/*" element={<PrivateRoute />}>
          <Route index element={<CartPage />} />
        </Route>
       
        <Route path="/wishlist/*" element={<PrivateRoute />}>
          <Route index element={<WishlistPage />} />
        </Route>

        <Route path="/login/*" element={<AuthRoute />}>
          <Route index element={<Login />} />
        </Route>
        <Route path="/registration/*" element={<AuthRoute />}>
          <Route index element={<Registration />} />
        </Route>

        <Route path="/profile/*" element={<PrivateRoute />}>
          <Route index element={<Profile />} />
        </Route>

        <Route path="/product/:productId" element={<ProductDetails />} />
      </Routes>
  );
};

export default Routing;
