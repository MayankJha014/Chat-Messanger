import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllChat = createAsyncThunk("getChat", async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(
      "https://nodejs-production-d4ec.up.railway.app/api/chat",
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
});

export const createGroupChat = createAsyncThunk(
  "chat/createGroupChat",
  async (formData) => {
    try {
      const token = localStorage.getItem("token");

      const inputData = {
        name: formData.name,
        users: formData.members,
      };
      const res = await fetch(
        "https://nodejs-production-d4ec.up.railway.app/api/group",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(inputData),
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
export const updateGroupChat = createAsyncThunk(
  "chat/updateGroupChat",
  async (formData) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://nodejs-production-d4ec.up.railway.app/api/update",
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
