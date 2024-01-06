import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./slice/auth";
import { searchSlice } from "./slice/search";
import { chatSlice } from "./slice/chat";
import { messageSlice } from "./slice/message";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    search: searchSlice.reducer,
    chat: chatSlice.reducer,
    message: messageSlice.reducer,
  },
});

export default store;
