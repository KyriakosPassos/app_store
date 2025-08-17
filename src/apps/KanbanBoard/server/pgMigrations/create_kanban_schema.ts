import { MigrationBuilder } from "node-pg-migrate";

// --- TypeScript Type Definitions ---
// These interfaces define the shape of our data for use in the application code.

export interface Board {
  id: number;
  name: string;
  created_at: Date;
}

export interface Column {
  id: number;
  board_id: number;
  title: string;
  position: number;
  color?: string | null;
  created_at: Date;
}

export interface Ticket {
  id: number;
  column_id: number;
  title: string;
  description?: string | null;
  position: number;
  created_at: Date;
}

// --- Database Migration ---
// This section contains the instructions for creating the database tables.

export async function up(pgm: MigrationBuilder): Promise<void> {
  // 1. Create the 'boards' table
  pgm.createTable("boards", {
    id: "id",
    name: { type: "varchar(255)", notNull: true },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  // 2. Create the 'columns' table with a foreign key to 'boards'
  pgm.createTable("columns", {
    id: "id",
    board_id: {
      type: "integer",
      notNull: true,
      references: '"boards"(id)',
      onDelete: "CASCADE", // If a board is deleted, its columns are also deleted.
    },
    title: { type: "varchar(100)", notNull: true },
    position: { type: "integer", notNull: true },
    color: { type: "varchar(7)" },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  // 3. Create the 'tickets' table with a foreign key to 'columns'
  pgm.createTable("tickets", {
    id: "id",
    column_id: {
      type: "integer",
      notNull: true,
      references: '"columns"(id)',
      onDelete: "CASCADE", // If a column is deleted, its tickets are also deleted.
    },
    title: { type: "varchar(255)", notNull: true },
    description: { type: "text" },
    position: { type: "integer", notNull: true },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  // 4. Add indexes to foreign key columns for faster queries
  pgm.createIndex("columns", "board_id");
  pgm.createIndex("tickets", "column_id");
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  // To reverse the migration, we drop tables in the reverse order of creation
  // to avoid foreign key constraint errors.
  pgm.dropTable("tickets");
  pgm.dropTable("columns");
  pgm.dropTable("boards");
}
