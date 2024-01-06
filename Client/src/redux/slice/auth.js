import { createSlice } from "@reduxjs/toolkit";
import { getUser, login, signup } from "../action/auth";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoading: true,
    authData: null,
    isMessage: null,
    isSuccess: null,
  },
  extraReducers: (builder) => {
    builder.addCase(signup.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(signup.fulfilled, (state, action) => {
      state.isLoading = false;
      state.authData = action.payload.data;
      state.isMessage = action.payload.message;
      state.isSuccess = action.payload.success;
    });
    builder.addCase(signup.rejected, (state, action) => {
      state.isLoading = false;
      state.isMessage = action.error.message;
      state.isSuccess = false;
    });
    builder.addCase(login.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoading = false;
      state.authData = action.payload.data;
      state.isSuccess = action.payload.success;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.isMessage = action.error.message;
      state.isSuccess = false;
    });
    builder.addCase(getUser.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.authData = action.payload.data;
      state.isSuccess = action.payload.success;
    });
    builder.addCase(getUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isMessage = action.error.message;
      state.isSuccess = false;
    });
  },
});
