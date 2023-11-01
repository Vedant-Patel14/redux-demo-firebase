// loginSlice.js
import { createSlice } from "@reduxjs/toolkit";

const loginSlice = createSlice({
  name: "login",
  initialState: {
    email: null,
    role: null,
  },
  reducers: {
    loginUser: (state, action) => {
      const userEmail = action.payload.email;
      state.email = userEmail;
    },
  },
});

export const { loginUser } = loginSlice.actions;
export default loginSlice.reducer;
