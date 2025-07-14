// actions.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SignupFormData } from "../Pages/Signup";
import { LoginFormData } from "../Pages/Login";
import axiosInstance from "../axiosInterceptor";

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
    console.log("loginUrl",loginUrl)
    try {
      const response = await axios.post(
        
        loginUrl,
        formData,
        {withCredentials: true}
      );
      console.log("response",response.data)
      return response.data;
    } catch (error: any) {
      console.error("Login error:", error);
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

export const fetchBooks = createAsyncThunk(
  "books/fetchBooks",
  async (_, { rejectWithValue }) => {
    const fetchBooksUrl = `${window.__ENV__.GO_BASE_URL}${window.__ENV__.GET_BOOKS}`;
    try {
      const response = await axiosInstance.get(fetchBooksUrl, {
        withCredentials: true, // Include cookies in requests
      });
      // Check if response.data is a non-empty array before mapping
      const booksData =
        Array.isArray(response.data) && response.data.length > 0
          ? response.data.map(
              (book: { id: number; name: string; coverUrl?: string }) => ({
                id: book.id,
                title: book.name,
                image: book.coverUrl || "/assets/dummy-book.jpg", // Use default if no cover
              })
            )
          : []; // empty array if no data or not an array

      return booksData;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch books");
    }
  }
);


// store/actions.ts
export const uploadBook = createAsyncThunk(
  "books/uploadBook",
  async (file: File, { rejectWithValue }) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const uploadUrl = `${window.__ENV__.GO_BASE_URL}${window.__ENV__.UPLOAD_BOOK}`;
     await axiosInstance.post(
        uploadUrl,
        formData,
        {
          withCredentials: true, // Include cookies in requests
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
     
      return "Success";
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Upload failed");
    }
  }
);
