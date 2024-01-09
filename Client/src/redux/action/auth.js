import { createAsyncThunk } from "@reduxjs/toolkit";

export const signup = createAsyncThunk("signUp", async (formData) => {
  try {
    const res = await fetch("http://localhost:4000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (data?.success == false) {
      throw new Error(data.message);
    }

    console.log(data);
    localStorage.setItem("token", data.data.token);
    return data;
  } catch (error) {
    throw new Error(error);
  }
});

export const login = createAsyncThunk("login", async (formData) => {
  try {
    const res = await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (data?.success == false) {
      const errorData = await res.json();
      throw new Error(errorData.message);
    }
    console.log(data.data.token);
    localStorage.setItem("token", data.data.token);
    return data;
  } catch (error) {
    throw new Error(error);
  }
});

export const getUser = createAsyncThunk("getUser", async () => {
  try {
    const token = localStorage.getItem("token");

    console.log(token);
    const res = await fetch("http://localhost:4000/getuser", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
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
