import { createSlice } from "@reduxjs/toolkit";

const loginSlice = createSlice({
    name: "login",
    initialState:{
        user: [],
    },
    reducers:{
        loginUser:(state, action) => {
            state.user.push(action.payload);
        },
    },
})

export const {loginUser} = loginSlice.actions;
export default loginSlice.reducer;