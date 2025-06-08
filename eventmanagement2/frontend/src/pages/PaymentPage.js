// src/pages/PaymentPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import PaymentButton from "../components/PaymentButton";

export default function PaymentPage() {
  const { id } = useParams(); // ticket ID
  const [ticket, setTicket] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const { data } = await api.get(`/tickets/${id}`);
        setTicket(data);
      } catch (err) {
        alert("Ticket not found");
      }
    };
    fetchTicket();
  }, [id]);

  const handleSuccess = () => {
    navigate(`/ticket/${id}`);
  };

  if (!ticket) return <p>Loading ticket...</p>;

  return (
    <div className="form-container">
      <h2>Pay for: {ticket.event.name}</h2>
      <p>Amount: ₹{ticket.event.entryFee}</p>
      <PaymentButton
        ticketId={id}
        amount={ticket.event.entryFee * 100}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
