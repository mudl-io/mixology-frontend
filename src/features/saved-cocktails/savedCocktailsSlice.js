import { createSlice } from "@reduxjs/toolkit";

const savedCocktailsSlice = createSlice({
  name: "savedCocktails",
  initialState: [],
  reducers: {
    didGetSavedCocktails(state, action) {
      return {
        savedCocktails: [...action.payload.cocktails],
        canLoadMore: action.payload.canLoadMore,
        nextPage: 2,
      };
    },
    didUpdateSavedCocktails(state, action) {
      return {
        savedCocktails: [...state.savedCocktails, ...action.payload.cocktails],
        canLoadMore: action.payload.canLoadMore,
        nextPage: state.nextPage + 1,
      };
    },
    didSaveCocktail(state, action) {
      const savedCocktails = state.savedCocktails
        ? [...state.savedCocktails, action.payload]
        : [action.payload];

      return {
        savedCocktails: savedCocktails,
        canLoadMore: state.canLoadMore,
        nextPage: state.nextPage,
      };
    },
    didUnsaveCocktail(state, action) {
      if (!state.savedCocktails) return;

      state.savedCocktails = state.savedCocktails.filter(
        (cocktail) => cocktail.publicId !== action.payload
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
