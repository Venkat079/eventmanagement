import React, { useState } from "react";
import api from "../api/api";
import "../assets/styles/CreateEvent.css";

export default function CreateEvent() {
  const [data, setData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    cashPrize: "",
    tokenCost: "",
    tokenCap: "",
    tokenReward: "",
    totalSeats: "",
    entryFee: "",
    teamSize: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: data.title,
      description: data.description,
      date: new Date(data.date),
      time: data.time,
      location: data.location,
      cashPrize: Number(data.cashPrize),
      tokenCost: Number(data.tokenCost),
      tokenCap: Number(data.tokenCap),
      tokenReward: Number(data.tokenReward),
      ...(data.totalSeats ? { totalSeats: Number(data.totalSeats) } : {}),
      entryFee: Number(data.entryFee.replace(/[^\d.-]/g, "")),
      teamSize: Number(data.teamSize.replace(/[^\d.-]/g, "")),
    };

    try {
      const { data: saved } = await api.post("/events", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      alert("Event saved: " + saved.title);
    } catch (err) {
      alert(
        err.response?.data?.msg ||
          JSON.stringify(err.response?.data?.errors || err.message)
      );
    }
  };

  return (
    <div className="event-form-container">
      <form onSubmit={handleSubmit} className="event-form">
        <h2>Create Event</h2>

        <div className="form-grid">
          <label>Title</label>
          <input
            name="title"
            value={data.title}
            onChange={handleChange}
            required
          />

          <label>Description</label>
          <textarea
            name="description"
            value={data.description}
            onChange={handleChange}
            required
          />

          <label>Date</label>
          <input
            type="date"
            name="date"
            value={data.date}
            onChange={handleChange}
            required
          />

          <label>Time</label>
          <input
            name="time"
            value={data.time}
            onChange={handleChange}
            required
          />

          <label>Location</label>
          <input
            name="location"
            value={data.location}
            onChange={handleChange}
            required
          />

          <label>Cash Prize</label>
          <input
            name="cashPrize"
            value={data.cashPrize}
            onChange={handleChange}
            required
          />

          <label>Token Cost</label>
          <input
            name="tokenCost"
            value={data.tokenCost}
            onChange={handleChange}
            required
          />

          <label>Token Cap</label>
          <input
            name="tokenCap"
            value={data.tokenCap}
            onChange={handleChange}
            required
          />

          <label>Token Reward</label>
          <input
            name="tokenReward"
            value={data.tokenReward}
            onChange={handleChange}
            required
          />

          <label>Total Seats (leave blank for unlimited)</label>
          <input
            name="totalSeats"
            value={data.totalSeats}
            onChange={handleChange}
          />

          <label>Entry Fee (in ₹)</label>
          <input
            name="entryFee"
            value={data.entryFee}
            onChange={handleChange}
            placeholder="e.g. 100"
            required
          />

          <label>Team Size (1 for solo events)</label>
          <input
            name="teamSize"
            value={data.teamSize}
            onChange={handleChange}
            placeholder="e.g. 3"
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Create Event
        </button>
      </form>
    </div>
  );
}
