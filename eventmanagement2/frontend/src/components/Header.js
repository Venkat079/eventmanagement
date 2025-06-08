// src/components/Header.js
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/authSlice";
import api from "../api/api";
import "../assets/styles/Header.css";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const [tokenBalance, setTokenBalance] = useState(null);

  useEffect(() => {
    const fetchTokenBalance = async () => {
      try {
        if (user?.role === "Student") {
          const res = await api.get("/auth/me/tokens", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          });
          setTokenBalance(res.data.tokens);
        }
      } catch (err) {
        console.error("Failed to fetch token balance:", err);
      }
    };

    fetchTokenBalance();
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header__logo" onClick={() => navigate("/")}>
        Event Management
      </div>
      <nav className="header__nav">
        <NavLink to="/events">Events</NavLink>
        {user && <NavLink to="/create-event">Create Event</NavLink>}
        {user ? (
          <>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </nav>
      {user?.role === "Student" && tokenBalance != null && (
        <div className="header__tokens">🎟️ Tokens: {tokenBalance}</div>
      )}
    </header>
  );
}
