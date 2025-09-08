import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  recipesToDisplay: {
    recipes: [],
    filters: {
      category: null,
      search: null,
    },
  },
};

export const recipesSlice = createSlice({
  name: "recipes",

  initialState,
  reducers: {
    setRecipesToDisplay: (state, action) => {
      // S'assurer que recipesToDisplay existe
      if (!state.recipesToDisplay) {
        state.recipesToDisplay = {
          recipes: [],
          filters: {
            category: null,
            search: null,
          },
        };
      }
      state.recipesToDisplay.recipes = action.payload.recipes || [];
      state.recipesToDisplay.filters = action.payload.filters || {
        category: null,
        search: null,
      };
    },
  },
});

export const { setRecipesToDisplay } = recipesSlice.actions;

export default recipesSlice.reducer;
