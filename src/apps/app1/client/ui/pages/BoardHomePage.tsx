import { BoardColumnType } from "../components/SprintPage/BoardColumn/BoardColumn";
import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import SprintBoard from "../components/SprintPage/SprintBoard/SprintBoard";
import { TicketType } from "../components/SprintPage/Ticket/Ticket";
import TicketDetailsPage from "../components/SprintPage/TicketDetails/TicketDetailsPage";

export const objectTickets: Record<string, TicketType> = {
  "T-109": {
    id: "T-109",
    title: "Haha Kyriako perimene",
    status: "Blocked",
    description: "los poulos",
    columnId: "blockedId",
  },
  "T-101": {
    id: "T-101",
    title: "Setup project repository",
    status: "To Do",
    description: "Sigoura Gamath?",
    columnId: "toDoId",
  },
  "T-102": {
    id: "T-102",
    title: "Define database schema",
    status: "To Do",
    description: "Sigoura Gamath?",
    columnId: "toDoId",
  },
  "T-103": {
    id: "T-103",
    title: "Develop user authentication API",
    status: "In Progress",
    description: "Sigoura Gamath?",
    columnId: "inProgressId",
  },
  "T-104": {
    id: "T-104",
    title: "Design the main dashboard UI",
    status: "In Progress",
    description: "Sigoura Gamath?",
    columnId: "inProgressId",
  },
  "T-110": {
    id: "T-102",
    title: "Define database schema",
    status: "To Do",
    description: "Sigoura Gamath?",
    columnId: "toDoId",
  },
  "T-111": {
    id: "T-103",
    title: "Develop user authentication API",
    status: "In Progress",
    description: "Sigoura Gamath?",
    columnId: "inProgressId",
  },
  "T-112": {
    id: "T-104",
    title: "Design the main dashboard UI",
    status: "In Progress",
    description: "Sigoura Gamath?",
    columnId: "inProgressId",
  },
  "T-113": {
    id: "T-102",
    title: "Define database schema",
    status: "To Do",
    description: "Sigoura Gamath?",
    columnId: "toDoId",
  },
  "T-114": {
    id: "T-103",
    title: "Develop user authentication API",
    status: "In Progress",
    description: "Sigoura Gamath?",
    columnId: "inProgressId",
  },
  "T-115": {
    id: "T-104",
    title: "Design the main dashboard UI",
    status: "In Progress",
    description: "Sigoura Gamath?",
    columnId: "inProgressId",
  },
  "T-116": {
    id: "T-102",
    title: "Define database schema",
    status: "To Do",
    description: "Sigoura Gamath?",
    columnId: "toDoId",
  },
  "T-117": {
    id: "T-103",
    title: "Develop user authentication API",
    status: "In Progress",
    description: "Sigoura Gamath?",
    columnId: "inProgressId",
  },
  "T-118": {
    id: "T-104",
    title: "Design the main dashboard UI",
    status: "In Progress",
    description: "Sigoura Gamath?",
    columnId: "inProgressId",
  },
  "T-105": {
    id: "T-105",
    title: "Implement real-time notifications",
    status: "In Progress",
    description: "Sigoura Gamath?",
    columnId: "inProgressId",
  },
  "T-106": {
    id: "T-106",
    title: "Code review for authentication module",
    status: "In Review",
    description: "Sigoura Gamath?",
    columnId: "inReviewId",
  },
  "T-107": {
    id: "T-107",
    title: "Deploy initial version to staging",
    status: "Done",
    description: "Sigoura Gamath?",
    columnId: "inReviewId",
  },
  "T-108": {
    id: "T-108",
    title: "Fix landing page CSS bug",
    status: "Done",
    description: "Sigoura Gamath?",
    columnId: "doneId",
  },
} as const;

const ticketsByColumnId = Object.values(objectTickets).reduce((acc, ticket) => {
  const { columnId } = ticket;
  if (!acc[columnId]) acc[columnId] = [];
  acc[columnId].push(ticket);
  return acc;
}, {} as Record<string, TicketType[]>);

const columns: Omit<BoardColumnType, "tickets">[] = [
  { _id: "blockedId", title: "Blocked", color: "purple" },
  {
    _id: "inSpecificationId",
    title: "In Specification",
    color: "#46858aff",
  },
  {
    _id: "toDoId",
    title: "To Do",
    color: "#ef4444", // Red
  },
  {
    _id: "inProgressId",
    title: "In Progress",
    color: "#3b82f6", // Blue
  },
  {
    _id: "inReviewId",
    title: "In Review",
    color: "#eab308", // Yellow
  },
  {
    _id: "doneId",
    title: "Done",
    color: "#22c55e", // Green
  },
] as const;

const initialBoardData: BoardColumnType[] = columns.map((column) => ({
  ...column,
  tickets: ticketsByColumnId[column._id] || [],
}));

const BoardHomePage = () => {
  const [darkMode, setDarkMode] = React.useState<boolean>(true);
  const location = useLocation();
  console.log(location);
  return (
    <Routes>
      <Route
        index
        element={<SprintBoard initialBoardData={initialBoardData} />}
      />
      <Route path="backlog" element={<div>Backlog Page</div>} />
      <Route path=":ticketId" element={<TicketDetailsPage />} />
    </Routes>
  );
};

export default BoardHomePage;
