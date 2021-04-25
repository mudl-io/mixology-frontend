import { createSlice } from "@reduxjs/toolkit";

const cocktailsByLiquorSlice = createSlice({
  name: "cocktailsByLiquor",
  initialState: {},
  reducers: {
    didGetCocktailsByLiquor(state, action) {
      const liquorId = action.payload.liquorId;

      state[liquorId] = { cocktails: action.payload.cocktails, nextPage: 2 };
    },
    didUpdateCocktailsByLiquor(state, action) {
      const liquorId = action.payload.liquorId;
      const cocktails = state[liquorId]
        ? [...state[liquorId].cocktails, ...action.payload.cocktails]
        : [...action.payload.cocktails];

      state[liquorId] = { cocktails: cocktails, nextPage: state.page + 1 };
    },
  },
});

export const {
  didGetCocktailsByLiquor,
  didUpdateCocktailsByLiquor,
} = cocktailsByLiquorSlice.actions;

export default cocktailsByLiquorSlice.reducer;
