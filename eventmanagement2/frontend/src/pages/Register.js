import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { register as registerAction } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import "../assets/styles/Login.css"; // reuse same form styles

export default function Register() {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status } = useSelector((s) => s.auth);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    setErrorMsg(null);
    try {
      await dispatch(registerAction(data)).unwrap();
      navigate("/events");
    } catch (err) {
      setErrorMsg(err.msg || err.error || "Registration failed");
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Name</label>
        <input {...register("name", { required: "Name is required" })} />

        <label>Email</label>
        <input
          type="email"
          {...register("email", { required: "Email is required" })}
        />

        <label>Password</label>
        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Min length is 6" },
            })}
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
          {status === "loading" ? "Registering…" : "Register"}
        </button>

        {errorMsg && <p className="error">{errorMsg}</p>}
      </form>
    </div>
  );
}
//new code
