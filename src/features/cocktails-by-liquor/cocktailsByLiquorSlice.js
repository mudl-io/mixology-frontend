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
      let cocktails = [...action.payload.cocktails];

      if (state[liquorId]) {
        cocktails = [...state[liquorId].cocktails, ...cocktails];
      }

      state[liquorId] = { cocktails: cocktails, nextPage: state.page + 1 };
    },
  },
});

export const {
  didGetCocktailsByLiquor,
  didUpdateCocktailsByLiquor,
} = cocktailsByLiquorSlice.actions;

export default cocktailsByLiquorSlice.reducer;
