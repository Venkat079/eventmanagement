import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { downloadTicket } from "../features/ticketSlice";

export default function TicketPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { status, error } = useSelector((s) => s.tickets);

  useEffect(() => {
    const teammates = JSON.parse(localStorage.getItem("teammates") || "[]");

    dispatch(downloadTicket({ id, teammates }));
  }, [dispatch, id]);

  return (
    <div className="ticket-container">
      {status === "loading" && <p>Downloading your ticket…</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
