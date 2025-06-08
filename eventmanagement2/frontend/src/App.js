import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Events from "./pages/Events";
import CreateEvent from "./pages/CreateEvent";
import RegisterEvent from "./pages/RegisterEvent";
import PaymentPage from "./pages/PaymentPage";
import TicketPage from "./pages/TicketPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import "./assets/styles/App.css";
import AdminRoute from "./components/AdminRoute";
import EditEvent from "./pages/EditEvent";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Events />} />
          <Route path="/events" element={<Events />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/events/:id"
            element={
              <ProtectedRoute>
                <RegisterEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-event"
            element={
              <ProtectedRoute>
                <CreateEvent />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-event/:id"
            element={
              <AdminRoute>
                <EditEvent />
              </AdminRoute>
            }
          />

          {/* Payment and Ticket Routes */}
          <Route
            path="/payment/:ticketId"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ticket/:id"
            element={
              <ProtectedRoute>
                <TicketPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
