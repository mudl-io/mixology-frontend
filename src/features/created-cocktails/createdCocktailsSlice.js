import { createSlice } from "@reduxjs/toolkit";

const createdCocktailsSlice = createSlice({
  name: "createdCocktails",
  initialState: { createdCocktails: [], nextPage: 1, canLoadMore: false },
  reducers: {
    didGetCreatedCocktails(state, action) {
      state.createdCocktails = [...action.payload.cocktails];
      state.canLoadMore = action.payload.canLoadMore;
      state.nextPage = 2;
    },
    didUpdateCreatedCocktails(state, action) {
      state.createdCocktails = [
        ...state.createdCocktails,
        ...action.payload.cocktails,
      ];
      state.canLoadMore = action.payload.canLoadMore;
      state.nextPage = state.nextPage + 1;
    },
  },
});

export const {
  didGetCreatedCocktails,
  didUpdateCreatedCocktails,
} = createdCocktailsSlice.actions;

export default createdCocktailsSlice.reducer;
