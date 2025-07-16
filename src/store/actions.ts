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
    // const loginUrl = 'http://localhost:8080/login';
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
    // const fetchBooksUrl = 'http://localhost:8080/books';
    try {
      const response = await axiosInstance.get(fetchBooksUrl, {
        withCredentials: true, // Include cookies in requests
      });
      // Check if response.data is a non-empty array before mapping
      const booksData =
        Array.isArray(response.data) && response.data.length > 0
          ? response.data.map(
              (book: { id: number; name: string; cover_image?: string }) => ({
                id: book.id,
                title: book.name,
                image: book.cover_image || "/assets/dummy-book.jpg", // Use default if no cover
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
      // const uploadUrl = 'http://localhost:8080/upload';
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

export const getBookById = createAsyncThunk(
  "books/getBookById",
async(id:number, { rejectWithValue }) => {
  const getBookByIdUrl = `${window.__ENV__.GO_BASE_URL}${window.__ENV__.GET_BOOKS}/${id}`;
  try {
    const response = await axiosInstance.get(getBookByIdUrl, {
      withCredentials: true, // Include cookies in requests
      responseType: "blob", // Expect a PDF blob
    });
    console.log("response", response.data);
    return URL.createObjectURL(response.data); // Return the blob URL
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Failed to fetch book");
  }
});

export const getChatHistory = createAsyncThunk(
  "chat/getChatHistory",
  async (bookId: string, { rejectWithValue }) => {
    const getChatHistoryUrl = `${window.__ENV__.LLM_BASE_URL}${window.__ENV__.LLM_CHAT_HISTORY_URL}/${bookId}`;
    try {
      const response = await axiosInstance.get(getChatHistoryUrl, {
        withCredentials: true, // Include cookies in requests
        headers: { "Content-Type": "application/json" },
      });
      return response.data; // Assuming the response is in the expected format
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch chat history");
    }
  }
);