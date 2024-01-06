import { createSlice } from "@reduxjs/toolkit";
import {
  fetchChat,
  fetchChatById,
  getAllMessage,
  sendMessage,
} from "../action/message";

export const messageSlice = createSlice({
  name: "message",
  initialState: {
    isLoading: true,
    messageData: null,
    activeChatData: null,
    isMessage: null,
    isSuccess: null,
  },
  reducers: {
    clearMessage: (state) => {
      state.messageData = null;
    },
    addMessageData: (state, action) => {
      console.log(action.payload);
      state.messageData.push(action.payload);
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchChat.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchChat.fulfilled, (state, action) => {
      state.isLoading = false;
      state.activeChatData = action.payload.data;
      state.isSuccess = action.payload.success;
    });
    builder.addCase(fetchChat.rejected, (state, action) => {
      state.isLoading = false;
      state.isMessage = action.error.message;
      state.isSuccess = false;
    });
    builder.addCase(fetchChatById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchChatById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.activeChatData = action.payload.data;
      state.isSuccess = action.payload.success;
    });
    builder.addCase(fetchChatById.rejected, (state, action) => {
      state.isLoading = false;
      state.isMessage = action.error.message;
      state.isSuccess = false;
    });
    builder.addCase(sendMessage.pending, (state, action) => {});
    builder.addCase(sendMessage.fulfilled, (state, action) => {
      state.isSuccess = action.payload.success;
    });
    builder.addCase(sendMessage.rejected, (state, action) => {
      state.isSuccess = false;
    });
    builder.addCase(getAllMessage.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getAllMessage.fulfilled, (state, action) => {
      state.isLoading = false;
      state.messageData = action.payload.data;
      state.isSuccess = action.payload.success;
    });
    builder.addCase(getAllMessage.rejected, (state, action) => {
      state.isLoading = false;
      state.isMessage = action.error.message;
      state.isSuccess = false;
    });
  },
});

export const { clearMessage, addMessageData } = messageSlice.actions;
