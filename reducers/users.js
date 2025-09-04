import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    userIsConnected: false,
    userId: null,
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
    setUserId: (state, action) => {
      state.value.userId = action.payload;
    },
  },
});

export const { loginUser, logoutUser, userIsConnected, setUserId } = usersSlice.actions;

export default usersSlice.reducer;
