
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; 
import cartReducer from '../redux/reducers/cartSlice';
import wishlistReducer from '../redux/reducers/wishlistslice';
import registrationReducer from '../redux/reducers/registrationSlice';
import loginReducer from '../redux/reducers/loginSlice';
import authReducer from './reducers/authSlice'

const persistConfig = {
  key: "root",
  storage,
};

const persistedCartReducer = persistReducer(persistConfig, cartReducer);
const persistedWishlistReducer = persistReducer(persistConfig, wishlistReducer);
const persistedRegistrationReducer = persistReducer(persistConfig, registrationReducer); 
const persistedAuthReducer = persistReducer(persistConfig , authReducer )
const persistedLoginReducer = persistReducer(persistConfig , loginReducer )

export const Store = configureStore({
  reducer: {
    cart: persistedCartReducer,
    wishlist: persistedWishlistReducer,
    registration: persistedRegistrationReducer,
    auth:  persistedAuthReducer,
    login: persistedLoginReducer,
  },
});

export const persistor = persistStore(Store);