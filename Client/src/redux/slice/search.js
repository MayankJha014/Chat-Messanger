import { createSlice } from "@reduxjs/toolkit";
import { searchUser } from "../action/search";

export const searchSlice = createSlice({
  name: "search",
  initialState: {
    isLoading: true,
    searchData: null,
    isMessage: null,
  },
  reducers: {
    clearSearch: (state) => {
      state.searchData = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(searchUser.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(searchUser.fulfilled, (state, action) => {
      console.log(action.payload.data);
      state.isLoading = false;
      state.searchData = action.payload.data;
    });
    builder.addCase(searchUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isMessage = action.error.message;
    });
  },
});
export const { clearSearch } = searchSlice.actions;
