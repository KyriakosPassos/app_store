import { execSync } from "child_process";
import * as path from "path";

// Load .env file from the project root
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
// Use process.cwd() to reliably find the project root
const projectRoot = process.cwd();

// Get the app name from the command line
const appName = process.argv[2];
if (!appName) {
  console.error("Error: Please provide an app name.");
  console.log("Usage: npm run migrate:app <app-name>");
  process.exit(1);
}

// Construct the database URL
const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;
const dbUrl = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
const migrationsDir = path.resolve(
  projectRoot,
  `src/apps/${appName}/server/pgMigrations`
);
const schemaName = appName;

const command = `DATABASE_URL=${dbUrl} tsx ./node_modules/.bin/node-pg-migrate up --create-schema true -m "${migrationsDir}" --schema "${schemaName}"`;

try {
  console.log(`Running migration for app: ${appName}`);
  execSync(command, { stdio: "inherit" });
  console.log(`Migration for ${appName} completed successfully.`);
} catch (error) {
  console.error(`Error running migration for ${appName}.`);
  process.exit(1);
}
