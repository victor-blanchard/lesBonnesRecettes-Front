import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk pour récupérer les recettes
export const fetchRecipes = createAsyncThunk("recipes/fetchRecipes", async (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const response = await fetch(`http://localhost:3000/recipes?${queryParams}`);

  if (!response.ok) {
    throw new Error("Erreur lors du chargement des recettes");
  }

  return response.json();
});

// Async thunk pour rechercher des recettes
export const searchRecipes = createAsyncThunk("recipes/searchRecipes", async (searchTerm) => {
  const response = await fetch(
    `http://localhost:3000/recipes/search?q=${encodeURIComponent(searchTerm)}`
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la recherche");
  }

  return response.json();
});

const recipesSlice = createSlice({
  name: "recipes",
  initialState: {
    items: [],
    filteredItems: [],
    loading: false,
    error: null,
    searchTerm: "",
    filters: {
      category: null,
      duration: null,
    },
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
    },
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setCategoryFilter: (state, action) => {
      state.filters.category = action.payload;
    },
    clearFilters: (state) => {
      state.filters = { category: null, duration: null };
      state.searchTerm = "";
    },
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch recipes
      .addCase(fetchRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.recipes || action.payload;
        state.filteredItems = action.payload.recipes || action.payload;
        state.pagination.totalItems = action.payload.total || action.payload.length;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Search recipes
      .addCase(searchRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredItems = action.payload.recipes || action.payload;
        state.pagination.totalItems = action.payload.total || action.payload.length;
      })
      .addCase(searchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSearchTerm, setCategoryFilter, clearFilters, setPage, clearError } =
  recipesSlice.actions;

export default recipesSlice.reducer;
