import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchChat = createAsyncThunk("fetchChat", async (formData) => {
  try {
    const token = localStorage.getItem("token");

    const inputData = {
      userId: formData,
    };
    const res = await fetch("https://chat-messanger-beta.vercel.app/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(inputData),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error);
    }

    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    throw new Error(error);
  }
});
export const fetchChatById = createAsyncThunk(
  "fetchChatById",
  async (formData) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `https://chat-messanger-beta.vercel.app/api/chat/${formData}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error);
      }

      const data = await res.json();
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }
);

export const sendMessage = createAsyncThunk(
  "message/send",
  async (formData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "https://chat-messanger-beta.vercel.app/api/message",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(formData),
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error);
      }

      const data = await res.json();
      console.log(data);
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }
);

export const getAllMessage = createAsyncThunk(
  "message/get",
  async (formData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://chat-messanger-beta.vercel.app/api/message/${formData}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error);
      }

      const data = await res.json();
      console.log(data);
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }
);
