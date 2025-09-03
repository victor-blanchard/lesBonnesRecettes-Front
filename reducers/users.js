import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    userIsConnected: false,
  },
};

export const usersSlice = createSlice({
  name: "users",

  initialState,
  reducers: {
    loginUser: (state) => {
      state.value.userIsConnected = true;
    },
    logoutUser: (state) => {
      state.value.userIsConnected = false;
    },
    userIsConnected: (state, action) => {
      state.value.userIsConnected = action.payload;
    },
  },
});

export const { loginUser, logoutUser, userIsConnected } = usersSlice.actions;

export default usersSlice.reducer;
