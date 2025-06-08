import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import "../assets/styles/EditEvent.css";

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        setEvent(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load event");
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent({ ...event, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/events/${id}`, event, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      alert("Event updated successfully!");
      navigate("/"); // redirect to home or admin panel
    } catch (err) {
      alert("Update failed");
    }
  };

  if (loading) return <p>Loading event data...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="edit-event-container">
      <h2>Edit Event</h2>
      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input name="title" value={event.title} onChange={handleChange} />

        <label>Description</label>
        <textarea
          name="description"
          value={event.description}
          onChange={handleChange}
        />

        <label>Date</label>
        <input
          type="date"
          name="date"
          value={event.date?.split("T")[0]}
          onChange={handleChange}
        />

        <label>Time</label>
        <input name="time" value={event.time} onChange={handleChange} />

        <label>Location</label>
        <input name="location" value={event.location} onChange={handleChange} />

        <label>Entry Fee (₹)</label>
        <input
          type="number"
          name="entryFee"
          value={event.entryFee}
          onChange={handleChange}
        />

        <label>Cash Prize (₹)</label>
        <input
          type="number"
          name="cashPrize"
          value={event.cashPrize}
          onChange={handleChange}
        />

        <label>Token Cost</label>
        <input
          type="number"
          name="tokenCost"
          value={event.tokenCost}
          onChange={handleChange}
        />

        <label>Token Seats Limit</label>
        <input
          type="number"
          name="tokenCap"
          value={event.tokenCap}
          onChange={handleChange}
        />

        <label>Token Reward</label>
        <input
          type="number"
          name="tokenReward"
          value={event.tokenReward}
          onChange={handleChange}
        />

        <label>Team Size</label>
        <input
          type="number"
          name="teamSize"
          value={event.teamSize}
          onChange={handleChange}
        />

        <label>Total Seats</label>
        <input
          type="number"
          name="totalSeats"
          value={event.totalSeats}
          onChange={handleChange}
        />

        <button type="submit">Update</button>
      </form>
    </div>
  );
}
