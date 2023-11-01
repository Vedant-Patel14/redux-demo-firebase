
import { createSlice } from "@reduxjs/toolkit";

const registrationSlice = createSlice({
  name: "registration",
  initialState: {
    users: [],
  },
  reducers: {
    registerUser: (state, action) => {
      state.users.push(action.payload);
    },
  },
});

export const { registerUser } = registrationSlice.actions;
export default registrationSlice.reducer;