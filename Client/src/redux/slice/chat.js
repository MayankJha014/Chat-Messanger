import { createSlice } from "@reduxjs/toolkit";
import { createGroupChat, getAllChat, updateGroupChat } from "../action/chat";

export const chatSlice = createSlice({
  name: "chat",
  initialState: {
    isLoading: true,
    chatData: null,
    isMessage: null,
    isSuccess: null,
  },

  extraReducers: (builder) => {
    builder.addCase(getAllChat.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllChat.fulfilled, (state, action) => {
      console.log(action.payload.data);
      state.isLoading = false;
      state.chatData = action.payload.data;
      state.isSuccess = action.payload.success;
    });
    builder.addCase(getAllChat.rejected, (state, action) => {
      state.isLoading = false;
      state.isMessage = action.error.message;
      state.isSuccess = false;
    });
    builder.addCase(createGroupChat.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(createGroupChat.fulfilled, (state, action) => {
      state.isLoading = false;
      state.chatData = action.payload.data;
      state.isSuccess = action.payload.success;
    });
    builder.addCase(createGroupChat.rejected, (state, action) => {
      state.isLoading = false;
      state.isMessage = action.error.message;
      state.isSuccess = false;
    });
    builder.addCase(updateGroupChat.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(updateGroupChat.fulfilled, (state, action) => {
      state.isLoading = false;
      state.chatData = action.payload.data;
      state.isSuccess = action.payload.success;
    });
    builder.addCase(updateGroupChat.rejected, (state, action) => {
      state.isLoading = false;
      state.isMessage = action.error.message;
      state.isSuccess = false;
    });
  },
});
