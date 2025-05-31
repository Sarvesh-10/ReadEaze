// actions.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SignupFormData } from "../Pages/Signup";
import { LoginFormData } from "../Pages/Login";

// Thunk Action for Signup
export const signupUser = createAsyncThunk(
  "user/signupUser",
  async (formData: SignupFormData, { rejectWithValue }) => {
    const signupUrl = `${window.__ENV__.GO_BASE_URL}${window.__ENV__.SIGNUP_URL}`;
    try {
      const response = await axios.post(
        signupUrl,
        formData,
        {
          withCredentials: true
        }

      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Signup failed");
    }
  }
);
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (formData: LoginFormData, { rejectWithValue }) => {
    const loginUrl = `${window.__ENV__.GO_BASE_URL}${window.__ENV__.LOGIN_URL}`;
    try {
      const response = await axios.post(
        
        loginUrl,
        formData,
        {withCredentials: true}
      );
      console.log("response",response.data)
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);


export const generateImage = createAsyncThunk(
  "user/generateImage",
  async (text: string, { rejectWithValue }) => {
    try {
      const generateImageUrl = `${window.__ENV__.LLM_BASE_URL}${window.__ENV__.LLM_GENERATE_IMAGE_URL}`;
      const response = await axios.post(
        generateImageUrl,
        { prompt: text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
          responseType: "blob",
        }
      );

      const blob = response.data;
      const imageUrl = URL.createObjectURL(blob);
      return imageUrl;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Image generation failed");
    }
  }
);