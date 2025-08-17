const { execSync } = require("child_process");
import * as path from "path";

// Load .env file from the project root
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

// Construct the database URL from environment variables
const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;
const dbUrl = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

// Define the path to the core migrations folder
const migrationsDir = path.resolve(
  __dirname,
  `../src/core/server/pgMigrations`
);
const schemaName = "core";
// Construct the full node-pg-migrate command
const command = `DATABASE_URL=${dbUrl} tsx ./node_modules/.bin/node-pg-migrate up --create-schema true -m "${migrationsDir}" --schema "${schemaName}"`;

try {
  console.log("Running core migrations...");
  // Execute the command and show its output in the console
  execSync(command, { stdio: "inherit" });
  console.log("Core migrations completed successfully.");
} catch (error) {
  console.error("Error running core migrations.");
  process.exit(1);
}
