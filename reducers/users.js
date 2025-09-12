import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    userIsConnected: false,
    userId: null,
    likedRecipes: [],
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
    setLikedRecipes: (state, action) => {
      state.value.likedRecipes = action.payload;
    },
  },
});

export const { loginUser, logoutUser, userIsConnected, setUserId, setLikedRecipes } =
  usersSlice.actions;

export default usersSlice.reducer;
