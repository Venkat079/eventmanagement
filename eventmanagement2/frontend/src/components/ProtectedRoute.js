import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  return useSelector((s) => s.auth.token) ? children : <Navigate to="/login" />;
}
//new code
