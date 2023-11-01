import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  email: "", 
  role: "user",
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authenticate: (state, action) => {
      state.isAuthenticated = true;
      state.email = action.payload.email; 
      state.role = action.payload.role;   
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.email = ""; 
      state.role = "user"; 
    },
  },
});

export const { authenticate, logout } = authSlice.actions;

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice.reducer;
