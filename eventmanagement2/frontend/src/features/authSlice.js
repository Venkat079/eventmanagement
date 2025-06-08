import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";

const tokenKey = "jwtToken";
const savedToken = localStorage.getItem(tokenKey);
const savedUser = localStorage.getItem("user");

const initialState = {
  token: savedToken || null,
  user: savedUser ? JSON.parse(savedUser) : null,
  status: "idle",
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (creds, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/login", creds);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (info, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/register", info);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem(tokenKey);
      localStorage.removeItem("user");
    },
  },
  extraReducers: (b) =>
    b
      .addCase(login.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(login.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.token = a.payload.token;
        s.user = a.payload.user;
        localStorage.setItem(tokenKey, a.payload.token);
        localStorage.setItem("user", JSON.stringify(a.payload.user));
      })
      .addCase(login.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload?.msg || a.error.message;
      })
      .addCase(register.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(register.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.token = a.payload.token;
        s.user = a.payload.user;
        localStorage.setItem(tokenKey, a.payload.token);
        localStorage.setItem("user", JSON.stringify(a.payload.user));
      })
      .addCase(register.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload?.msg || a.error.message;
      }),
});

export const { logout } = slice.actions;
export default slice.reducer;
//new code
