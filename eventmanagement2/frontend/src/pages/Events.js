import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents as fetchApprovedEvents } from "../features/ticketSlice";
import api from "../api/api";
import "../assets/styles/EventCard.css";
import { useNavigate } from "react-router-dom";

export default function Events() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { events, status, error } = useSelector((s) => s.tickets);

  useEffect(() => {
    const load = async () => {
      if (user?.role === "Admin") {
        try {
          const res = await api.get("/events/all", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          });
          dispatch({
            type: "tickets/fetchEvents/fulfilled",
            payload: res.data,
          });
        } catch (err) {
          dispatch({
            type: "tickets/fetchEvents/rejected",
            payload: err.response?.data || err.message,
          });
        }
      } else {
        dispatch(fetchApprovedEvents());
      }
    };
    load();
  }, [dispatch, user]);

  const approve = async (id) => {
    try {
      await api.put(
        `/events/${id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      dispatch({
        type: "tickets/fetchEvents/fulfilled",
        payload: events.map((e) =>
          e._id === id ? { ...e, status: "approved" } : e
        ),
      });
    } catch (err) {
      alert("Approval failed");
    }
  };

  const deleteEvent = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirm) return;

    try {
      await api.delete(`/events/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      dispatch({
        type: "tickets/fetchEvents/fulfilled",
        payload: events.filter((e) => e._id !== id),
      });
      alert("Event deleted successfully!");
    } catch (err) {
      alert("Delete failed");
    }
  };

  const renderEventCard = (event) => {
    const seatsLeft =
      event.totalSeats == null
        ? null
        : event.totalSeats - (event.seatsTaken || 0);

    const seatsText =
      event.totalSeats == null
        ? "Seats: Unlimited"
        : `Seats left: ${seatsLeft}`;

    return (
      <div className="card" key={event._id}>
        <h3>{event.title}</h3>
        <p>
          <strong>Description:</strong> {event.description}
        </p>
        <p>
          <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
        </p>
        <p>
          <strong>Time:</strong> {event.time}
        </p>
        <p>
          <strong>Location:</strong> {event.location}
        </p>
        <p>
          <strong>Cash Prize:</strong> ₹{event.cashPrize}
        </p>
        <p>
          <strong>Entry Fee:</strong> ₹{event.entryFee}
        </p>
        <p>
          <strong>Team Size:</strong> {event.teamSize} members
        </p>
        <p>
          <strong>Token Cost:</strong> {event.tokenCost} tokens
        </p>
        <p>
          <strong>Token Cap:</strong> Up to {event.tokenCap} token registrations
        </p>
        <p>
          <strong>Token Reward:</strong> Earn {event.tokenReward} tokens
        </p>
        <p>
          <strong>Token Seats Used:</strong> {event.tokenUsedCount} /{" "}
          {event.tokenCap}
        </p>
        <p>
          <strong>Organizer:</strong> {event.organizer?.name || "TBA"}
        </p>
        <p>
          <strong>Status:</strong> {event.status}
        </p>
        <p>
          <em>{seatsText}</em>
        </p>
        <button
          disabled={event.totalSeats !== null && seatsLeft <= 0}
          onClick={() => navigate(`/events/${event._id}`)}
        >
          Register
        </button>
      </div>
    );
  };

  if (status === "loading") return <p>Loading events…</p>;
  if (status === "failed") return <p className="error">Error: {error}</p>;

  return (
    <div className="grid-container">
      {events.map((ev) => (
        <div key={ev._id} style={{ position: "relative" }}>
          {renderEventCard(ev)}

          {user?.role === "Admin" && (
            <div
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <div className="event-actions">
                {ev.status === "pending" && (
                  <button
                    className="approve-btn"
                    onClick={() => approve(ev._id)}
                  >
                    Approve
                  </button>
                )}
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/edit-event/${ev._id}`)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => deleteEvent(ev._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
