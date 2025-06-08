// src/api/api.js
import axios from "axios";

// — Axios instance with JSON content type and base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// — Attach JWT from localStorage to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwtToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// — Global error interceptor: unwrap JSON, fall back to text/blob
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      const ct = error.response.headers["content-type"] || "";
      if (ct.includes("application/json")) {
        return Promise.reject(error.response.data);
      } else {
        const blob = error.response.data;
        const text = await blob.text?.();
        return Promise.reject({ msg: text || "Unknown server error" });
      }
    }
    return Promise.reject({ msg: "Network error or no response from server" });
  }
);

// — Razorpay payment flows —

// 1. Fetch your Razorpay key
export const getRazorpayKey = () => api.get("/payments/key");

// 2. Create a Razorpay order (amount in ₹, plus ticketId to tie back)
export const createOrder = (amount, ticketId) =>
  api.post("/payments/create-order", { amount, ticketId });

// 3. Verify a successful payment (server checks signature & marks paid)
export const verifyPayment = (
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  ticketId
) =>
  api.post("/payments/verify", {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    ticketId,
  });

// — Ticket registration (token or cash fallback) —
export const registerEvent = (eventId, useTokens = true) =>
  api.post("/tickets/register", { eventId, useTokens });

// (Deprecated) you can drop this, since payment now goes through Razorpay flow:
// export const issueTicket = (eventId, method) =>
//   api.post("/tickets/register", { eventId, useTokens: method === "token" });

// — Event management —
export const getEvents = () => api.get("/events");

export const getAllEvents = () => api.get("/events/all");

export const approveEvent = (eventId) => api.put(`/events/${eventId}/approve`);

export const fetchEventDetails = (id) => api.get(`/events/${id}`);

// — Export the configured Axios instance as default —
export default api;
