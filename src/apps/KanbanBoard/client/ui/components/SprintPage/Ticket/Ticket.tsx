import React from "react";
import { ColumnTitle } from "../../../Contstants";
import { Link } from "react-router-dom";

export type TicketType = {
  id: string;
  title: string;
  status: ColumnTitle;
  description: string;
  columnId: string;
};

interface IProps {
  ticket: TicketType;
  sourceColumnTitle: ColumnTitle;
  handleDragStart: (ticketId: string, sourceColumnTitle: ColumnTitle) => void;
  handleDragEnd: () => void;
}

const Ticket = (props: IProps) => {
  const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("ticketId", props.ticket.id);
    e.dataTransfer.setData("sourceColumnTitle", props.sourceColumnTitle);
    props.handleDragStart(props.ticket.id, props.sourceColumnTitle);
  };

  const onDragEnd = () => {
    props.handleDragEnd();
  };

  return (
    <div
      className="ticket"
      draggable={true}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <p className="ticket-title">{props.ticket.title}</p>
      <Link to={`/Board/homePage/${props.ticket.id}`} className="ticket-id">
        {props.ticket.id}
      </Link>
    </div>
  );
};

export default Ticket;
