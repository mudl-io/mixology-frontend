import { createSlice } from "@reduxjs/toolkit";

const defaultLiquorsSlice = createSlice({
  name: "defaultLiquors",
  initialState: [],
  reducers: {
    didGetDefaultLiquors(state, action) {
      return [...action.payload];
    },
  },
});

export const { didGetDefaultLiquors } = defaultLiquorsSlice.actions;

export default defaultLiquorsSlice.reducer;
