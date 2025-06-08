import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import "../assets/styles/Login.css";

export default function Login() {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((s) => s.auth);

  const [errorMsg, setErrorMsg] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    setErrorMsg(null);
    try {
      // Only send email/password; server returns the real role
      const result = await dispatch(login(data)).unwrap();
      // Store token; role is in Redux state under auth.user.role
      localStorage.setItem("jwtToken", result.token);
      navigate("/events");
    } catch (err) {
      // err.payload.msg or err.error.message
      setErrorMsg(err.msg || err.error || "Login failed");
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Email</label>
        <input
          type="email"
          {...register("email", { required: "Email is required" })}
        />

        <label>Password</label>
        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            {...register("password", { required: "Password is required" })}
          />
          <button
            type="button"
            className="toggle-btn"
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Logging in…" : "Login"}
        </button>

        {errorMsg && <p className="error">{errorMsg}</p>}
      </form>
    </div>
  );
}
