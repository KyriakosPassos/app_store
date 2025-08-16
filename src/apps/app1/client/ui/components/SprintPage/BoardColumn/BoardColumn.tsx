import React from "react";
import Ticket, { TicketType } from "../Ticket/Ticket";
import { allowedPaths, ColumnTitle } from "../../../Contstants";

export type BoardColumnType = {
  _id: string;
  title: ColumnTitle;
  color: string;
  tickets: TicketType[];
};
interface IProps {
  column: BoardColumnType;
  handleDrop: (
    ticketId: string,
    sourceColumnTitle: ColumnTitle,
    destinationColumnTitle: ColumnTitle
  ) => void;
  draggedItemInfo: {
    ticketId: string;
    sourceColumnTitle: ColumnTitle;
  } | null;
  handleDragStart: (ticketId: string, sourceColumnTitle: ColumnTitle) => void;
  handleDragEnd: () => void;
}
const Column = (props: IProps) => {
  const someCondition = true;

  const columnStyle = {
    "--border-color": props.column.color,
    ...(someCondition && {
      "--incoming-inset": "-4px",
      "--incoming-blur": "blur(0.5rem)",
      "--incoming-animation": "pulse 2.5s infinite",
    }),
  } as React.CSSProperties;

  const sourceColumn = props.draggedItemInfo?.sourceColumnTitle;
  const isValidTarget =
    sourceColumn &&
    (allowedPaths[sourceColumn] as readonly string[])?.includes(
      props.column.title
    );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (sourceColumn === props.column.title) return;
    if (isValidTarget) {
      e.preventDefault();
      e.currentTarget.classList.add("drag-over");
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove("drag-over");
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove("drag-over");
    const ticketId = e.dataTransfer.getData("ticketId");
    const sourceColumnTitle = e.dataTransfer.getData(
      "sourceColumnTitle"
    ) as ColumnTitle;

    props.handleDrop(ticketId, sourceColumnTitle, props.column.title);
  };

  return (
    <div
      className={`animated-border-column ${
        isValidTarget ? "is-valid-target" : ""
      }`}
      style={columnStyle}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={onDrop}
    >
      <div className="column-content">
        <div className="column-header">
          <div
            className="column-header-dot"
            style={{ backgroundColor: props.column.color }}
          />
          <h2 className="column-header-title">{props.column.title}</h2>
        </div>
        <div className="tickets-container">
          {props.column.tickets.map((ticket) => (
            <Ticket
              key={ticket.id}
              ticket={ticket}
              sourceColumnTitle={props.column.title}
              handleDragStart={props.handleDragStart}
              handleDragEnd={props.handleDragEnd}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Column;
