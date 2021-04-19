import { createSlice } from "@reduxjs/toolkit";

const cocktailsByLiquorSlice = createSlice({
  name: "cocktailsByLiquor",
  initialState: {},
  reducers: {
    didGetCocktailsByLiquor(state, action) {
      const liquorId = action.payload.liquorId;

      state[liquorId] = action.payload.cocktails;
    },
    didUpdateCocktailsByLiquor(state, action) {
      const liquorId = action.payload.liquorId;
      let cocktails = [...action.payload.cocktails];

      if (state[liquorId]) cocktails = [...state[liquorId], ...cocktails];

      state[liquorId] = cocktails;
    },
  },
});

export const { didGetCocktailsByLiquor } = cocktailsByLiquorSlice.actions;

export default cocktailsByLiquorSlice.reducer;
