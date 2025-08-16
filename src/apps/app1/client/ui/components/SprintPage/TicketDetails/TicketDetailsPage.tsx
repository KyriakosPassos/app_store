import React from "react";
import { useParams } from "react-router-dom";

const TicketDetailsPage = () => {
  const a = useParams();
  const { ticketId } = useParams();

  return (
    <div style={{ padding: "20px" }}>
      <h1>Details for Ticket: {ticketId}</h1>
      <p>Fetching and displaying all information for this ticket...</p>
    </div>
  );
};

export default TicketDetailsPage;
