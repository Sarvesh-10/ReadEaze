// reducers.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginUser, signupUser } from "./actions";

interface User {
  id: number;
  name: string;
  email: string;
}
type UserState = {
  user: User | null;
  loading: boolean;
};

const initialState: UserState = {
  user: null,
  loading: false,
};

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(signupUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(signupUser.fulfilled, (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.loading = false;
    });
    builder.addCase(signupUser.rejected, (state) => {
      state.loading = false;
      state.user = null;
    });
    builder.addCase(loginUser.pending, (state) => {
        state.loading = true;
    });
    builder.addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.loading = false;
    });
    builder.addCase(loginUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
    });
  },
});

export default slice.reducer;