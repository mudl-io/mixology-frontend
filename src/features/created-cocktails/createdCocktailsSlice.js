import { createSlice } from "@reduxjs/toolkit";

const createdCocktailsSlice = createSlice({
  name: "createdCocktails",
  initialState: { createdCocktails: [], canLoadMore: false, nextPage: 1 },
  reducers: {
    didGetCreatedCocktails(state, action) {
      const user = action.payload.user;
      state[user] = state[user] ? state[user] : {};

      state[user].createdCocktails = [...action.payload.cocktails];
      state[user].canLoadMore = action.payload.canLoadMore;
      state[user].nextPage = 2;
    },
    didUpdateCreatedCocktails(state, action) {
      const user = action.payload.user;

      state[user].createdCocktails = [
        ...state[user].createdCocktails,
        ...action.payload.cocktails,
      ];
      state[user].canLoadMore = action.payload.canLoadMore;
      state[user].nextPage = state[user].nextPage + 1;
    },
  },
});

export const { didGetCreatedCocktails, didUpdateCreatedCocktails } =
  createdCocktailsSlice.actions;

export default createdCocktailsSlice.reducer;
