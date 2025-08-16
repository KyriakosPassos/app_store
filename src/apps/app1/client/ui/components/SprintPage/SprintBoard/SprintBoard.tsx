import Column, { BoardColumnType } from "../BoardColumn/BoardColumn";
import Styles from "../../../styles/BoardStyles";
import { allowedPaths, ColumnTitle } from "../../../Contstants";
import React from "react";
import { TicketType } from "../Ticket/Ticket";

interface IProps {
  initialBoardData: BoardColumnType[];
}

const SprintBoard = (props: IProps) => {
  const [boardData, setBoardData] = React.useState<BoardColumnType[]>(
    props.initialBoardData
  );
  const [darkMode, setDarkMode] = React.useState<boolean>(true);

  const [draggedItemInfo, setDraggedItemInfo] = React.useState<{
    ticketId: string;
    sourceColumnTitle: ColumnTitle;
  } | null>(null);

  const handleDragStart = (
    ticketId: string,
    sourceColumnTitle: ColumnTitle
  ) => {
    setDraggedItemInfo({ ticketId, sourceColumnTitle });
  };

  const handleDragEnd = React.useCallback(() => {
    setDraggedItemInfo(null);
  }, []);

  const handleDrop = (
    ticketId: string,
    sourceColumnTitle: ColumnTitle,
    destinationColumnTitle: ColumnTitle
  ) => {
    const allowed: readonly string[] = allowedPaths[sourceColumnTitle];
    if (!allowed || !allowed.includes(destinationColumnTitle)) {
      return;
    }

    let ticketToMove: TicketType;
    const newBoardData = [...boardData];
    const sourceColumn = newBoardData.find(
      (col: BoardColumnType) => col.title === sourceColumnTitle
    );
    if (!sourceColumn) return;

    const sourceTicketIndex = sourceColumn.tickets.findIndex(
      (ticket) => ticket.id === ticketId
    );
    if (sourceTicketIndex > -1) {
      ticketToMove = sourceColumn.tickets.splice(sourceTicketIndex, 1)[0];
    }

    const destinationColumn = newBoardData.find(
      (col: BoardColumnType) => col.title === destinationColumnTitle
    );
    ticketToMove!.status = destinationColumn!?.title;
    if (destinationColumn && ticketToMove!) {
      destinationColumn.tickets.push(ticketToMove);
    }
    handleDragEnd();
    setBoardData(newBoardData);
  };

  return (
    <>
      <Styles darkMode={darkMode} />
      <div className="app-container">
        <h1 className="header-title">Project Kanban Board</h1>
        <div
          className={`board-grid ${draggedItemInfo ? "is-dragging" : ""}`}
          style={{
            gridTemplateColumns: `repeat(${boardData.length}, 1fr)`,
          }}
        >
          {boardData.map((column) => (
            <Column
              key={column.title}
              column={column}
              handleDrop={handleDrop}
              draggedItemInfo={draggedItemInfo}
              handleDragStart={handleDragStart}
              handleDragEnd={handleDragEnd}
            />
          ))}
        </div>
      </div>
      {/* <button onClick={() => setDarkMode((prev) => !prev)}>TEST</button> */}
    </>
  );
};

export default SprintBoard;
