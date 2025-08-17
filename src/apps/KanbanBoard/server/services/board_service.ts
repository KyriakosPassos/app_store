import { AppContext } from "@core/server/authentication/graphqlContext";
import { Board } from "../pgMigrations/create_kanban_schema";

export const addNewBoard = async (
  name: string,
  context: AppContext
): Promise<Board> => {
  const sql = `INSERT INTO boards (name) VALUES ($1) RETURNING *`;
  const params = [name];

  try {
    const newBoards = await context.db.query<Board>(sql, params);
    return newBoards[0];
  } catch (error) {
    console.error("Failed to create board:", error);
    // In a real app, you'd throw a more specific GraphQL error.
    throw new Error("Could not create board.");
  }
};
