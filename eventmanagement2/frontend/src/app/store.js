import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import ticketReducer from "../features/ticketSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    tickets: ticketReducer,
  },
});
//new code
