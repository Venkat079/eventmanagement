import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchEvents, registerEvent } from "../features/ticketSlice";
import PaymentButton from "../components/PaymentButton";
import "../assets/styles/RegisterEvent.css";

export default function RegisterEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { events, status } = useSelector((state) => state.tickets);

  const event = events.find((e) => e._id === id);

  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    if (events.length === 0) {
      dispatch(fetchEvents());
    }
  }, [dispatch, events.length]);

  const handleRegisterWithTokens = () => {
    dispatch(
      registerEvent({ eventId: id, useTokens: true, teammates: teamMembers })
    )
      .unwrap()
      .then((res) => {
        // 🟢 Save teammates in localStorage temporarily
        if (teamMembers.length > 0) {
          localStorage.setItem("teammates", JSON.stringify(teamMembers));
        }
        navigate(`/ticket/${res.ticket._id}`);
      })
      .catch((err) => {
        alert(err?.message || "Token registration failed");
      });
  };

  const handleTeamInputChange = (index, field, value) => {
    const updated = [...teamMembers];
    updated[index] = { ...updated[index], [field]: value };
    setTeamMembers(updated);
  };

  const renderTeamInputs = () => {
    const size = event?.teamSize || 1;
    const inputs = [];
    for (let i = 0; i < size - 1; i++) {
      inputs.push(
        <div key={i} className="teammate-box">
          <label className="teammate-label">Teammate {i + 1}</label>
          <input
            type="text"
            placeholder={`Name`}
            value={teamMembers[i]?.name || ""}
            onChange={(e) => handleTeamInputChange(i, "name", e.target.value)}
            required
          />
          <input
            type="email"
            placeholder={`Email`}
            value={teamMembers[i]?.email || ""}
            onChange={(e) => handleTeamInputChange(i, "email", e.target.value)}
            required
          />
        </div>
      );
    }
    return inputs;
  };

  if (!event) return <p>Loading event details...</p>;

  return (
    <div className="register-event-container">
      <h2>Register for: {event.title}</h2>
      <p>{event.description}</p>
      <p>Entry Fee: ₹{event.entryFee}</p>
      <p>Token Cost: {event.tokenCost}</p>

      {event.teamSize > 1 && (
        <div className="team-section">
          <h3>Team Members (excluding you)</h3>
          {renderTeamInputs()}
        </div>
      )}

      <div>
        <button
          onClick={handleRegisterWithTokens}
          disabled={
            status === "loading" || event.tokenCap <= event.tokenUsedCount
          }
        >
          Use Tokens ({event.tokenCost})
        </button>
      </div>

      <div>
        <PaymentButton
          eventId={id}
          teamMembers={teamMembers}
          amount={event.entryFee}
          onSuccess={(ticketId) => navigate(`/ticket/${ticketId}`)}
        />
      </div>
    </div>
  );
}
