// authSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { axiosInstance } from "../../axios/axios";

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  authChecked: boolean;
}

interface User {
  _id: string;
  username: string;
  email: string;
  phone?: string;
  role: string;
  profilePic: string;
  updatedAt?: string;
}

export const checkAuth = createAsyncThunk("auth/checkAuth", async () => {
  const { data } = await axiosInstance.get("/auth/me");
  return data.user as User;
});

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  authChecked: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<User>) {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.authChecked = true;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.authChecked = true;
    },
    updateUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.authChecked = false;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.authChecked = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.authChecked = true;
      });
  },
});

export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
