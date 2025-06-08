// src/features/ticketSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";

// Fetch only approved events
export const fetchEvents = createAsyncThunk(
  "tickets/fetchEvents",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/events");
      return data.filter((e) => e.status === "approved");
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// Register for an event
export const registerEvent = createAsyncThunk(
  "tickets/registerEvent",
  async ({ eventId, useTokens }, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const { data } = await api.post(
        "/tickets/register",
        { eventId, useTokens },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// Download ticket PDF
export const downloadTicket = createAsyncThunk(
  "tickets/downloadTicket",
  async ({ id, teammates }, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const resp = await api.get(
        `/tickets/${id}/pdf?teammates=${encodeURIComponent(
          JSON.stringify(teammates)
        )}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      // 🧠 Move download logic here
      const blob = resp.data;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ticket.pdf";
      a.click();

      // ✅ Clear teammates
      localStorage.removeItem("teammates");

      return id; // just return ID, not blob
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

const ticketSlice = createSlice({
  name: "tickets",
  initialState: {
    events: [],
    status: "idle",
    error: null,
    lastRegistered: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (s) => {
        s.status = "loading";
      })
      .addCase(fetchEvents.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.events = a.payload;
      })
      .addCase(fetchEvents.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload?.msg || a.error.message;
      })
      .addCase(registerEvent.pending, (s) => {
        s.status = "loading";
      })
      .addCase(registerEvent.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.lastRegistered = a.payload;
      })
      .addCase(registerEvent.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload?.msg || a.error.message;
      })
      .addCase(downloadTicket.pending, (s) => {
        s.status = "loading";
      })
      .addCase(downloadTicket.fulfilled, (s) => {
        s.status = "succeeded";
      })
      .addCase(downloadTicket.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload?.msg || a.error.message;
      });
  },
});

export default ticketSlice.reducer;
//new new code
