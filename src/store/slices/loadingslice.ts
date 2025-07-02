// store/loadingSlice.ts
import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { loginUser, uploadBook, fetchBooks } from "../actions";

const loadingSlice = createSlice({
  name: "loading",
  initialState: {
    loading: false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        isAnyOf(loginUser.pending, uploadBook.pending, fetchBooks.pending),
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        isAnyOf(loginUser.fulfilled, uploadBook.fulfilled, fetchBooks.fulfilled),
        (state) => {
          state.loading = false;
        }
      )
      .addMatcher(
        isAnyOf(loginUser.rejected, uploadBook.rejected, fetchBooks.rejected),
        (state) => {
          state.loading = false;
        }
      );
  },
});

export default loadingSlice.reducer;
