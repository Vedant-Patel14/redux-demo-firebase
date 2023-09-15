import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  wishlist: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlist: (state, action) => {
      const product = action.payload;
      const index = state.wishlist.findIndex((item) => item.id === product.id);

      if (index !== -1) {
        state.wishlist = state.wishlist.filter(
          (item) => item.id !== product.id
        );
      } else {
        state.wishlist = [...state.wishlist, product];
      }
    },
  },
});

export const { toggleWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
