import React from "react";
import api from "../api/api";

export default function PaymentButton({
  eventId,
  teamMembers,
  amount,
  onSuccess,
}) {
  const handleClick = async () => {
    try {
      const {
        data: { key },
      } = await api.get("/payments/key");

      const {
        data: { order, ticketId },
      } = await api.post("/payments/create-order", {
        eventId,
        teamMembers,
      });

      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "Event Payment",
        order_id: order.id,
        handler: async (response) => {
          try {
            await api.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              ticketId,
            });

            onSuccess(ticketId);
          } catch (err) {
            alert("Payment verification failed");
          }
        },
        prefill: {
          email: localStorage.getItem("userEmail") || "",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Razorpay Error:", error);
      alert("Payment setup failed");
    }
  };

  return <button onClick={handleClick}>Pay ₹{amount}</button>;
}
