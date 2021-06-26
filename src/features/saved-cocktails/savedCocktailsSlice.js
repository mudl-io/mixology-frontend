import { createSlice } from "@reduxjs/toolkit";

const savedCocktailsSlice = createSlice({
  name: "savedCocktails",
  initialState: { savedCocktails: [], nextPage: 1, canLoadMore: false },
  reducers: {
    didGetSavedCocktails(state, action) {
      state.savedCocktails = [...action.payload.cocktails];
      state.canLoadMore = action.payload.canLoadMore;
      state.nextPage = 2;
    },
    didUpdateSavedCocktails(state, action) {
      state.savedCocktails = [
        ...state.savedCocktails,
        ...action.payload.cocktails,
      ];
      state.canLoadMore = action.payload.canLoadMore;
      state.nextPage = state.nextPage + 1;
    },
    didSaveCocktail(state, action) {
      state.savedCocktails.push(action.payload);
    },
    didUnsaveCocktail(state, action) {
      if (!state.savedCocktails) return;

      state.savedCocktails = state.savedCocktails.filter(
        (cocktail) => cocktail.publicId !== action.payload.publicId
      );
    },
  },
});

export const {
  didGetSavedCocktails,
  didUpdateSavedCocktails,
  didSaveCocktail,
  didUnsaveCocktail,
} = savedCocktailsSlice.actions;

export default savedCocktailsSlice.reducer;
