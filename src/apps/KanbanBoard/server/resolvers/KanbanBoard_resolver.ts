import { AppContext } from "../../../../core/server/authentication/graphqlContext";
import { Board } from "../pgMigrations/create_kanban_schema.ts";
import { addNewBoard } from "../services/board_service.ts";

export default {
  Query: {
    getFromKanbanBoard: () => {
      return "Hello from the Kanban Board App!";
    },
  },
  Mutation: {
    createBoard: async (
      _: any,
      { input }: { input: { name: string } },
      context: AppContext
    ): Promise<Board> => {
      return await addNewBoard(input.name, context);
    },
  },
};
